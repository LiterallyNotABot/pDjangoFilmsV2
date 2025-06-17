import dayjs from "dayjs";

export function groupLogsByMonthAndDay(logs) {
  const map = new Map();

  logs.forEach((log) => {
    const date = dayjs(log.date);
    const monthLabel = date.format("MMMM YYYY");
    const dayLabel = date.format("DD");

    if (!map.has(monthLabel)) map.set(monthLabel, new Map());
    const dayMap = map.get(monthLabel);
    if (!dayMap.has(dayLabel)) dayMap.set(dayLabel, []);
    dayMap.get(dayLabel).push(log);
  });

  const result = [];
  map.forEach((days, month) => {
    const dayList = [];
    days.forEach((logs, day) => {
      dayList.push({ day, logs });
    });
    result.push({ month, days: dayList });
  });

  return result;
}
