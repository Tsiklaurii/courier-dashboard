import type { WorkingDay } from "../service/auth/auth.types";

const days: WorkingDay[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];

export default function getNextSlotDate(
    day: WorkingDay,
    time: string,
    now = new Date()
): string {
    const date = new Date(now);
    const daysAhead = (days.indexOf(day) - now.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysAhead);
    const [hour, minute] = time.split(" - ")[0].split(":").map(Number);
    date.setHours(hour, minute, 0, 0);
    if (date <= now) date.setDate(date.getDate() + 7);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateOfMonth = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${dateOfMonth}`;
}
