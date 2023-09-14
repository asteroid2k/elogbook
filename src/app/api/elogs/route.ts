import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/schema/generic";
import { cookies } from "next/headers";
import { createSchema } from "../schema/elogs.schema";
import { extractUser } from "@/utils/helpers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("elogbook_token")?.value;
  const user = extractUser(token || "");
  if (!user) {
    NextResponse.json({}, { status: 401 });
  }
  const query = user?.role === "SUPERVISOR" ? {} : { author: user?.email };

  const elogs = await prisma.elog.findMany({
    where: query,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(elogs);
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("elogbook_token")?.value;
  const user = extractUser(token || "");
  console.log(user);

  if (!user) {
    NextResponse.json({}, { status: 401 });
  }

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
  // const startDay = new Date(new Date().setHours(0, 0, 0)).toISOString();
  // const endDay = new Date(new Date().setHours(23, 59, 59)).toISOString();
  // const exists = await prisma.elog.findMany({
  //   where: {
  //     author: user?.email,
  //     createdAt: { gte: startDay, lte: endDay },
  //   },
  //   select: { id: true },
  // });
  // if (exists.length > 0) {
  //   return NextResponse.json(
  //     {
  //       message: "There is already an e-log for today",
  //     },
  //     { status: 400 }
  //   );
  // }
  const newLog = await prisma.elog.create({
    data: { ...val.data, author: user?.email },
  });

  return NextResponse.json(
    { message: "E-log added", id: newLog.id },
    { status: 201 }
  );
}
