"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string; parentId: string | null };

type Variant = { type: string; value: string; priceDiff: number; stock: number };

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  offerPrice: number | null;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  category: { name: string };
  images: { url: string }[];
  variants: Variant[];
};

async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("/api/upload/product-image", {
    method: "POST",
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Upload failed");

  return data.url as string;
}

export default function AdminProductsPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [items, setItems] = React.useState<Product[]>([]);

  // editing
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // form fields
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState<number>(0);
  const [offerPrice, setOfferPrice] = React.useState<number>(0);
  const [stock, setStock] = React.useState<number>(0);
  const [categoryId, setCategoryId] = React.useState<string>("");

  const [isFeatured, setIsFeatured] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);

  const [images, setImages] = React.useState<string[]>([]);
  const [variants, setVariants] = React.useState<Variant[]>([]);

  // variant input
  const [vType, setVType] = React.useState("Color");
  const [vValue, setVValue] = React.useState("");
  const [vPriceDiff, setVPriceDiff] = React.useState(0);
  const [vStock, setVStock] = React.useState(0);

  async function load() {
    const [c, p] = await Promise.all([
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
    ]);

    setCategories(c);
    setItems(p);

    // default category in create mode
    if (!categoryId && c?.length) setCategoryId(c[0].id);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice(0);
    setOfferPrice(0);
    setStock(0);
    setImages([]);
    setVariants([]);
    setIsFeatured(false);
    setIsActive(true);

    if (categories?.length) setCategoryId(categories[0].id);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setOfferPrice(p.offerPrice ?? 0);
    setStock(p.stock);
    setCategoryId(p.categoryId);
    setIsFeatured(p.isFeatured);
    setIsActive(p.isActive);
    setImages(p.images.map((x) => x.url));
    setVariants(p.variants ?? []);
  }

  async function save() {
    if (!name.trim() || !categoryId) return;

    const body = {
      name,
      price: Number(price),
      offerPrice: offerPrice > 0 ? Number(offerPrice) : null,
      stock: Number(stock),
      categoryId,
      isFeatured,
      isActive,
      images,
      variants,
    };

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d?.error || "Save failed");
      return;
    }

    resetForm();
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load();
  }

  async function onPickFiles(files: FileList | null) {
    if (!files?.length) return;

    const list = Array.from(files);
    const uploaded: string[] = [];

    for (const f of list) {
      const url = await uploadFile(f);
      uploaded.push(url);
    }

    setImages((prev) => [...prev, ...uploaded]);
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((x) => x !== url));
  }

  function addVariant() {
    if (!vType.trim() || !vValue.trim()) return;

    setVariants((prev) => [
      ...prev,
      {
        type: vType.trim(),
        value: vValue.trim(),
        priceDiff: Number(vPriceDiff),
        stock: Number(vStock),
      },
    ]);

    setVValue("");
    setVPriceDiff(0);
    setVStock(0);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-black/70">
          Create, edit and manage products with images, variants, stock and pricing.
        </p>
      </div>

      {/* Create/Edit form */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold">
            {editingId ? "Edit Product" : "Create Product"}
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <Button variant="secondary" size="sm" onClick={resetForm}>
                Cancel Edit
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Product Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Digital Hearing Aid"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Category</label>
            <select
              className="h-11 rounded-2xl border border-black/10 bg-white/70 px-4 text-sm backdrop-blur outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.parentId ? `— ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Price (BDT)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Offer Price (optional)</label>
            <Input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-black/70">Stock</label>
            <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            {/* ✅ Step 3: Low stock indicator (in form) */}
            {stock <= 5 ? (
              <div className="text-xs text-red-600">Low stock (≤ 5)</div>
            ) : (
              <div className="text-xs text-black/50">Stock looks healthy.</div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              Featured
            </label>

            <label className="flex items-center gap-2 text-sm text-black/70">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-black/70">Images</div>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => onPickFiles(e.target.files)}
          />

          {images.length ? (
            <div className="grid gap-2 md:grid-cols-4">
              {images.map((url) => (
                <div key={url} className="rounded-2xl border border-black/10 bg-white/60 p-3">
                  <div className="text-xs text-black/70 truncate">{url}</div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="danger" onClick={() => removeImage(url)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-black/60">No images uploaded yet.</div>
          )}
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-black/70">Variants</div>

          <div className="grid gap-2 md:grid-cols-5">
            <select
              className="h-11 rounded-2xl border border-black/10 bg-white/70 px-4 text-sm backdrop-blur outline-none"
              value={vType}
              onChange={(e) => setVType(e.target.value)}
            >
              <option>Color</option>
              <option>Size</option>
              <option>Model</option>
            </select>

            <Input value={vValue} onChange={(e) => setVValue(e.target.value)} placeholder="Value e.g. Red / XL" />

            <Input
              type="number"
              value={vPriceDiff}
              onChange={(e) => setVPriceDiff(Number(e.target.value))}
              placeholder="Price diff"
            />

            <Input
              type="number"
              value={vStock}
              onChange={(e) => setVStock(Number(e.target.value))}
              placeholder="Stock"
            />

            <Button onClick={addVariant}>Add Variant</Button>
          </div>

          {variants.length ? (
            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div
                  key={`${v.type}-${v.value}-${idx}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white/60 px-3 py-2 text-sm"
                >
                  <div className="text-black/80">
                    <span className="font-medium">{v.type}</span>: {v.value} • diff: {v.priceDiff} • stock: {v.stock}
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeVariant(idx)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-black/60">No variants added yet.</div>
          )}
        </div>

        <Button onClick={save}>
          {editingId ? "Update Product" : "Create Product"}
        </Button>
      </Card>

      {/* List */}
      <Card className="p-4">
        <div className="text-sm font-semibold">All Products</div>

        <div className="mt-3 space-y-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white/60 px-3 py-3"
            >
              <div className="text-sm">
                <div className="font-medium flex flex-wrap items-center gap-2">
                  {p.name}
                  {!p.isActive ? <span className="text-xs text-red-600">(Inactive)</span> : null}
                  {p.isFeatured ? <span className="text-xs text-black/60">(Featured)</span> : null}
                </div>

                <div className="text-xs text-black/60">
                  {p.category?.name} • SKU: {p.sku} • Price: ৳{p.price} • Stock: {p.stock}
                  {p.offerPrice ? <> • Offer: ৳{p.offerPrice}</> : null}
                </div>

                {/* ✅ Step 3: Low stock indicator (in list) */}
                {p.stock <= 5 ? (
                  <div className="mt-1 text-xs text-red-600">Low stock (≤ 5)</div>
                ) : null}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => startEdit(p)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => remove(p.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {!items.length ? <div className="text-sm text-black/60">No products yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}