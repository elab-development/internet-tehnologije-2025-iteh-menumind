import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Restaurant Experience
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
            The Future of
            <span className="block">Dining Service</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
             Personalized recommendations, dietary accommodations, and seamless
            ordering - all through natural conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="xxl">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button asChild size="xxl" variant="outline">
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Setup in minutes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Cancel anytime
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16 w-full ">
            <div className="relative rounded-2xl overflow-hidden border border-border/30">
              <Image
                className="w-full h-auto object-cover"
                src="/hero-qr-scan.png"
                width={1920}
                height={1080}
                alt="Digital menu tablet in elegant restaurant setting"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-6 left-4 bg-background/60 backdrop-blur-sm border border-primary/5 sm:-left-6 rounded-xl p-4 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Concierge Active</p>
                  <p className="text-xs text-muted-foreground">
                    24/7 guest assistance
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 right-4 sm:-right-4 bg-background/60 backdrop-blur-sm border border-primary/5 rounded-xl p-4 hidden sm:block">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5  text-primary" />
                <span className="text-sm font-medium">4.9/5 Guest Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
