import LoadingDots from "../ui/LoadingDots";

interface PasswordFormProps {
  password: string;
  setPassword: (password: string) => void;
  onSubmit: () => void;
  loadingPasteData: boolean;
  error?: string;
}

export default function PasswordForm({
  password,
  setPassword,
  onSubmit,
  loadingPasteData,
  error,
}: PasswordFormProps) {
  return (
    <div className="container-main">
      <h1 className="text-xl font-semibold mb-4">Enter Password</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="password"
          value={password}
          required
          minLength={5}
          maxLength={10}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input-base mb-4"
        />
        <button
          type="submit"
          disabled={loadingPasteData}
          className="button-submit-base block mx-auto"
        >
          {loadingPasteData ? (
            <span>
              Verifying
              <LoadingDots />
            </span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
      {error && <p className="error-text mt-2">{error}</p>}
    </div>
  );
}
