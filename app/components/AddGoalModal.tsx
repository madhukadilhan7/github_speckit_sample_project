"use client";

import { useRef, useEffect, useState } from "react";

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, endDate: string) => void;
}

export default function AddGoalModal({ open, onClose, onAdd }: AddGoalModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{ title?: string; endDate?: string }>({});

  // Sync open prop with native dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function validate(): boolean {
    const newErrors: { title?: string; endDate?: string } = {};
    const trimmed = title.trim();

    if (!trimmed) {
      newErrors.title = "Title is required.";
    } else if (trimmed.length > 200) {
      newErrors.title = "Title must be 200 characters or fewer.";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required.";
    } else if (Number.isNaN(new Date(endDate + "T00:00:00").getTime())) {
      newErrors.endDate = "Please enter a valid date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onAdd(title.trim(), endDate);
    setTitle("");
    setEndDate("");
    setErrors({});
    onClose();
  }

  function handleClose() {
    setTitle("");
    setEndDate("");
    setErrors({});
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
      aria-labelledby="add-goal-heading"
      className="w-full max-w-md rounded-xl border border-border bg-surface p-0 shadow-lg backdrop:bg-black/30 backdrop:backdrop-blur-sm"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <h2
          id="add-goal-heading"
          className="mb-6 text-lg font-semibold text-text"
        >
          Add New Goal
        </h2>

        {/* Title field */}
        <div className="mb-4">
          <label
            htmlFor="goal-title"
            className="mb-1 block text-sm font-medium text-text"
          >
            Title
          </label>
          <input
            id="goal-title"
            type="text"
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-xs text-danger">{errors.title}</p>
          )}
        </div>

        {/* End Date field */}
        <div className="mb-6">
          <label
            htmlFor="goal-end-date"
            className="mb-1 block text-sm font-medium text-text"
          >
            End Date
          </label>
          <input
            id="goal-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.endDate && (
            <p className="mt-1 text-xs text-danger">{errors.endDate}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-background"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 active:bg-primary/80"
          >
            Add Goal
          </button>
        </div>
      </form>
    </dialog>
  );
}
