import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { ROUTES } from "./config";
import GuardPath from "./layouts/GuardPath";
import MainLayout from "./layouts/MainLayout";

const Router = () => {
  return (
    <Routes>
      <Route path={ROUTES.REGISTER} element={
        <GuardPath pathName="login">
          <Registration />
        </GuardPath>
      } />
      <Route path="/" element={
        <GuardPath pathName="home">
          <MainLayout />
        </GuardPath>
      }
      >
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={
        <GuardPath pathName="login">
          <Login />
        </GuardPath>
      }
      />
    </Routes>
  );
};

export default Router;
