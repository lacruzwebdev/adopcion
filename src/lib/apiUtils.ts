import { z } from "zod";

export function getZodDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault)
        return [key, value._def.defaultValue()];
      return [key, ""];
    }),
  );
}

export default async function callAction<T>(action: Promise<T>): Promise<T> {
  logDebug("Server Action", "out");
  const start = Date.now();
  const res = await action;
  const end = Date.now();
  logDebug(`Server Action took ${end - start}ms to execute}`, "in", res);
  return res;
}

function logDebug<T>(message: string, type: "in" | "out", res?: T) {
  if (process.env.NODE_ENV === "development") {
    const colors =
      type === "in"
        ? "background: #3fb0d8; color: #fff"
        : "background: #72e3ff; color: #000";
    console.log(
      `%c ${type === "in" ? "<<" : ">>"} ${message}`,
      colors,
      res ?? "",
    );
  }
}
