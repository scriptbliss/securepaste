import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PasteBlockProps {
  title: string;
  content: string;
}

export default function PasteBlock({ title, content }: PasteBlockProps) {
  const { copied, handleCopy } = useCopyToClipboard(content);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-50 dark:bg-gray-900 p-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words font-mono overflow-x-auto">
        {content}
      </pre>
    </div>
  );
}
