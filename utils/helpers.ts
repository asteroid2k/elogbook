import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export async function genPassword(plain: string) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(plain, salt);
  return { hash, salt };
}

export function saveLocalUser(data: Record<string, any> = {}) {
  localStorage.setItem("elogbook_user", JSON.stringify(data));
}
export function getLocalUser() {
  const raw = localStorage.getItem("elogbook_user");
  if (!raw) return null;
  return JSON.parse(raw) || null;
}
export function clearLocal() {
  localStorage.clear();
}

export function extractUser(token: string) {
  if (token?.length < 1) return null;
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY || "private_key"
    ) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}
