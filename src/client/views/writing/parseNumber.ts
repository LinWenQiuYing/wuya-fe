export default function parseNumber(id: string | null | undefined) {
  return id && /^\d+$/.test(id) ? Number.parseInt(id) : null;
}
