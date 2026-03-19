export const getDiffData = (one: Record<string, unknown>, two: Record<string, unknown>, keys: string[]) => {
  const diffData = {} as Record<keyof typeof keys, { from: unknown; to: unknown }>;

  keys.forEach((key) => {
    if (one[key] !== two[key]) {
      diffData[key as keyof typeof keys] = { from: one[key], to: two[key] };
    }
  });

  return Object.keys(diffData).length ? diffData : null;
};
