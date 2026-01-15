export const generateHash = (length = 6) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

export const generateSecurityCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};