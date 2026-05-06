import dayjs, { Dayjs } from "dayjs";

export function toIsoDate(date: Dayjs | string | null | undefined, endOfDay = false) {
  if (!date) {
    return undefined;
  }

  const parsed = typeof date === "string" ? dayjs(date) : date;
  return (endOfDay ? parsed.endOf("day") : parsed.startOf("day")).toISOString();
}

export function formatDate(date: string) {
  return dayjs(date).format("DD/MM/YYYY");
}
