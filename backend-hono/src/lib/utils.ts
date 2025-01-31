/**
 * Hashes a given string using SHA-256.
 * @param {string} data - The string to hash.
 * @returns {Promise<string>} A promise that resolves to the hexadecimal representation of the SHA-256 hash.
 */
export async function hash(data: string) {
  const text = new TextEncoder().encode(data);

  const hash_buffer = await crypto.subtle.digest("SHA-256", text);

  const hash_array = Array.from(new Uint8Array(hash_buffer));

  return hash_array.map((b) => b.toString(16).padStart(2, "0")).join("");
}
