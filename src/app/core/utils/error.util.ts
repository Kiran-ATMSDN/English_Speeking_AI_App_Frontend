export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  const err = error as {
    error?: { message?: string; error?: string } | string;
    message?: string;
    status?: number;
    statusText?: string;
  };

  if (err?.status === 0) {
    return 'Network error: backend unreachable or blocked by CORS/mixed-content.';
  }

  if (err?.status === 401) {
    return 'Unauthorized: please login again.';
  }

  if (err?.status === 413) {
    return 'Audio payload too large. Please use a smaller file (max 25MB).';
  }

  if (err?.status && err.status >= 500) {
    return 'Server error while processing request. Check backend logs for details.';
  }

  if (typeof err?.error === 'string' && err.error.trim()) {
    return err.error;
  }

  const messageFromPayload =
    typeof err?.error === 'object' && err.error
      ? (err.error as { message?: string; error?: string }).message ||
        (err.error as { message?: string; error?: string }).error
      : '';

  const base = messageFromPayload || err?.message || fallback;
  return err?.status ? `${base} (HTTP ${err.status}${err.statusText ? ` ${err.statusText}` : ''})` : base;
}
