const toDateOnly = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const todayDateOnly = () => toDateOnly(new Date());

export const isTodayOrFuture = (value) => {
  if (!value) return true;
  return toDateOnly(value) >= todayDateOnly();
};

export const isSameOrAfterField = (field) => (value, { req }) => {
  if (!value || !req.body[field]) return true;
  return toDateOnly(value) >= toDateOnly(req.body[field]);
};
