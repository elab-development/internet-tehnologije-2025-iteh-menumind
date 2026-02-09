"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRestaurant } from "@/utils/useRestaurant";
import { toast } from "sonner";

export function GuestAccessCard() {
  const { restaurant } = useRestaurant();
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/r/${restaurant.slug}`;

  function handleCopy(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Guest access URL copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy URL. Please try again.");
        console.error("Error copying text: ", err);
      });
  }
  return (
    <Card className="max-h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Guest Access</CardTitle>
        <CardDescription className="text-sm">
          Share this link or use it for QR codes
        </CardDescription>
      </CardHeader>

      <CardContent className="flex gap-2">
        <Input value={url} readOnly className="flex-1" />
        <Button
          variant="outline"
          onClick={() => {
            handleCopy(url);
          }}
        >
          Copy
        </Button>
      </CardContent>
    </Card>
  );
}
