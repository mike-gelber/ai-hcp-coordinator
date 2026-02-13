import { POST } from "@/app/api/assess/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/assess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/assess", () => {
  it("returns 200 with a valid assessment for a complete submission", async () => {
    const req = makeRequest({
      title: "Self-Cleaning Solar Panels",
      description:
        "A novel nano-particle coating for solar panels that uses photocatalytic decomposition to break down organic matter, keeping panels clean without manual intervention.",
      category: "Green / Clean Tech",
      existingSolutions: "Current solutions include manual washing and water spray systems.",
      uniqueAspects:
        "The photocatalytic coating is the first to combine TiO2 nanoparticles with a hydrophilic polymer matrix.",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.id).toMatch(/^pat_/);
    expect(data.ideaTitle).toBe("Self-Cleaning Solar Panels");
    expect(["likely", "unclear", "unlikely"]).toContain(data.overallSignal);
    expect(data.criteria).toHaveLength(3);
    expect(data.nextSteps.length).toBeGreaterThan(0);
    expect(data.disclaimer).toBeTruthy();
  });

  it("returns 200 with only required fields", async () => {
    const req = makeRequest({
      title: "Basic Idea",
      description: "A new approach to solving a common problem using technology.",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.criteria).toHaveLength(3);
  });

  it("returns 400 when title is missing", async () => {
    const req = makeRequest({
      description: "A description without a title.",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details.title).toBeDefined();
  });

  it("returns 400 when description is too short", async () => {
    const req = makeRequest({
      title: "My Idea",
      description: "Too short",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Validation failed");
    expect(data.details.description).toBeDefined();
  });

  it("returns 400 when title is too short", async () => {
    const req = makeRequest({
      title: "AB",
      description: "A sufficiently long description for the idea.",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.details.title).toBeDefined();
  });

  it("returns 400 for an invalid category", async () => {
    const req = makeRequest({
      title: "Valid Title",
      description: "A sufficiently long description for the idea.",
      category: "Not A Real Category",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Validation failed");
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeTruthy();
  });
});
