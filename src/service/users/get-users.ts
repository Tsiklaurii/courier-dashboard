import $api from "../../api";
import { ENDPOINTS } from "../../config";
import type { User } from "../auth/auth.types";

const getUsers = async () => {
  const response = await $api.get<User[]>(ENDPOINTS.USERS, {
    params: { role: "user" },
  });
  return response.data;
};

export default getUsers;
