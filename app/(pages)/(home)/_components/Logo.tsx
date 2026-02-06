import { ForkKnifeCrossed } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex h-20 items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
        <ForkKnifeCrossed className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-lg font-semibold">MenuMind</span>
    </div>
  );
};

export default Logo;
