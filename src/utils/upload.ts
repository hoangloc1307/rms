export const generateFileKey = (filename: string) => {
  const timestamp = Date.now();
  return `uploads/${timestamp}-${filename}`;
};
