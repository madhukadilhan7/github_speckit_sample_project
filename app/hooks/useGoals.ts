"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Goal, GoalStore } from "@/app/types/goal";

const STORAGE_KEY = "doit:goals";
const CURRENT_VERSION = 1;

// --- Change notification for useSyncExternalStore ---

const listeners = new Set<() => void>();

function emitChange() {
  for (const l of listeners) l();
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

// --- Storage availability (probed once) ---

let _probed = false;
let _available = true;

function isStorageAvailable(): boolean {
  if (_probed) return _available;
  try {
    const k = "__doit_probe__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    _available = true;
  } catch {
    _available = false;
  }
  _probed = true;
  return _available;
}

// --- Read / Write ---

function readGoals(): Goal[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const store: GoalStore = JSON.parse(raw);
    if (store.version === CURRENT_VERSION && Array.isArray(store.goals)) {
      return store.goals;
    }
    return [];
  } catch {
    return [];
  }
}

function writeGoals(goals: Goal[]): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: CURRENT_VERSION, goals } satisfies GoalStore),
    );
  } catch {
    // Quota exceeded — silently fail
  }
}

// --- Snapshot (must return referentially stable value when unchanged) ---

interface Snapshot {
  goals: Goal[];
  storageAvailable: boolean;
}

const SERVER_SNAPSHOT: Snapshot = { goals: [], storageAvailable: true };

let _cachedRaw: string | null | undefined; // undefined = not yet cached
let _cachedSnapshot: Snapshot = SERVER_SNAPSHOT;

function getSnapshot(): Snapshot {
  const available = isStorageAvailable();
  if (!available) {
    if (!_cachedSnapshot.storageAvailable) return _cachedSnapshot;
    _cachedSnapshot = { goals: [], storageAvailable: false };
    _cachedRaw = null;
    return _cachedSnapshot;
  }

  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return _cachedSnapshot;
  }

  if (raw === _cachedRaw && _cachedRaw !== undefined) return _cachedSnapshot;

  _cachedRaw = raw;
  _cachedSnapshot = { goals: readGoals(), storageAvailable: true };
  return _cachedSnapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

// --- Mutation helpers (write → invalidate cache → emit) ---

function mutateGoals(updater: (prev: Goal[]) => Goal[]): void {
  const current = readGoals();
  const next = updater(current);
  writeGoals(next);
  _cachedRaw = undefined; // invalidate so next getSnapshot reads fresh
  emitChange();
}

// --- Hook ---

export function useGoals() {
  const { goals, storageAvailable } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const activeGoals = goals
    .filter((g) => !g.completed)
    .sort((a, b) => a.endDate.localeCompare(b.endDate));

  const completedGoals = goals
    .filter((g) => g.completed)
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

  const addGoal = useCallback((title: string, endDate: string) => {
    const trimmed = title.trim();
    if (!trimmed || trimmed.length > 200) return;
    if (!endDate || Number.isNaN(new Date(endDate + "T00:00:00").getTime()))
      return;

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: trimmed,
      endDate,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    mutateGoals((prev) => [...prev, newGoal]);
  }, []);

  const completeGoal = useCallback((id: string) => {
    mutateGoals((prev) =>
      prev.map((g) =>
        g.id === id && !g.completed
          ? { ...g, completed: true, completedAt: new Date().toISOString() }
          : g,
      ),
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    mutateGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return {
    activeGoals,
    completedGoals,
    addGoal,
    completeGoal,
    deleteGoal,
    storageAvailable,
  };
}


