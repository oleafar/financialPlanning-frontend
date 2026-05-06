export function toQueryKeyPart(params: Record<string, unknown>) {
  const normalizedEntries = Object.entries(params).filter(([, value]) => {
    return value !== undefined && value !== null && value !== "";
  });

  return JSON.stringify(Object.fromEntries(normalizedEntries));
}
