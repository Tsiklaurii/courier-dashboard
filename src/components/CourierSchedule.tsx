import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { WorkingDay, WorkingDays } from "../service/auth/auth.types";

interface CourierScheduleProps {
  workingDays?: WorkingDays;
}

const days: WorkingDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function CourierSchedule({ workingDays }: CourierScheduleProps) {
  const rows = days.flatMap((day) =>
    (workingDays?.[day] ?? []).map((slot) => ({ day, ...slot })),
  );

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Working schedule</Typography>
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No working schedule registered.</Typography>
      ) : (
        <TableContainer>
          <Table size="small" aria-label="Registered working schedule">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "text.secondary" }}>Day</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>Time</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ day, time, enable }, index) => (
                <TableRow key={`${day}-${time}-${index}`}>
                  <TableCell component="th" scope="row" sx={{ py: 1, textTransform: "capitalize" }}>{day}</TableCell>
                  <TableCell sx={{ py: 1, whiteSpace: "nowrap" }}>{time}</TableCell>
                  <TableCell sx={{ py: 1 }}>{enable ? "Available" : "Unavailable"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
