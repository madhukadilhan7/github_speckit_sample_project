interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-lg bg-surface/95 px-4 backdrop-blur-sm">
      <p className="text-sm font-medium text-text">Delete this goal permanently?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-danger/90"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-background"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
