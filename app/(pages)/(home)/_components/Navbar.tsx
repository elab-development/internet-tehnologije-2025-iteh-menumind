import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav>
      <div className="flex justify-between px-4 items-center max-w-7xl mx-auto">
        <Logo />
        <Button size="lg" asChild>
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
