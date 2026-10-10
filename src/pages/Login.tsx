import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextFieldElement from "../shared/TextFieldElementProps";
import login from "../service/auth/login";
import { ROUTES } from "../config";
import type { LoginForm } from "../service/auth/auth.types";

type LoginFormValues = Omit<LoginForm, "role"> & {
  role: LoginForm["role"] | "";
};

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const methods = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  const { handleSubmit } = methods;

  const submit = handleSubmit(async (data) => {
    if (!data.role) return;
    setLoginError("");
    try {
      await login({ ...data, role: data.role });
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      setLoginError("Something is not right. Please try again.");
    }
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography align="center" variant="h4" sx={{ marginBottom: 2 }}>Login to your account 🚀</Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              width: 400,
              backgroundColor: "white",
              margin: "auto",
              padding: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            onSubmit={submit}
          >
            <TextFieldElement
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />
            <TextFieldElement
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
            />
            <TextFieldElement
              name="role"
              label="Role"
              placeholder="Choose role"
              required
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "courier", label: "Courier" },
              ]}
            />
            {loginError && (
              <Typography color="error" variant="body2" role="alert">{loginError}</Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
            <Button type="button" variant="outlined" fullWidth>Registration</Button>
          </Box>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default Login;
