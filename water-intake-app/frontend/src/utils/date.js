const pad = (n) => String(n).padStart(2, '0');

export const localDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const localTime = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const formatDate = (str) => {
  if (!str) return '';
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const weekdayShort = (str) => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short' });
};

export const formatTime = (str) => {
  if (!str) return '';
  const [h, m] = str.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

export const formatMl = (ml) => (ml >= 1000 ? `${(ml / 1000).toFixed(ml % 1000 === 0 ? 0 : 2).replace(/\.?0+$/, '')} L` : `${ml} ml`);
