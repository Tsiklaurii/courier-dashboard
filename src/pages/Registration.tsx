import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextFieldElement from "../shared/TextFieldElement";
import WorkingDaysFields from "../components/WorkingDaysFields";
import { ROUTES } from "../config";
import register from "../service/auth/register";
import getWorkingDays from "../utils/get-working-days";
import type { RegistrationForm, WorkingDays, WorkingSlot } from "../service/auth/auth.types";

type RegistrationFormValues = Omit<RegistrationForm, "role" | "workingDays"> & {
  role: RegistrationForm["role"] | "";
  workingSlots: WorkingSlot[];
};

const Registration = () => {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState("");
  const methods = useForm<RegistrationFormValues>({
    shouldUnregister: true,
    defaultValues: {
      firstName: "",
      lastName: "",
      pid: "",
      phoneNumber: "",
      email: "",
      password: "",
      profileImage: "",
      role: "",
      address: "",
      vehicle: "",
      workingSlots: [{ day: "", time: "" }],
    },
  });
  const { handleSubmit, watch, setError, formState: { isSubmitting } } = methods;
  const role = watch("role");

  const submit = handleSubmit(async (data) => {
    if (!data.role) return;
    setRegistrationError("");
    const { workingSlots, ...form } = data;
    let workingDays: WorkingDays | undefined;
    if (data.role === "courier") {
      const result = getWorkingDays(workingSlots);
      if (result.error) {
        if (result.slotIndex !== undefined) {
          setError(`workingSlots.${result.slotIndex}.time`, { message: result.error });
        } else {
          setRegistrationError(result.error);
        }
        return;
      }
      workingDays = result.workingDays;
    }
    try {
      await register({ ...form, role: data.role, ...(data.role === "courier" ? { workingDays } : {}) });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch {
      setRegistrationError("Something is not right. Please try again.");
    }
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography align="center" variant="h4" sx={{ marginBottom: 2 }}>Create your account</Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={submit}
            sx={{ width: 400, backgroundColor: "white", margin: "auto", padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextFieldElement name="firstName" label="First name" placeholder="First Name" required />
            <TextFieldElement name="lastName" label="Last name" placeholder="Last Name" />
            <TextFieldElement name="pid" label="Personal ID" placeholder="Personal ID" required
              pattern={{ value: /^[0-9]{11}$/, message: "Personal ID must be exactly 11 digits" }} />
            <TextFieldElement name="phoneNumber" label="Phone number" placeholder="Phone Number" required />
            <TextFieldElement name="email" label="Email" type="email" placeholder="Email" required />
            <TextFieldElement name="password" label="Password" type="password" placeholder="Password" required minLength={4} />
            <TextFieldElement name="profileImage" label="Profile image" placeholder="Profile Image URL" />
            <TextFieldElement name="role" label="Role" placeholder="Choose role" required
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "courier", label: "Courier" },
              ]} />
            {role === "user" && (
              <TextFieldElement name="address" label="Address" placeholder="Address" required />
            )}
            {role === "courier" && (
              <>
                <TextFieldElement name="vehicle" label="Vehicle" placeholder="Vehicle" required />
                <WorkingDaysFields />
              </>
            )}
            {registrationError && (
              <Typography color="error" variant="body2" role="alert">{registrationError}</Typography>
            )}
            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>Registration</Button>
            <Button type="button" variant="outlined" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>Login</Button>
          </Box>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default Registration;
