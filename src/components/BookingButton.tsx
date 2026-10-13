import { Button } from "@mui/material";
import type { User } from "../service/auth/auth.types";
import { matchesBookingSlot, type Booking } from "../service/bookings";

interface BookingButtonProps {
  courierId: number;
  currentUser: User;
  date: string;
  time: string;
  enable: boolean;
  bookings: Booking[];
  disabled?: boolean;
  onToggle: (courierId: number, date: string, time: string) => Promise<void>;
}

export default function BookingButton({ courierId, currentUser, date, time, enable, bookings, disabled, onToggle }: BookingButtonProps) {
  const matching = bookings.filter((booking) => matchesBookingSlot(booking, { courierId, date, time }));
  const reservedByOther = matching.some((booking) => booking.data.userId !== currentUser.id);
  const reservedByYou = matching.length > 0 && !reservedByOther;
  const canBook = currentUser.role === "user";
  const status = reservedByOther ? "Reserved" : reservedByYou ? "Cancel" : enable ? "Available" : "Unavailable";

  return (
      <Button
        type="button"
        size="small"
        variant="outlined"
        color={reservedByYou ? "warning" : "success"}
        disabled={disabled || !canBook || reservedByOther || (!reservedByYou && !enable)}
        onClick={() => onToggle(courierId, date, time)}
        sx={{
          textTransform: "none",
          whiteSpace: "nowrap",
          ...(!canBook && {
            "&.Mui-disabled": {
              color: "text.secondary",
              borderColor: "grey.400",
            },
          }),
        }}
      >
        {status}
      </Button>
  );
}
