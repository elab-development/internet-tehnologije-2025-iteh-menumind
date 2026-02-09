import { db } from "@/db/db";
import { restaurants } from "@/db/schema/restaurants";
import { GuestAccessCard } from "./guest-access-card";
import { SettingsForm } from "./settings-form";
import SettingsHeader from "./settings-header";

const SettingsContent = async () => {
  const restaurant = await db.select().from(restaurants).limit(1);

  if (!restaurant.length) return null;
  return (
    <div className="flex flex-col gap-6 p-6">
      <SettingsHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsForm restaurant={restaurant[0]} />
        <GuestAccessCard slug={restaurant[0].slug} />
      </div>
    </div>
  );
};

export default SettingsContent;
