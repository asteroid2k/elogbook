import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { formatZodErrors } from "@/schema/generic";
import { createUserSchema } from "../schema";
import { genPassword } from "@/utils/helpers";

export async function POST(request: Request) {
  const res = await request.json();
  const val = createUserSchema.safeParse(res);
  if (!val.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
        errors: formatZodErrors(val.error.issues),
      },
      { status: 422 }
    );
  }

  const { username, email, password } = val.data;
  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ username, email }],
    },
    select: { username: true, email: true },
  });
  if (exists) {
    let field;
    if (username === exists.username) {
      field = "Username";
    }
    if (email === exists.email) {
      field = "Email";
    }
    return NextResponse.json(
      {
        message: `${field} is taken`,
      },
      { status: 400 }
    );
  }
  const { hash, salt } = await genPassword(password);
  const newLog = await prisma.user.create({
    data: { ...val.data, salt, password: hash, role: Role.SUPERVISOR },
  });

  return NextResponse.json(
    { message: "Admin account created", id: newLog.id },
    { status: 201 }
  );
}
