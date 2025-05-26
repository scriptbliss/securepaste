import { useState } from 'react';

export function useCopyToClipboard(text: string, delay = 2000) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), delay);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Copy failed:', err);
    }
  };

  return { copied, handleCopy };
}
