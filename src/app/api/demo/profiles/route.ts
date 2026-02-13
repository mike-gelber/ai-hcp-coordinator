import { NextRequest, NextResponse } from "next/server";
import { getDemoProfiles } from "@/lib/demo-seed";

/**
 * GET /api/demo/profiles — Get paginated demo HCP profiles.
 *
 * Query params:
 *   page (default 1)
 *   pageSize (default 20, max 100)
 *   specialty (filter)
 *   state (filter)
 *   search (name search)
 *   sort (field, default "lastName")
 *   order ("asc" | "desc", default "asc")
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));
  const specialty = searchParams.get("specialty");
  const state = searchParams.get("state");
  const search = searchParams.get("search")?.toLowerCase();
  const sort = searchParams.get("sort") || "lastName";
  const order = searchParams.get("order") === "desc" ? -1 : 1;

  let profiles = getDemoProfiles();

  // Apply filters
  if (specialty) {
    profiles = profiles.filter((p) => p.primarySpecialty === specialty);
  }

  if (state) {
    profiles = profiles.filter((p) => p.location.state === state);
  }

  if (search) {
    profiles = profiles.filter(
      (p) =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search) ||
        p.npi.includes(search),
    );
  }

  // Sort
  profiles = [...profiles].sort((a, b) => {
    const aVal = String((a as unknown as Record<string, unknown>)[sort] || "");
    const bVal = String((b as unknown as Record<string, unknown>)[sort] || "");
    return aVal.localeCompare(bVal) * order;
  });

  // Paginate
  const total = profiles.length;
  const totalPages = Math.ceil(total / pageSize);
  const data = profiles.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages,
  });
}
