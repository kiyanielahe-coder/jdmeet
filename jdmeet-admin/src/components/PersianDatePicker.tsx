import DatePickerExport from "react-multi-date-picker";
import type DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toBackendDate, toPersianDateObject } from "../utils/date";

const datePickerModule = DatePickerExport as unknown as {
  default?: typeof DatePickerExport;
  $$typeof?: symbol;
};
const DatePicker =
  datePickerModule.$$typeof || !datePickerModule.default
    ? DatePickerExport
    : datePickerModule.default;

type PersianDatePickerProps = {
  value?: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

function PersianDatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "انتخاب تاریخ شمسی",
}: PersianDatePickerProps) {
  return (
    <DatePicker
      value={toPersianDateObject(value)}
      onChange={(date) =>
        onChange(toBackendDate(date as DateObject | null))
      }
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD"
      calendarPosition="bottom-right"
      placeholder={placeholder}
      disabled={disabled}
      editable={false}
      containerStyle={{ width: "100%" }}
      style={{
        width: "100%",
        minHeight: 42,
        padding: "10px 12px",
        border: "1px solid #dbe3ec",
        borderRadius: 9,
        boxSizing: "border-box",
        fontFamily: "inherit",
        direction: "rtl",
        background: disabled ? "#f8fafc" : "#fff",
      }}
    />
  );
}

export default PersianDatePicker;