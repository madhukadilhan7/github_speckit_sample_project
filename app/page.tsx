import GoalBoard from "@/app/components/GoalBoard";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text">DoIt</h1>
        <p className="mt-1 text-sm text-text-muted">
          Track your goals and get things done.
        </p>
      </header>
      <GoalBoard />
    </main>
  );
}
