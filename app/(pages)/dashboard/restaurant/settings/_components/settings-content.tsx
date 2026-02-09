import { GuestAccessCard } from "./guest-access-card";
import { SettingsForm } from "./settings-form";
import SettingsHeader from "./settings-header";

const SettingsContent = async () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <SettingsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsForm />
        <GuestAccessCard />
      </div>
    </div>
  );
};

export default SettingsContent;
