export async function createPaste(content: string, password?: string) {
  const res = await fetch("/api/paste", {
    method: "POST",
    body: JSON.stringify({ content, password }),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function getPaste(id: string | string[]) {
  const res = await fetch(`/api/paste/${id}`);
  return res.json();
}

export async function validatePastePassword(
  id: string | string[],
  password: string,
) {
  const res = await fetch(`/api/paste/${id}`, {
    method: "POST",
    body: JSON.stringify({ password }),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}
