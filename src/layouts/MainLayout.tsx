import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import Couriers from "../components/Couriers";
import Users from "../components/Users";
import { CustomTabPanel } from "../components/BasicTabs";
import { ROUTES } from "../config";
import type { User } from "../service/auth/auth.types";
import getUser from "../service/auth/get-user";
import logout from "../service/auth/logout";

export default function MainLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<number | false>(false);
  const tabs = user?.role === "admin" ? ["Users", "Couriers"] : ["Couriers"];

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser();
      setUser(response ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      <Header
        user={user}
        tabs={tabs}
        tab={tab}
        onTabChange={setTab}
        onShowProfile={() => setTab(false)}
        onLogout={handleLogout}
      />
      <Outlet />
      {user && tab === false && <UserProfile user={user} />}
      {user && tabs.map((label, index) => (
        <CustomTabPanel key={label} value={tab} index={index}>
          {label === "Couriers" && <Couriers />}
          {label === "Users" && user.role === "admin" && <Users />}
        </CustomTabPanel>
      ))}
    </>
  );
}
