import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/schema/generic";
import { isSameDay } from "date-fns";
import { updateSchema } from "../../schema/elogs.schema";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  const { id } = params;

  const elog = await prisma.elog.findFirst({ where: { id } });
  if (!elog) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  return Response.json(elog);
}

export async function PUT(request: Request, { params }: Params) {
  const res = await request.json();
  const val = updateSchema.safeParse(res);
  if (!val.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
        errors: formatZodErrors(val.error.issues),
      },
      { status: 422 }
    );
  }
  const { id } = params;

  const elog = await prisma.elog.findUnique({
    where: { id },
    select: { createdAt: true, reviewed: true },
  });

  if (!elog) {
    return NextResponse.json({ message: "E-log not found" }, { status: 404 });
  }
  if (elog.reviewed) {
    return NextResponse.json(
      { message: "E-log has already been reviewed" },
      { status: 400 }
    );
  }
  if (!isSameDay(new Date(), elog.createdAt)) {
    return NextResponse.json(
      { message: "Only today's e-logs can be edited" },
      { status: 400 }
    );
  }

  const updated = await prisma.elog.update({
    where: { id },
    data: val.data,
    select: { id: true },
  });

  return NextResponse.json({ message: "E-log updated", id: updated.id });
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = params;

  await prisma.elog.delete({ where: { id } });

  return Response.json({});
}
