import type { WorkingDays, WorkingSlot } from "../service/auth/auth.types";

interface WorkingDaysResult {
  workingDays?: WorkingDays;
  error?: string;
  slotIndex?: number;
}

export default function getWorkingDays(workingSlots: WorkingSlot[]): WorkingDaysResult {
  const workingDays: WorkingDays = {};

  for (const [index, slot] of workingSlots.entries()) {
    if (!slot.day || !slot.time) {
      return { error: "Choose a day and time for every slot." };
    }
    const slots = workingDays[slot.day] ?? [];
    if (slots.some((existing) => existing.time === slot.time)) {
      return { error: "This time is already selected for this day", slotIndex: index };
    }
    slots.push({ enable: true, time: slot.time });
    workingDays[slot.day] = slots;
  }

  if (Object.keys(workingDays).length < 5) {
    return { error: "Choose at least 5 different working days." };
  }

  return { workingDays };
}
