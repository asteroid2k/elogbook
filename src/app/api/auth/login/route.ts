import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/schema/generic";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty().email().toLowerCase(),
  password: z.string().nonempty(),
});
export const loginResponseSchema = z.object({
  username: z.string(),
  email: z.string(),
  role: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;

export async function POST(request: Request) {
  const res = await request.json();
  const val = loginSchema.safeParse(res);
  if (!val.success) {
    return NextResponse.json(
      {
        message: "Invalid data",
        errors: formatZodErrors(val.error.issues),
      },
      { status: 422 }
    );
  }

  const { email, password } = val.data;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      username: true,
      password: true,
      email: true,
      role: true,
      id: true,
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        message: `Invalid credentials`,
      },
      { status: 400 }
    );
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      {
        message: `Invalid credentials`,
      },
      { status: 400 }
    );
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_KEY || "private_key"
  );

  return NextResponse.json(
    { message: "Logged in", user: loginResponseSchema.parse(user), token },
    { status: 200 }
  );
}
