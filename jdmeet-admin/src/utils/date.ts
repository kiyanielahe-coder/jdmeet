import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)));
}

export function toPersianDigits(value: string | number) {
  return String(value).replace(/[0-9]/g, (digit) => persianDigits[Number(digit)]);
}

function isDateObjectLike(value: unknown): value is DateObject {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as DateObject).convert === "function" &&
      typeof (value as DateObject).format === "function"
  );
}

export function parseStoredDate(value?: string | null) {
  const normalized = toEnglishDigits(value || "").trim().replace(/-/g, "/");

  const parts = normalized.split("/");
  const hasValidShape =
    parts.length === 3 &&
    parts[0].length === 4 &&
    parts.every((part) => /^[0-9]+$/.test(part));

  if (!hasValidShape) return null;
  const year = Number(normalized.split("/")[0]);
  if (!year) return null;

  try {
    const date = new DateObject({
      date: normalized,
      format: "YYYY/MM/DD",
      calendar: year < 1700 ? persian : gregorian,
      locale: year < 1700 ? persian_fa : gregorian_en,
    });

    return date.isValid ? date : null;
  } catch {
    return null;
  }
}

export function toBackendDate(
  value: DateObject | string | null | undefined
) {
  try {
    const date = isDateObjectLike(value)
      ? new DateObject(value)
      : parseStoredDate(value);

    if (!date?.isValid) return "";

    return date
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD");
  } catch {
    return "";
  }
}

export function toPersianDateObject(value?: string | null) {
  try {
    const date = parseStoredDate(value);
    return date?.isValid ? date.convert(persian, persian_fa) : null;
  } catch {
    return null;
  }
}

export function formatPersianDate(
  value?: string | null,
  fallback = "-"
) {
  const date = toPersianDateObject(value);
  return date ? date.format("YYYY/MM/DD") : fallback;
}

export function formatPersianTime(
  value?: string | null,
  fallback = "-"
) {
  if (!value) return fallback;
  return toPersianDigits(toEnglishDigits(value));
}

export function formatPersianDateTime(
  value?: string | null,
  fallback = "-"
) {
  if (!value) return fallback;

  const [datePart, timePart] = value.split(/[T ]/, 2);
  const formattedDate = formatPersianDate(datePart, "");
  if (!formattedDate) return toPersianDigits(value);

  return timePart
    ? `${formattedDate} - ${formatPersianTime(timePart.slice(0, 5), "")}`
    : formattedDate;
}

export function isDateWithinRange(
  value: string,
  fromDate?: string,
  toDate?: string
) {
  const dateKey = toBackendDate(value);
  const fromKey = toBackendDate(fromDate);
  const toKey = toBackendDate(toDate);

  if ((fromKey || toKey) && !dateKey) return false;
  if (fromKey && dateKey < fromKey) return false;
  if (toKey && dateKey > toKey) return false;
  return true;
}