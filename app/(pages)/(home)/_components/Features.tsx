import {
  BarChart3,
  ChefHat,
  MessageSquare,
  QrCode,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI Concierge Chat",
      description:
        "Guests chat naturally to discover dishes, ask about ingredients, and get personalized recommendations based on their preferences and dietary needs.",
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description:
        "Our AI understands allergies, dietary restrictions, and taste preferences to suggest the perfect dishes for every guest.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Track guest interactions, popular dishes, and emerging trends. Make data-driven decisions to optimize your menu.",
    },
    {
      icon: QrCode,
      title: "Instant QR Access",
      description:
        "Generate unique QR codes for each table. Guests scan and start chatting with your AI waiter in seconds.",
    },
    {
      icon: Shield,
      title: "Multi-Restaurant Ready",
      description:
        "Isolated data, separate admin access, and unique branding for each location. Scale from one restaurant to hundreds.",
    },
    {
      icon: ChefHat,
      title: "Menu Management",
      description:
        "Easily update dishes, prices, ingredients, and availability. Changes reflect instantly across all touchpoints.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Features
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to Elevate Dining
          </h2>
          <p className="text-lg text-muted-foreground">
            From intelligent recommendations to comprehensive analytics,
            MenuMind provides all the tools to transform your guest experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title + " " + index}
              className="group bg-card rounded-2xl flex flex-col items-center p-6 lg:p-8 border border-border/50"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-5">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
