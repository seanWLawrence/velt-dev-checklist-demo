function id(): string {
  return Math.random().toString(36).slice(2);
}

export class ChecklistItem {
  readonly id: string;
  readonly checklistId: string;
  readonly name: string;
  readonly completed: number;

  constructor(overrides?: Omit<Partial<ChecklistItem>, "id">) {
    this.id = id();
    this.checklistId = overrides?.checklistId || id();
    this.name = overrides?.name || `some checklist item name ${id()}`;
    this.completed = overrides?.completed || 0;
  }
}

export class Checklist {
  readonly id: string;
  readonly name: string;
  readonly checklistItems: ChecklistItem[];

  constructor(input: {
    email: string;
    overrides?: Omit<Partial<Checklist>, "id">;
  }) {
    this.id = id();

    this.name = input.overrides?.name || `some checklist name ${id()}`;

    this.checklistItems = input.overrides?.checklistItems || [
      new ChecklistItem({ checklistId: this.id }),
      new ChecklistItem({ checklistId: this.id }),
      new ChecklistItem({ checklistId: this.id }),
    ];
  }
}
