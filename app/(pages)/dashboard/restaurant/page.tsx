import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "RESTAURANT_ADMIN") redirect("/dashboard");

  return <div>Restaurant dashboard</div>;
};

export default page;
