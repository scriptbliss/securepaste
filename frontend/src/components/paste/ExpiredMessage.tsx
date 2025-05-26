interface ExpiredMessageProps {
  onReset: () => void;
}

export default function ExpiredMessage({ onReset }: ExpiredMessageProps) {
  return (
    <div className="container-main text-center">
      <h1 className="text-xl font-semibold mb-4">This paste has expired.</h1>
      <button onClick={onReset} className="button-submit-base">
        Enter Another Paste ID
      </button>
    </div>
  );
}
