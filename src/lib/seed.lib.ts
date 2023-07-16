import { Checklist } from "@/models/checklist/checklist.model";
import { createChecklist } from "@/models/checklist/checklist.actions";
import { openDb } from "./db.sql.lib";

const email = "fake@email.com";

export async function seed() {
  const db = await openDb();

  const checklists: Checklist[] = new Array(10)
    .fill(null)
    .map(() => new Checklist({ email }));

  await db.exec(
    "CREATE TABLE IF NOT EXISTS checklists (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL)"
  );

  await db.exec(
    "CREATE TABLE IF NOT EXISTS checklistItems (id TEXT PRIMARY KEY NOT NULL, checklistId TEXT NOT NULL, name TEXT NOT NULL, completed BOOLEAN NOT NULL, FOREIGN KEY(checklistId) REFERENCES checklists(id))"
  );

  await Promise.all(
    checklists.map((checklist) => createChecklist({ checklist, email }))
  );
}
