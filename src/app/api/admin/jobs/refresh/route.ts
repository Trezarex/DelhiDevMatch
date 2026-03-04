import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/verify";
import { refreshFromAdzuna } from "@/lib/adzuna/refresh";

export async function POST(request: Request) {
  const authError = verifyAdmin(request);
  if (authError) return authError;

  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    return NextResponse.json(
      { error: "ADZUNA_APP_ID and ADZUNA_APP_KEY must be configured" },
      { status: 400 }
    );
  }

  const result = await refreshFromAdzuna();

  if (result.error) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
