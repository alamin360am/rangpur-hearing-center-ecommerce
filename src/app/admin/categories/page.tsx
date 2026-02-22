"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
};

export default function AdminCategoriesPage() {
  const [items, setItems] = React.useState<Category[]>([]);
  const [name, setName] = React.useState("");
  const [parentId, setParentId] = React.useState<string>("");

  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editParentId, setEditParentId] = React.useState<string>("");
  const [editActive, setEditActive] = React.useState(true);

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setItems(data);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, parentId: parentId || null }),
    });
    setName("");
    setParentId("");
    load();
  }

  function startEdit(c: Category) {
    setEditId(c.id);
    setEditName(c.name);
    setEditParentId(c.parentId ?? "");
    setEditActive(c.isActive);
  }

  async function saveEdit() {
    if (!editId) return;
    await fetch(`/api/admin/categories/${editId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: editName,
        parentId: editParentId || null,
        isActive: editActive,
      }),
    });
    setEditId(null);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    load();
  }

  const parents = items.filter((c) => !c.parentId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-black/70">Add, edit and manage subcategories.</p>
      </div>

      {/* Create */}
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_260px_auto]">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
          <select
            className="h-11 rounded-2xl border border-black/10 bg-white/70 px-4 text-sm backdrop-blur outline-none"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">No parent (Main)</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <Button onClick={create}>Add</Button>
        </div>
      </Card>

      {/* List */}
      <Card className="p-4 space-y-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-black/10 bg-white/60 px-3 py-3"
          >
            {editId === c.id ? (
              <div className="grid gap-3 md:grid-cols-[1fr_260px_auto_auto]">
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <select
                  className="h-11 rounded-2xl border border-black/10 bg-white/70 px-4 text-sm backdrop-blur outline-none"
                  value={editParentId}
                  onChange={(e) => setEditParentId(e.target.value)}
                >
                  <option value="">No parent (Main)</option>
                  {parents
                    .filter((p) => p.id !== c.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>

                <label className="flex items-center gap-2 text-sm text-black/70">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                  />
                  Active
                </label>

                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <div className="font-medium">
                    {c.name} {c.parentId ? <span className="text-xs text-black/50">(Sub)</span> : null}
                    {!c.isActive ? <span className="ml-2 text-xs text-red-600">(Inactive)</span> : null}
                  </div>
                  <div className="text-xs text-black/50">{c.slug}</div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => startEdit(c)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remove(c.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!items.length ? <div className="text-sm text-black/60">No categories yet.</div> : null}
      </Card>
    </div>
  );
}