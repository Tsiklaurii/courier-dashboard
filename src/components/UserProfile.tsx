import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import type { User } from "../service/auth/auth.types";
import CourierProfileSchedule from "./CourierProfileSchedule";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            src={user.data?.profileImage || user.data?.image}
            alt={`${user.firstName} ${user.lastName || ""}`.trim()}
            sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
          />
          <Box>
            <Typography variant="h6">
              {user.firstName} {user.lastName}
              <Typography variant="body2" color="text.secondary">
                {user.role}
              </Typography>
            </Typography>
          </Box>
        </Box>
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
          { label: "Vehicle", value: user.data?.vehicle },
        ].map(({ label, value }) => value && (
          <Box key={label} sx={{ py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography sx={{ overflowWrap: "anywhere" }}>{value}</Typography>
          </Box>
        ))}
      </Paper>
      {user.role === "courier" && <CourierProfileSchedule user={user} />}
    </Container>
  );
}
