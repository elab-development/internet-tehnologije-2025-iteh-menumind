import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/auth/login");

  if (session.user.role === "SYSTEM_ADMIN") redirect("/dashboard/platform");
  if (session.user.role === "RESTAURANT_ADMIN")
    redirect("/dashboard/restaurant");

  return <div>Access denied.</div>;
};

export default Dashboard;
