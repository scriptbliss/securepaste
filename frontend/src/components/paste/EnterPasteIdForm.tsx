interface EnterPasteIdFormProps {
  pasteId: string;
  setPasteId: (id: string) => void;
  onSubmit: () => void;
  error?: string;
}

export default function EnterPasteIdForm({
  pasteId,
  setPasteId,
  onSubmit,
  error,
}: EnterPasteIdFormProps) {
  return (
    <div className="container-main">
      <h2 className="text-xl font-semibold mb-4">Enter Paste ID</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          required
          value={pasteId}
          onChange={(e) => setPasteId(e.target.value)}
          placeholder="Paste ID (UUID)"
          className="input-base"
        />
        <button type="submit" className="button-submit-base mt-4 block mx-auto">
          Go
        </button>
      </form>
      {error && <p className="error-text mt-2">{error}</p>}
    </div>
  );
}
