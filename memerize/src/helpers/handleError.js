import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class CustomError extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function handleError(error) {
  if (error instanceof CustomError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  } else if (error instanceof ZodError) {
    const formatted = error.issues.map((issue) => {
      return issue.path[0] + " " + issue.message.toLowerCase();
    });
    return NextResponse.json({ error: formatted }, { status: 400 });
  } else if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
