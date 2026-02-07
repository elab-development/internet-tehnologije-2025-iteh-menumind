import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Choose Your
            <span> Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-card flex flex-col justify-between rounded-2xl p-8 border border-border/50">
            <div>
              <h3 className="text-xl font-semibold mb-1">Starter</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Perfect for small restaurants
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />1 Restaurant
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Up to 50 menu items
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Basic analytics
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Email support
                </li>
              </ul>
            </div>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-card rounded-2xl p-8 border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-medium text-primary-foreground">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold mb-1">Professional</h3>
            <p className="text-muted-foreground text-sm mb-6">
              For growing businesses
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$249</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Up to 5 Restaurants
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Unlimited menu items
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Advanced analytics & AI insights
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Priority support
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Custom branding
              </li>
            </ul>
            <Link href="/auth/login">
              <Button size="lg" className="w-full rounded-full">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-card rounded-2xl p-8 border border-border/50">
            <h3 className="text-xl font-semibold mb-1">Enterprise</h3>
            <p className="text-muted-foreground text-sm mb-6">
              For large chains
            </p>
            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Unlimited Restaurants
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                White-label solution
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Dedicated account manager
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                API access
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                SLA & 24/7 support
              </li>
            </ul>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
