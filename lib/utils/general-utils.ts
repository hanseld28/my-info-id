export const normalizePhoneNumber = (value: string) => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

export const maskPhone = (value: string) => {
  if (!value) return "";
  
  const rawValue = normalizePhoneNumber(value);
  
  if (rawValue.length <= 10) {
    return rawValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  } else {
    return rawValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  }
};