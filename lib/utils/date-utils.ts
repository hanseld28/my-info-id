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
    hour12: false // Formato 24h
  }).format(date);
};