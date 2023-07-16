export function throwErrorFromUnknown(error: unknown): never {
  if (error instanceof Error) {
    throw error;
  }

  if (typeof error === "string") {
    throw new Error(error);
  }

  if (typeof error === "object" && error !== null) {
    throw new Error(JSON.stringify(error));
  }

  if (typeof error === "number") {
    throw new Error(error.toString());
  }

  throw new Error("Unknown Error");
}
