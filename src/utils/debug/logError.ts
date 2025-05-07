/** @format */

export const logError = (location: string, error: unknown) => {
  console.error(`🔴 ERROR | 📁 ${location}:`, error);
};
