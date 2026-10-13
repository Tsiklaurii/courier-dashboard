import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../service/auth/auth.types";
import getCouriers from "../service/users/get-couriers";
import getUsers from "../service/users/get-users";
import CourierSchedule from "./CourierSchedule";
import useBookings from "../hooks/useBookings";

export default function Couriers({ currentUser }: { currentUser: User }) {
  const [couriers, setCouriers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingUsers, setBookingUsers] = useState<User[]>([]);
  const [usersError, setUsersError] = useState("");
  const { bookings, bookingsReady, bookingError, pending, handleBooking } = useBookings(currentUser);

  useEffect(() => {
    if (currentUser.role !== "admin") return;
    let active = true;
    const loadBookingUsers = async () => {
      try {
        const response = await getUsers();
        if (active) setBookingUsers(response);
      } catch {
        if (active) setUsersError("Could not load reservation names.");
      }
    };
    loadBookingUsers();
    return () => { active = false; };
  }, [currentUser.role]);

  useEffect(() => {
    let active = true;
    const loadCouriers = async () => {
      try {
        const response = await getCouriers();
        if (active) setCouriers(response);
      } catch {
        if (active) setError("Could not load couriers");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCouriers();
    return () => { active = false; };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Couriers</Typography>
      {!bookingsReady && !bookingError && <Typography color="text.secondary">Loading reservations...</Typography>}
      {bookingError && <Typography color="error" role="alert">{bookingError}</Typography>}
      {usersError && <Typography color="error" role="alert">{usersError}</Typography>}
      {loading && <Typography color="text.secondary">Loading couriers...</Typography>}
      {error && <Typography color="error" role="alert">{error}</Typography>}
      {!loading && !error && couriers.length === 0 && (
        <Typography color="text.secondary">No couriers registered</Typography>
      )}
      {couriers.map((courier) => (
        <Box key={courier.id} sx={{ mb: 4 }}>
          <CourierSchedule
            name={`${courier.firstName} ${courier.lastName || ""}`.trim()}
            profileImage={courier.data?.profileImage || courier.data?.image}
            workingDays={courier.data?.workingDays}
            courierId={courier.id}
            currentUser={currentUser}
            bookings={bookings}
            bookingUsers={bookingUsers}
            bookingDisabled={!bookingsReady || pending}
            onToggleBooking={handleBooking}
          />
        </Box>
      ))}
    </Container>
  );
}
