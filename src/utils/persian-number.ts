const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

export const toPersianNumber = (input: number | string): string => {
  return input?.toString()
    .replace(/[0-9]/g, (d) => persianDigits[parseInt(d)])
    .replace(/,/g, '،'); // Optional: Convert English comma to Persian comma
};
