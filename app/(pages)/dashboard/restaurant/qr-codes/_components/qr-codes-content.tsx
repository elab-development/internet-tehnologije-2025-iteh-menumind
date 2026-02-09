"use client";

import { Download, Plus, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRestaurant } from "@/utils/useRestaurant";
import { toast } from "sonner";

interface TableQR {
  id: string;
  tableNumber: string;
  url: string;
}

function QRCodeCanvas({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, url, {
      width: 200,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).catch(console.error);
  }, [url]);

  return <canvas ref={canvasRef} className="rounded-lg" />;
}

export function QRCodesContent() {
  const { restaurant } = useRestaurant();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const storageKey = useMemo(
    () => `tables-${restaurant.slug}`,
    [restaurant.slug],
  );

  const [tables, setTables] = useState<TableQR[]>([]);
  const [newTableNumber, setNewTableNumber] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setTables(JSON.parse(stored));
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tables));
  }, [tables, storageKey]);

  const buildUrl = useCallback(
    (tableNumber: string) =>
      `${baseUrl}/r/${restaurant.slug}?table=${tableNumber}`,
    [baseUrl, restaurant.slug],
  );

  const handleAddTable = useCallback(() => {
    const value = newTableNumber.trim();

    if (!value) {
      toast.error("Please enter a valid table number.");
      return;
    }

    if (tables.some((t) => t.tableNumber === value)) {
      toast.error("Table number already exists.");
      return;
    }

    setTables((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        tableNumber: value,
        url: buildUrl(value),
      },
    ]);

    setNewTableNumber("");

    toast.success(`Table ${value} added successfully.`);
  }, [newTableNumber, tables, buildUrl, toast]);

  const handleAddTables1to10 = useCallback(() => {
    const existing = new Set(tables.map((t) => t.tableNumber));
    const batch: TableQR[] = [];

    for (let i = 1; i <= 10; i++) {
      const num = String(i);
      if (existing.has(num)) continue;

      batch.push({
        id: crypto.randomUUID(),
        tableNumber: num,
        url: buildUrl(num),
      });
    }

    if (!batch.length) {
      toast.error("Tables 1–10 already exist.");
      return;
    }

    setTables((prev) => [...prev, ...batch]);

    toast.success(`${batch.length} table(s) added successfully.`);
  }, [tables, buildUrl, toast]);

  const handleDeleteTable = useCallback(
    (id: string) => {
      setTables((prev) => prev.filter((t) => t.id !== id));

      toast.success("Table removed successfully.");
    },
    [toast],
  );

  const handleDownload = useCallback(
    async (table: TableQR) => {
      try {
        const dataUrl = await QRCode.toDataURL(table.url, {
          width: 400,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "H",
        });

        const link = document.createElement("a");
        link.download = `table-${table.tableNumber}-qr.png`;
        link.href = dataUrl;
        link.click();
      } catch {
        toast.error("Could not generate QR code.");
      }
    },
    [toast],
  );

  const handleDownloadAll = useCallback(async () => {
    for (const table of tables) {
      await handleDownload(table);
      await new Promise((r) => setTimeout(r, 200));
    }
  }, [tables, handleDownload]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">QR Codes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate QR codes for each table in your restaurant
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Add Tables</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter table numbers to generate QR codes
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Table number (e.g. 1, A1, Patio-3)"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTable()}
            />
            <Button onClick={handleAddTable}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleAddTables1to10}>
              Add Tables 1–10
            </Button>
            <Button
              variant="outline"
              disabled={!tables.length}
              onClick={handleDownloadAll}
            >
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardContent>
      </Card>

      {tables.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <Card key={table.id} className="border-border/50">
              <CardContent className="flex flex-col items-center p-6">
                <div className="mb-4 rounded-lg bg-white p-3">
                  <QRCodeCanvas url={table.url} />
                </div>

                <h3 className="text-lg font-semibold">
                  Table {table.tableNumber}
                </h3>

                <p className="mb-4 truncate text-xs text-muted-foreground">
                  {table.url}
                </p>

                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(table)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteTable(table.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-12">
            <Plus className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tables yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your first table to generate a QR code
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
