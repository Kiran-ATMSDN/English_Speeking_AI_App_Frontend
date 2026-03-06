export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  const err = error as {
    error?: { message?: string; error?: string };
    message?: string;
  };

  return err?.error?.message || err?.error?.error || err?.message || fallback;
}
