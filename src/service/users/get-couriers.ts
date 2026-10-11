import $api from "../../api";
import { ENDPOINTS } from "../../config";
import type { User } from "../auth/auth.types";

const getCouriers = async () => {
  const response = await $api.get<User[]>(ENDPOINTS.USERS, {
    params: { role: "courier" },
  });
  return response.data;
};

export default getCouriers;
