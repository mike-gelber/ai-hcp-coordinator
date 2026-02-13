import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAssessment } from "@/lib/assessment";
import { IDEA_CATEGORIES } from "@/types/assessment";

const submissionSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .min(20, "Please provide a more detailed description (at least 20 characters)")
    .max(10000, "Description must be 10,000 characters or less"),
  category: z.enum(IDEA_CATEGORIES as unknown as [string, ...string[]]).optional(),
  existingSolutions: z
    .string()
    .max(5000, "Existing solutions must be 5,000 characters or less")
    .optional(),
  uniqueAspects: z.string().max(5000, "Unique aspects must be 5,000 characters or less").optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const assessment = runAssessment(parsed.data);

    return NextResponse.json(assessment, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
