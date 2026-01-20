const SECURE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const generateSecureString = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += SECURE_CHARS.charAt(array[i] % SECURE_CHARS.length);
  }
  return result;
};

export const generateHashURL = () => generateSecureString(8).toLowerCase();

export const generateSecurityCode = () => generateSecureString(8);