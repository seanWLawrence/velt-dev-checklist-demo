"use server";
import { ChecklistItem } from "@/models/checklist/checklist.model";
import { getChecklist } from "@/models/checklist/checklist.actions";
import { ChecklistItems } from "./ChecklistItems.client";

export default async function ChecklistPage({
  params,
}: {
  params: { id: string };
}) {
  const checklist = await getChecklist({ id: params.id });

  if (!checklist) {
    return <h1>No checklist</h1>;
  }

  return (
    <main className="space-y-2">
      <h1 className="text-2xl font-bold">{checklist.name}</h1>

      <ChecklistItems
        checklistItems={checklist.checklistItems.map(
          (checklistItem: ChecklistItem) => {
            return {
              ...checklistItem,
              completed: checklistItem.completed,
            };
          }
        )}
      />
    </main>
  );
}
