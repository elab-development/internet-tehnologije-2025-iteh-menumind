import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignUp from "./_components/SignUp";

const page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "SYSTEM_ADMIN") return <div>Access denied.</div>;

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-6">
      <h1 className="text-2xl">System Admin dashboard</h1>
      <SignUp />
    </div>
  );
};

export default page;
