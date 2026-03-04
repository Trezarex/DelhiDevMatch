import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

export function verifyAdmin(request: Request): NextResponse | null {
  const auth = request.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);
  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // Auth passed
}
