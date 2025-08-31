export const fmt = (n: number, locale = "es-BO", max = 2) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: max }).format(n);

export const onlyDecimal = (s: string) => s.replace(/[^0-9.]/g, "");
