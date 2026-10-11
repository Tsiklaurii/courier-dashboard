import { Avatar, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../service/auth/auth.types";
import getUsers from "../service/users/get-users";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        if (active) setUsers(response);
      } catch {
        if (active) setError("Could not load users");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadUsers();
    return () => { active = false; };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Users</Typography>
      {loading && <Typography color="text.secondary">Loading users...</Typography>}
      {error && <Typography color="error" role="alert">{error}</Typography>}
      {!loading && !error && users.length === 0 && (
        <Typography color="text.secondary">No users registered</Typography>
      )}
      {users.map((user) => (
        <Paper key={user.id} variant="outlined" sx={{ mb: 4, p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar src={user.data?.profileImage || user.data?.image} alt={user.firstName} sx={{ bgcolor: "primary.main" }} />
            <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
          </Box>
          <TableContainer>
            <Table size="small" aria-label={`${user.firstName} user information`}>
              <TableBody>
                {[
                  { label: "First name", value: user.firstName },
                  { label: "Last name", value: user.lastName },
                  { label: "Email", value: user.email },
                  { label: "Personal ID", value: user.data?.pid },
                  { label: "Phone number", value: user.data?.phoneNumber },
                  {
                    label: "Address",
                    value: user.data?.street || (
                      typeof user.data?.address === "string"
                        ? user.data.address
                        : user.data?.address?.street
                    ),
                  },
                ].map(({ label, value }) => value && (
                  <TableRow key={label}>
                    <TableCell component="th" scope="row" sx={{ py: 1, color: "text.secondary" }}>{label}</TableCell>
                    <TableCell sx={{ py: 1, overflowWrap: "anywhere" }}>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Container>
  );
}
