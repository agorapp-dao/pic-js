export function optionalBigInt(
  value: bigint | undefined | null,
): [] | [bigint] {
  return value === undefined || value === null ? [] : [value];
}
