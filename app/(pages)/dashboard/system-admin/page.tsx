import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "SYSTEM_ADMIN") return <div>Access denied.</div>;

  return <div>System Admin dashboard</div>;
};

export default page;
