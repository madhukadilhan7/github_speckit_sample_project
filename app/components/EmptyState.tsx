interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 px-4 py-12 text-center">
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  );
}
