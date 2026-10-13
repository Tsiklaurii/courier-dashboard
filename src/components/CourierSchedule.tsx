import { Avatar, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { User, WorkingDay, WorkingDays } from "../service/auth/auth.types";
import { matchesBookingSlot, type Booking } from "../service/bookings";
import getNextSlotDate from "../utils/get-next-slot-date";
import BookingButton from "./BookingButton";

interface CourierScheduleProps {
  workingDays?: WorkingDays;
  name?: string;
  profileImage?: string;
  courierId?: User["id"];
  currentUser?: User;
  bookings?: Booking[];
  bookingUsers?: User[];
  bookingDisabled?: boolean;
  onToggleBooking?: (courierId: User["id"], date: string, time: string) => Promise<void>;
}

const days: WorkingDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function CourierSchedule({ workingDays, name, profileImage, courierId, currentUser, bookings = [], bookingUsers = [], bookingDisabled, onToggleBooking }: CourierScheduleProps) {
  const rows = days.flatMap((day) =>
    (workingDays?.[day] ?? []).map((slot) => ({ day, ...slot })),
  );

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      {name && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Avatar src={profileImage} alt={name} sx={{ bgcolor: "primary.main" }} />
          <Typography variant="h6">{name}</Typography>
        </Box>
      )}
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No working schedule</Typography>
      ) : (
        <TableContainer>
          <Table size="small" aria-label="Registered working schedule">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.secondary" }}>Day</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>Time</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>Status</TableCell>
                {currentUser?.role === "admin" && <TableCell sx={{ color: "text.secondary" }}>Users</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ day, time, enable }, index) => {
                const date = getNextSlotDate(day, time);
                const bookedUsers = currentUser?.role === "admin"
                  ? bookingUsers.filter((user) => bookings.some((booking) =>
                    courierId !== undefined && matchesBookingSlot(booking, { courierId, date, time }) && booking.data.userId === user.id,
                  ))
                  : [];

                return (
                  <TableRow key={`${day}-${time}-${index}`}>
                    <TableCell component="th" scope="row" sx={{ py: 1, textTransform: "capitalize" }}>
                      {day}
                      {onToggleBooking && <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{date}</Typography>}
                    </TableCell>
                    <TableCell sx={{ py: 1, whiteSpace: "nowrap" }}>{time}</TableCell>
                    <TableCell sx={{ py: 1 }}>
                      {onToggleBooking && currentUser && courierId !== undefined && date ? (
                        <BookingButton
                          courierId={courierId}
                          currentUser={currentUser}
                          date={date}
                          time={time}
                          enable={enable}
                          bookings={bookings}
                          disabled={bookingDisabled}
                          onToggle={onToggleBooking}
                        />
                      ) : (
                        <Typography variant="body2" color={enable ? "success.main" : "text.secondary"}>
                          {enable ? "Available" : "Unavailable"}
                        </Typography>
                      )}
                    </TableCell>
                    {currentUser?.role === "admin" && (
                      <TableCell sx={{ py: 1 }}>
                        {bookedUsers.map((user) => `${user.firstName} ${user.lastName || ""}`.trim()).join(", ") || "—"}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
