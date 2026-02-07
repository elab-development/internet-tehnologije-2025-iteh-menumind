const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Set Up Your Menu",
      description:
        "Import or create your menu with detailed dish information, allergens, and dietary tags.",
    },
    {
      step: "02",
      title: "Generate QR Codes",
      description:
        "Create unique codes for tables, takeout, or delivery. Each links directly to your AI concierge.",
    },
    {
      step: "03",
      title: "Guests Start Chatting",
      description:
        "Diners scan, ask questions, and receive personalized recommendations instantly.",
    },
  ];
  return (
    <section className="py-20 sm:py-28 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Get Started in
            <span> Three Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Launch your AI-powered dining experience in minutes, not weeks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.step + " " + index} className="relative text-center">
              <div className="relative inline-flex items-center bg-primary/5 justify-center w-20 h-20 rounded-xl text-primary text-2xl font-bold mb-6">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
