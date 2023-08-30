import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSchema } from "./schema";
import { formatZodErrors } from "@/schema/generic";

export async function GET() {
  const elogs = await prisma.elog.findMany();

  return NextResponse.json(elogs);
}

export async function POST(request: Request) {
  const res = await request.json();
  const val = createSchema.safeParse(res);
  if (!val.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
        errors: formatZodErrors(val.error.issues),
      },
      { status: 422 }
    );
  }
  const startDay = new Date(new Date().setHours(0, 0, 0)).toISOString();
  const endDay = new Date(new Date().setHours(23, 59, 59)).toISOString();
  const exists = await prisma.elog.findMany({
    where: {
      createdAt: { gte: startDay, lte: endDay },
    },
    select: { id: true },
  });
  if (exists.length > 0) {
    return NextResponse.json(
      {
        message: "There is already an e-log for today",
      },
      { status: 400 }
    );
  }
  const newLog = await prisma.elog.create({ data: val.data });

  return NextResponse.json(
    { message: "E-log added", id: newLog.id },
    { status: 201 }
  );
}
