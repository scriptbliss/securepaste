import PasteBlock from "../ui/PasteBlock";

interface Paste {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  viewLimit?: number | null;
}

interface PasteContentProps {
  paste: Paste;
  onReset: () => void;
}

export default function PasteContent({ paste, onReset }: PasteContentProps) {
  return (
    <div className="container-main max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-12 space-y-8">
      {/* Metadata */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Paste ID:{" "}
          <span className="text-blue-600 dark:text-blue-400">{paste.id}</span>
        </h1>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            <strong>Created:</strong>{" "}
            {new Date(paste.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {new Date(paste.updatedAt).toLocaleString()}
          </p>
          <p>
            <strong>Expires:</strong>{" "}
            {paste.expiresAt
              ? new Date(paste.expiresAt).toLocaleString()
              : "Never"}
          </p>
          <p>
            <strong>View Limit:</strong> {paste.viewLimit ?? "Unlimited"}
          </p>
        </div>
      </div>

      <PasteBlock title="Paste Content" content={paste.content} />

      {/* Reset button */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="button-submit-base inline-flex items-center"
        >
          Load Another Paste
        </button>
      </div>
    </div>
  );
}
