// Remove tudo que não é número
export const normalizePhoneNumber = (value: string) => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};

// Aplica a máscara (99) 99999-9999
export const maskPhone = (value: string) => {
  if (!value) return "";
  
  const rawValue = normalizePhoneNumber(value);
  
  if (rawValue.length <= 10) {
    // Formato (99) 9999-9999 (fixo)
    return rawValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 14);
  } else {
    // Formato (99) 99999-9999 (celular)
    return rawValue
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  }
};