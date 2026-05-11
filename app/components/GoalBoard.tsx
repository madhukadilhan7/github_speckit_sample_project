"use client";

import { useState } from "react";
import { useGoals } from "@/app/hooks/useGoals";
import GoalCard from "@/app/components/GoalCard";
import EmptyState from "@/app/components/EmptyState";
import AddGoalModal from "@/app/components/AddGoalModal";

export default function GoalBoard() {
  const {
    activeGoals,
    completedGoals,
    addGoal,
    completeGoal,
    deleteGoal,
    storageAvailable,
  } = useGoals();

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      {/* Storage unavailable banner */}
      {!storageAvailable && (
        <div className="mb-4 rounded-lg border border-warning bg-warning-light px-4 py-2 text-sm text-warning">
          Goals won&apos;t be saved between sessions in this browser mode.
        </div>
      )}

      {/* Add Goal button */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 active:bg-primary/80"
        >
          + Add Goal
        </button>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Current Goals */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text">
            Current Goals
            {activeGoals.length > 0 && (
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({activeGoals.length})
              </span>
            )}
          </h2>
          <div className="flex flex-col gap-3">
            {activeGoals.length === 0 ? (
              <EmptyState message="No current goals. Add one to get started!" />
            ) : (
              activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onComplete={completeGoal}
                  onDelete={deleteGoal}
                />
              ))
            )}
          </div>
        </section>

        {/* Completed Goals */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-text">
            Completed Goals
            {completedGoals.length > 0 && (
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({completedGoals.length})
              </span>
            )}
          </h2>
          <div className="flex flex-col gap-3">
            {completedGoals.length === 0 ? (
              <EmptyState message="No completed goals yet. Keep going!" />
            ) : (
              completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDelete={deleteGoal}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addGoal}
      />
    </div>
  );
}
