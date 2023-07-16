"use server";
import { openDb } from "@/lib/db.sql.lib";
import { throwErrorFromUnknown } from "@/lib/unknown-error.lib";
import { Checklist } from "./checklist.model";

export async function createChecklist(input: {
  checklist: Checklist;
  email: string;
}) {
  try {
    const db = await openDb();

    await db.run("INSERT INTO checklists (id, name) VALUES (?, ?)", [
      input.checklist.id,
      input.checklist.name,
    ]);

    await Promise.all(
      input.checklist.checklistItems.map((checklistItem) => {
        return db.run(
          "INSERT INTO checklistItems (id, checklistId, name, completed) VALUES (?, ?, ?, ?)",
          [checklistItem.id, input.checklist.id, checklistItem.name, false]
        );
      })
    );
  } catch (error) {
    throwErrorFromUnknown(error);
  }
}

export async function listChecklists(input: { email: string }) {
  try {
    const db = await openDb();

    return db.all("SELECT * FROM checklists", []);
  } catch (error) {
    throwErrorFromUnknown(error);
  }
}

export async function getChecklist(input: { id: string }) {
  try {
    const db = await openDb();

    const checklist = await db.get("SELECT * FROM checklists WHERE id = ?", [
      input.id,
    ]);

    if (!checklist) {
      return null;
    }

    const checklistItems = await db.all(
      "SELECT * FROM checklistItems WHERE checklistId = ?",
      [input.id]
    );

    return { ...checklist, checklistItems };
  } catch (error) {
    throwErrorFromUnknown(error);
  }
}

export async function completeChecklistItem(id: string) {
  try {
    const db = await openDb();

    await db.run("UPDATE checklistItems SET completed = true WHERE id = ?", id);
  } catch (error) {
    throwErrorFromUnknown(error);
  }
}

export async function toggleChecklistItemCompleted(id: string) {
  try {
    const db = await openDb();

    const checklistItem = await db.get(
      "SELECT * FROM checklistItems WHERE id = ?",
      id
    );

    if (!checklistItem) {
      return;
    }

    await db.run("UPDATE checklistItems SET completed = ? WHERE id = ?", [
      checklistItem.completed === 0 ? 1 : 0,
      id,
    ]);
  } catch (error) {
    throwErrorFromUnknown(error);
  }
}
