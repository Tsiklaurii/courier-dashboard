import { Typography } from "@mui/material";
import type { User } from "../service/auth/auth.types";
import useBookings from "../hooks/useBookings";
import CourierSchedule from "./CourierSchedule";

export default function CourierProfileSchedule({ user }: { user: User }) {
  const { bookings, bookingsReady, bookingError, pending, handleBooking } = useBookings(user);

  return (
    <>
      {!bookingsReady && !bookingError && (
        <Typography color="text.secondary" sx={{ mt: 3 }}>Loading reservations...</Typography>
      )}
      {bookingError && (
        <Typography color="error" role="alert" sx={{ mt: 3 }}>{bookingError}</Typography>
      )}
      <CourierSchedule
        workingDays={user.data?.workingDays}
        courierId={user.id}
        currentUser={user}
        bookings={bookings}
        bookingDisabled={!bookingsReady || pending}
        onToggleBooking={handleBooking}
      />
    </>
  );
}
