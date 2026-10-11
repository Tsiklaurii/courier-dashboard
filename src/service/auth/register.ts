import $api from "../../api";
import { ENDPOINTS } from "../../config";
import type { RegistrationForm } from "./auth.types";

const register = async (form: RegistrationForm) => {
  const { firstName, lastName, email, password, role, pid, phoneNumber, profileImage, address, vehicle, workingDays } = form;
  const response = await $api.post(ENDPOINTS.REGISTER, {
    firstName,
    lastName,
    email,
    password,
    role,
    data: {
      pid,
      phoneNumber,
      profileImage,
      ...(role === "user" ? { address } : {}),
      ...(role === "courier" ? { vehicle, workingDays } : {}),
    },
  });
  return response.data;
};

export default register;
