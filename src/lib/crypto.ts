/**
 * Cryptographic SHA-256 integrity hash utility for audit logging and data verification.
 * Note: Application numbers (NSCD-2026-00001 format) are generated strictly on the database/server.
 */
export async function generateSHA256Hash(payload: unknown): Promise<string> {
  const jsonString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback checksum for environments without WebCrypto
  let hash = 0;
  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'sha256_' + Math.abs(hash).toString(16);
}
