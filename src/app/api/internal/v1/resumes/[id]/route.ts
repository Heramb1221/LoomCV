import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const secret = () => new TextEncoder().encode(process.env.ATS_HANDOFF_SECRET!);

interface WorkExperienceInput {
  position?: string | null;
  company?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  description?: string | null;
}

interface EducationInput {
  degree?: string | null;
  school?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

interface ResumeInput {
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  summary?: string | null;
  skills: string[];
  workExperiences: WorkExperienceInput[];
  educations: EducationInput[];
}

function resumeToPlainText(resume: ResumeInput): string {
  const parts: string[] = [];

  const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(" ");
  if (fullName) parts.push(`Name: ${fullName}`);
  if (resume.jobTitle) parts.push(`Target Job Title: ${resume.jobTitle}`);
  if (resume.email) parts.push(`Email: ${resume.email}`);
  if (resume.phone) parts.push(`Phone: ${resume.phone}`);
  const location = [resume.city, resume.country].filter(Boolean).join(", ");
  if (location) parts.push(`Location: ${location}`);

  if (resume.summary) {
    parts.push("\nProfessional Summary:");
    parts.push(resume.summary);
  }

  if (resume.skills && resume.skills.length > 0) {
    parts.push("\nSkills:");
    parts.push(resume.skills.filter(Boolean).join(", "));
  }

  if (resume.workExperiences && resume.workExperiences.length > 0) {
    parts.push("\nWork Experience:");
    resume.workExperiences.forEach((exp) => {
      const companyInfo = [exp.position, exp.company].filter(Boolean).join(" at ");
      const dateParts = [];
      if (exp.startDate) {
        dateParts.push(new Date(exp.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }));
      }
      if (exp.endDate) {
        dateParts.push(new Date(exp.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }));
      } else if (exp.startDate) {
        dateParts.push("Present");
      }
      const dateStr = dateParts.length > 0 ? ` (${dateParts.join(" - ")})` : "";
      
      parts.push(`- ${companyInfo}${dateStr}`);
      if (exp.description) {
        parts.push(exp.description);
      }
    });
  }

  if (resume.educations && resume.educations.length > 0) {
    parts.push("\nEducation:");
    resume.educations.forEach((edu) => {
      const degreeInfo = [edu.degree, edu.school].filter(Boolean).join(" at ");
      const dateParts = [];
      if (edu.startDate) {
        dateParts.push(new Date(edu.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }));
      }
      if (edu.endDate) {
        dateParts.push(new Date(edu.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" }));
      } else if (edu.startDate) {
        dateParts.push("Present");
      }
      const dateStr = dateParts.length > 0 ? ` (${dateParts.join(" - ")})` : "";
      parts.push(`- ${degreeInfo}${dateStr}`);
    });
  }

  return parts.join("\n");
}

/**
 * Versioned (v1) so the ATS Scorer and LoomCV can be deployed independently
 * without breaking each other — see the "Two-codebase versioning
 * discipline" NFR.
 *
 * Authenticated by the SAME handoff token minted in ../ats-handoff/route.ts,
 * passed as a Bearer header. This route intentionally does not accept a
 * regular LoomCV session cookie — only the scoped, short-lived token.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 401 });
  }

  let payload;
  try {
    ({ payload } = await jwtVerify(token, secret()));
  } catch {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
  }

  if (payload.resumeId !== id) {
    return NextResponse.json({ error: "Token does not match requested resume." }, { status: 403 });
  }

  const resume = await prisma.resume.findFirst({
    where: { id, userId: payload.userId as string },
    include: {
      workExperiences: true,
      educations: true,
    },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  return NextResponse.json({
    title: resume.title || "Untitled Resume",
    text: resumeToPlainText(resume as any),
  });
}
