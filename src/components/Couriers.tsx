import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../service/auth/auth.types";
import getCouriers from "../service/users/get-couriers";
import CourierSchedule from "./CourierSchedule";

export default function Couriers() {
  const [couriers, setCouriers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          />
        </Box>
      ))}
    </Container>
  );
}
