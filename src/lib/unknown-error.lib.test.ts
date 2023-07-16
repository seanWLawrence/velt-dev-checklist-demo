import { expect, test } from "vitest";

import { throwErrorFromUnknown } from "./unknown-error.lib";

test("handles string", () => {
  const message = "some error";

  expect(() => throwErrorFromUnknown(message)).toThrowError(message);
});

test("handles error", () => {
  const message = "some error";
  const error = new Error(message);

  expect(() => throwErrorFromUnknown(error)).toThrowError(message);
});

test("handles object", () => {
  const message = "some error";
  const error = { message };

  expect(() => throwErrorFromUnknown(error)).toThrowError(
    JSON.stringify(error)
  );
});

test("handles number", () => {
  const message = 400;

  expect(() => throwErrorFromUnknown(message)).toThrowError(message.toString());
});

test.each([Boolean(true), null, undefined, Symbol("some symbol")])(
  "%s is handled as unknown error",
  (unknownError) => {
    expect(() => throwErrorFromUnknown(unknownError)).toThrowError(
      "Unknown Error"
    );
  }
);
