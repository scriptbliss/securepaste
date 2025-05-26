"use client";
// import PasswordModal from '@/../components/PasswordModal';

// export default function PastePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = React.use(params);
//   const [paste, setPaste] = useState<string | null>(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(true);

//   return (
//     <>
//       {showPasswordModal ? (
//         <PasswordModal
//           pasteId={id}
//           onSuccess={(content) => {
//             setPaste(content);
//             setShowPasswordModal(false);
//           }}
//         />
//       ) : (
//         <pre className="bg-white/90 shadow-lg backdrop-blur p-6 rounded-xl w-full max-w-2xl whitespace-pre-wrap text-gray-900 dark:text-gray-100 font-mono text-base">
//           {paste}
//         </pre>
//       )}
//     </>
//   );
// }
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import ExpiredMessage from "@/components/paste/ExpiredMessage";
import PasswordForm from "@/components/paste/PasswordForm";
import PasteContent from "@/components/paste/PasteContent";
import LoadingDotsLinear from "@/components/ui/LoadingDotsLinear";
import { withMinimumDelay } from "@/lib/utils";
import { ErrorResponse } from "@/types/api";

interface Paste {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
  viewLimit: number;
}

interface PasteMetadata {
  isExpired: boolean;
  isPasswordProtected: boolean;
}

export default function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: pasteId } = React.use(params);

  const [loadingPasteMetadata, setLoadingPasteMetadata] =
    useState<boolean>(false);
  const [loadingPasteData, setLoadingPasteData] = useState<boolean>(false);

  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isPasswordProtected, setIsPasswordProtected] =
    useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [paste, setPaste] = useState<Paste | null>(null);

  // Memoize API URL for efficiency
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch paste content
  const fetchPasteContent = useCallback(
    async (passwordHeader: string) => {
      setLoadingPasteData(true);
      setError("");
      setPaste(null);
      // await new Promise((res) => setTimeout(res, 10000));
      try {
        const headers: Record<string, string> = {};
        if (passwordHeader) headers["X-Paste-Password"] = passwordHeader;
        const res = await withMinimumDelay(
          fetch(`${apiUrl}/paste/${pasteId}`, {
            headers,
          }),
          1000,
        );
        if (!res.ok) {
          const reponse: ErrorResponse = await res.json();
          throw new Error(reponse.message);
        }
        const data: Paste = await res.json();
        setPaste(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching paste");
        }
      } finally {
        setLoadingPasteData(false);
      }
    },
    [pasteId, apiUrl],
  );

  const fetchMetadata = useCallback(async () => {
    if (!pasteId) return;

    setLoadingPasteMetadata(true);
    setError("");
    setIsExpired(false);
    setIsPasswordProtected(false);
    setPaste(null);
    setPassword("");
    // await new Promise((res) => setTimeout(res, 10000));
    try {
      const res = await withMinimumDelay(
        fetch(`${apiUrl}/paste/${pasteId}/metadata`),
        1000,
      );
      if (!res.ok) {
        const reponse: ErrorResponse = await res.json();
        throw new Error(reponse.message);
      }

      const metadata: PasteMetadata = await res.json();

      setIsExpired(metadata.isExpired);
      setIsPasswordProtected(metadata.isPasswordProtected);

      if (!metadata.isExpired && !metadata.isPasswordProtected) {
        fetchPasteContent("");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching paste metadata");
      }
    } finally {
      setLoadingPasteMetadata(false);
    }
  }, [pasteId, apiUrl, fetchPasteContent]);

  // Handle password submit
  const handleSubmitPassword = useCallback(async () => {
    await fetchPasteContent(password);
  }, [fetchPasteContent, password]);

  // Handle reset
  const handleReset = useCallback(() => {
    setPaste(null);
    setError("");
    setPassword("");
    setIsExpired(false);
    setIsPasswordProtected(false);
    router.push("/paste");
  }, [router]);

  // Fetch metadata on mount or pasteId change
  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  if (loadingPasteMetadata) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">
        LoadingPasteMetadata
        <LoadingDotsLinear />
      </p>
    );
  }

  const isRenderingPassworForm = isPasswordProtected && !paste;

  if (loadingPasteData && !isRenderingPassworForm) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center">
        LoadingPaste
        <LoadingDotsLinear />
      </p>
    );
  }

  if (error && !isRenderingPassworForm) {
    return <p className="error-text text-center">{error}</p>;
  }

  if (isExpired) {
    return <ExpiredMessage onReset={handleReset} />;
  }

  if (isRenderingPassworForm) {
    return (
      <PasswordForm
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmitPassword}
        loadingPasteData={loadingPasteData}
        error={error}
      />
    );
  }

  if (paste) {
    return <PasteContent paste={paste} onReset={handleReset} />;
  }

  return null;
}
