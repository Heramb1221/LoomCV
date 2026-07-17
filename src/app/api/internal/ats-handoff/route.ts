import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";

const secret = () => new TextEncoder().encode(process.env.ATS_HANDOFF_SECRET!);

/**
 * Mints a short-lived (5 min), single-purpose token scoped to one resumeId.
 * This is deliberately NOT a general-purpose session token — see the
 * "Cross-site security" NFR in the ATS Scorer blueprint for why.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { resumeId } = await req.json();
  if (!resumeId) {
    return NextResponse.json({ error: "Missing resumeId." }, { status: 400 });
  }

  // IMPORTANT: verify the resume actually belongs to this user before
  // minting a token for it — do not skip this check.
  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  const subscriptionTier = await getUserSubscriptionLevel(userId); // "free" | "pro" | "pro_plus"

  const token = await new SignJWT({ resumeId, userId, subscriptionTier })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret());

  return NextResponse.json({ token });
}
