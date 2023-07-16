"use client";
import { useEffect, useState } from "react";
import {
  VeltCursor,
  VeltPresence,
  VeltProvider,
  useVeltClient,
} from "@veltdev/react";

import { toggleChecklistItemCompleted } from "@/models/checklist/checklist.actions";

import type { ChecklistItem } from "@/models/checklist/checklist.model";

export interface ChecklistItemsProps {
  readonly checklistItems: ChecklistItem[];
}

const NEXT_PUBLIC_VELT_API_KEY = process.env.NEXT_PUBLIC_VELT_API_KEY;

export const ChecklistItems: React.FC<ChecklistItemsProps> = (props) => {
  const [optimisticChecklistItems, setOptimisticChecklistItems] = useState<
    ChecklistItem[]
  >(props.checklistItems);

  const { client } = useVeltClient();

  useEffect(() => {
    if (client) {
      const user = {
        userId: `some id ${Math.random() * 10000}`,
        name: `some name ${Math.random() * 10000}`,
        email: "fake@email.com",
        photoUrl: "https://picsum.photos/seed/picsum/200",
      };

      client.identify(user);
    }
  }, [client]);

  const onToggleChecklistItemCompleted = async (formData: FormData) => {
    const checklistItemId = formData.get("checklistItemId");

    if (typeof checklistItemId === "string") {
      setOptimisticChecklistItems((checklistItems) =>
        checklistItems.map((checklistItem) => {
          if (checklistItem.id === checklistItemId) {
            return {
              ...checklistItem,
              // SQLLite doesn't support boolean type, so have to use 0 and 1
              completed: checklistItem.completed === 0 ? 1 : 0,
            };
          }

          return checklistItem;
        })
      );

      await toggleChecklistItemCompleted(checklistItemId);
    }
  };

  if (!NEXT_PUBLIC_VELT_API_KEY) {
    return <h1>Failed to initialize collaboration!</h1>;
  }

  return (
    <VeltProvider apiKey={NEXT_PUBLIC_VELT_API_KEY}>
      <section className="space-x-5 flex flex-wrap">
        <div className="space-x-2 flex">
          {optimisticChecklistItems.map((checklistItem) => {
            return (
              <form
                key={checklistItem.id}
                action={onToggleChecklistItemCompleted}
              >
                <input
                  type="hidden"
                  name={"checklistItemId"}
                  value={checklistItem.id}
                />

                <button
                  type="submit"
                  className={`py-1 px-3 text-xs bg-blue-600 cursor-pointer ${
                    checklistItem.completed === 1 ? "line-through" : ""
                  }`}
                >
                  {checklistItem.name}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <h1>Velt components below:</h1>

      <div className="bg-white">
        <VeltPresence />
        <VeltCursor />
      </div>
    </VeltProvider>
  );
};
