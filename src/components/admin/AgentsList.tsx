"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GripVertical, Users, Star } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import SearchBox from "./SearchBox";
import { useAdminSearch } from "./useAdminSearch";
import { Badge, Card, EmptyState } from "./ui";

interface AgentRow {
  id: string;
  name: string;
  title: string;
  location: string;
  email: string;
  rating: number;
  featured: boolean;
  photo: string | null;
  sort_order: number;
}

function AgentRowItem({ agent, draggable }: { agent: AgentRow; draggable: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: agent.id,
    disabled: !draggable,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 bg-white ${isDragging ? "relative z-10 shadow-lg" : ""}`}
    >
      {draggable && (
        <button
          type="button"
          aria-label={`Reorder ${agent.name}`}
          className="cursor-grab touch-none px-2 py-3.5 text-gray-300 transition hover:text-gray-500 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" strokeWidth={1.8} />
        </button>
      )}
      <Link
        href={`/admin/agents/${agent.id}`}
        className="flex flex-1 items-center gap-4 py-3.5 pr-5 transition hover:bg-stone-50"
      >
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {agent.photo && (
            <Image src={agent.photo} alt="" fill sizes="44px" className="object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-ink-900">{agent.name}</p>
            {agent.featured && <Badge tone="gold">Featured</Badge>}
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {agent.title} &middot; {agent.location}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-sm text-ink-900">
          <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" strokeWidth={0} />
          {Number(agent.rating).toFixed(1)}
        </div>
        <p className="hidden w-48 shrink-0 truncate text-sm text-gray-500 sm:block">
          {agent.email}
        </p>
      </Link>
    </li>
  );
}

export default function AgentsList({ rows }: { rows: AgentRow[] }) {
  const [items, setItems] = useState(rows);
  const [prevRows, setPrevRows] = useState(rows);
  if (rows !== prevRows) {
    setPrevRows(rows);
    setItems(rows);
  }
  const [saving, setSaving] = useState(false);
  const { query, setQuery, filtered } = useAdminSearch(items, (a, q) =>
    [a.name, a.title, a.location, a.email].some((v) => v.toLowerCase().includes(q)),
  );
  const draggable = query.trim() === "";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((a) => a.id === active.id);
    const newIndex = items.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    setSaving(true);
    const supabase = createClient();
    try {
      await Promise.all(
        reordered.map((agent, index) =>
          agent.sort_order === index
            ? Promise.resolve()
            : supabase.from("agents").update({ sort_order: index }).eq("id", agent.id),
        ),
      );
      setItems(reordered.map((agent, index) => ({ ...agent, sort_order: index })));
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: "agents" }),
      }).catch(() => {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search agents…" />
        {saving && <span className="shrink-0 text-xs text-gray-400">Saving order…</span>}
      </div>
      {!draggable && (
        <p className="mt-2 text-xs text-gray-400">Clear the search to drag and reorder agents.</p>
      )}

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10" strokeWidth={1.3} />}
            title="No agents found"
            description="Try a different search, or add your first agent."
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filtered.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-gray-100">
                {filtered.map((a) => (
                  <AgentRowItem key={a.id} agent={a} draggable={draggable} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </Card>
    </div>
  );
}
