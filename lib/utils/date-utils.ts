export const formatDateTime = (dateString: string | Date) => {
  if (!dateString) return "---";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "INVALID_DATE";

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

export const calculateAge = (birthDate: string | Date): string => {
  if (!birthDate) return '';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} ${age === 1 ? 'ano' : 'anos'}`;
};