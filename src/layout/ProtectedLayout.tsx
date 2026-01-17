import { Navigate, Outlet } from "react-router-dom";

type Props = {
  user: any;
};

export default function ProtectedLayout({ user }: Props) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
