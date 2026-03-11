export function pickFemaleEnglishVoice(voices: SpeechSynthesisVoice[] = []): SpeechSynthesisVoice | null {
  const femaleHints = ['female', 'woman', 'zira', 'hazel', 'samantha', 'victoria', 'karen', 'moira', 'ava', 'allison', 'aria', 'jenny'];

  const englishVoices = voices.filter((voice) => String(voice.lang || '').toLowerCase().startsWith('en'));
  const preferred = englishVoices.find((voice) => {
    const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();
    return femaleHints.some((hint) => label.includes(hint));
  });

  return preferred || englishVoices[0] || voices[0] || null;
}
