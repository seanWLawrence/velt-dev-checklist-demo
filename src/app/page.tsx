"use server";
import Link from "next/link";

import { listChecklists } from "@/models/checklist/checklist.actions";
import { seed } from "@/lib/seed.lib";

export default async function Home() {
  const email = "some@email.com";

  await seed();

  const checklists = await listChecklists({ email });

  return (
    <main className="space-y-2">
      <h1 className="text-2xl font-bold">Checklists</h1>

      <section className="space-y-5">
        {checklists?.map((checklist) => {
          return (
            <div key={checklist.id}>
              <Link href={`/${checklist.id}`}>
                <h2>{checklist.name}</h2>
              </Link>
            </div>
          );
        })}
      </section>
    </main>
  );
}
