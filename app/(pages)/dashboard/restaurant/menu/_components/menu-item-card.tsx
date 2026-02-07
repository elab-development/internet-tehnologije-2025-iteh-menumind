import { Card, CardContent } from "@/components/ui/card";

export function MenuItemCardSkeleton() {
  return (
    <Card className="animate-pulse border border-border/50 pt-0 pb-2">
      <CardContent className="p-0">
        <div className="relative aspect-4/3 rounded-t-lg bg-muted"></div>

        <div className="p-4 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>

          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-muted rounded flex-1"></div>
            <div className="h-6 bg-muted rounded flex-1"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
