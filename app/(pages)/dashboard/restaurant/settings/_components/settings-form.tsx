"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Restaurant } from "./types";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  urlSlug: z
    .string()
    .min(2, "URL Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "URL Slug must be lowercase and can contain hyphens",
    ),
  description: z.string().optional(),
  themeColor: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SettingsForm({ restaurant }: { restaurant: Restaurant }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: restaurant.name,
      urlSlug: restaurant.slug,
      description: restaurant.description || "",
      themeColor: restaurant.themeColor || "#e48d3d",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Restaurant Details</CardTitle>
        <CardDescription>
          Basic information about your restaurant
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Restaurant Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="My Awesome Restaurant"
                  {...form.register("name")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="urlSlug">URL Slug</FieldLabel>
                <Input
                  id="urlSlug"
                  placeholder="my-awesome-restaurant"
                  {...form.register("urlSlug")}
                />
                <FieldDescription className="text-xs">
                  Used in your guest-facing URL
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  id="description"
                  placeholder="A short description of your restaurant"
                  {...form.register("description")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="themeColor">Theme Color</FieldLabel>
                <div className="flex gap-1 items-center">
                  <Input
                    className="max-w-14 h-12 cursor-pointer"
                    id="themeColor"
                    type="color"
                    defaultValue={restaurant.themeColor || "#e48d3d"}
                    {...form.register("themeColor")}
                  />
                  <Input
                    className="max-w-24 h-12"
                    value={form.watch("themeColor")}
                    readOnly
                  />
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal" className="justify-end gap-2">
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  );
}
