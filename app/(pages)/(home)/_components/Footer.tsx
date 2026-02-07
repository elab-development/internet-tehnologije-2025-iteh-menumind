import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © 2026 All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
