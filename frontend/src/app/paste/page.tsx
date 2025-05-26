"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import EnterPasteIdForm from "../../components/paste/EnterPasteIdForm";

export default function PasteIndexPage() {
  const [pasteId, setPasteId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit() {
    if (!pasteId.trim()) {
      setError("Please enter a valid paste ID");
      return;
    }
    setError("");
    router.push(`/paste/${pasteId.trim()}`);
  }

  return (
    <EnterPasteIdForm
      pasteId={pasteId}
      setPasteId={setPasteId}
      onSubmit={handleSubmit}
      error={error}
    />
  );
}
