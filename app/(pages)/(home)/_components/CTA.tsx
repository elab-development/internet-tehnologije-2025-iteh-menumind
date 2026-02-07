import { Button } from "@/components/ui/button";
import { ArrowRight, ForkKnifeCrossed } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-card border border-primary/10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ForkKnifeCrossed className="w-4 h-4" />
            MenuMind
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Ready to Transform Your
            <span> Restaurant?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join forward-thinking restaurants already using MenuMind to deliver
            exceptional dining experiences and boost revenue.
          </p>
          <Link href="/auth/login">
            <Button size="xl">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
