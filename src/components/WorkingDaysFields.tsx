import { Box, Button, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import TextFieldElement from "../shared/TextFieldElement";
import type { WorkingSlot } from "../service/auth/auth.types";

const emptySlot: WorkingSlot = { day: "", time: "" };

const dayOptions = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  .map((day) => ({ value: day, label: day.charAt(0).toUpperCase() + day.slice(1) }));

const timeOptions = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
  "22:00 - 23:00",
  "23:00 - 00:00",
].map((time) => ({ value: time, label: time }));

export default function WorkingDaysFields() {
  const { control } = useFormContext<{ workingSlots: WorkingSlot[] }>();
  const { fields, append, remove } = useFieldArray({ control, name: "workingSlots", shouldUnregister: true });
  const slots = useWatch({ control, name: "workingSlots" }) ?? [];
  const allSlotsComplete = fields.every((_, index) => {
    const slot = slots[index];
    return Boolean(slot?.day && slot?.time);
  });
  const canAddSlot = fields.length > 0 && allSlotsComplete;

  useEffect(() => {
    if (fields.length === 0) append({ ...emptySlot });
  }, [fields.length, append]);

  const handleAddSlot = () => {
    if (canAddSlot) append({ ...emptySlot }, { shouldFocus: false });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1">Working days</Typography>
  
      {fields.map((field, index) => {
        const currentDay = slots[index]?.day;
        const usedTimes = slots
          .filter((slot, otherIndex) => otherIndex !== index && slot.day === currentDay)
          .map((slot) => slot.time);
        const rowTimeOptions = timeOptions.map((option) => ({
          ...option,
          disabled: Boolean(currentDay) && usedTimes.includes(option.value),
        }));

        return (
          <Box key={field.id} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <TextFieldElement
              name={`workingSlots.${index}.day`}
              label="Day"
              placeholder="Choose day"
              options={dayOptions}
              required
            />
            <TextFieldElement
              name={`workingSlots.${index}.time`}
              label="Time"
              placeholder="Choose time"
              options={rowTimeOptions}
              required
            />
            <IconButton
              aria-label={`Remove working slot ${index + 1}`}
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              sx={{ mt: 1 }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        );
      })}
      <Button
        type="button"
        variant="outlined"
        startIcon={<AddIcon />}
        disabled={!canAddSlot}
        onClick={handleAddSlot}
      >
        Add time slot
      </Button>
    </Box>
  );
}
