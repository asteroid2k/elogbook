import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
  return NextResponse.json(students);
}
