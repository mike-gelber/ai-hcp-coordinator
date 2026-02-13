import { searchHcps, getHcpStats } from "@/lib/db-utils";

// ─── Mock Prisma ────────────────────────────────────────────────────

const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockGroupBy = jest.fn();

jest.mock("@/lib/db", () => ({
  prisma: {
    hcpProfile: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
      groupBy: (...args: unknown[]) => mockGroupBy(...args),
    },
  },
}));

// ─── Tests ──────────────────────────────────────────────────────────

describe("searchHcps", () => {
  beforeEach(() => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);
  });

  it("uses default pagination when no filters provided", async () => {
    await searchHcps();

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
        orderBy: { lastName: "asc" },
        skip: 0,
        take: 20,
      })
    );

    expect(mockCount).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it("applies specialty filter", async () => {
    await searchHcps({ specialty: "Cardiology" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          primarySpecialty: "Cardiology",
        }),
      })
    );
  });

  it("applies state filter via locations relation", async () => {
    await searchHcps({ state: "CA" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          locations: { some: { state: "CA" } },
        }),
      })
    );
  });

  it("applies enrichmentStatus filter", async () => {
    await searchHcps({ enrichmentStatus: "complete" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          enrichmentStatus: "complete",
        }),
      })
    );
  });

  it("applies npiStatus filter", async () => {
    await searchHcps({ npiStatus: "validated" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          npiStatus: "validated",
        }),
      })
    );
  });

  it("applies isDemo filter", async () => {
    await searchHcps({ isDemo: true });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isDemo: true,
        }),
      })
    );
  });

  it("handles isDemo=false correctly", async () => {
    await searchHcps({ isDemo: false });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isDemo: false,
        }),
      })
    );
  });

  it("applies custom pagination", async () => {
    mockCount.mockResolvedValue(50);

    await searchHcps({ page: 3, pageSize: 10 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 10,
      })
    );
  });

  it("applies custom sort", async () => {
    await searchHcps({ sortBy: "createdAt", sortOrder: "desc" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
      })
    );
  });

  it("returns correct paginated result shape", async () => {
    const mockData = [{ id: "1", npi: "1234567893" }];
    mockFindMany.mockResolvedValue(mockData);
    mockCount.mockResolvedValue(25);

    const result = await searchHcps({ page: 2, pageSize: 10 });

    expect(result).toEqual({
      data: mockData,
      total: 25,
      page: 2,
      pageSize: 10,
      totalPages: 3,
    });
  });

  it("combines multiple filters", async () => {
    await searchHcps({
      specialty: "Oncology",
      state: "NY",
      enrichmentStatus: "pending",
      isDemo: false,
    });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          primarySpecialty: "Oncology",
          enrichmentStatus: "pending",
          isDemo: false,
          locations: { some: { state: "NY" } },
        }),
      })
    );
  });
});

describe("getHcpStats", () => {
  it("returns correct stats structure", async () => {
    mockCount
      .mockResolvedValueOnce(100) // total
      .mockResolvedValueOnce(5); // demoCount

    mockGroupBy
      .mockResolvedValueOnce([
        { enrichmentStatus: "pending", _count: { _all: 60 } },
        { enrichmentStatus: "complete", _count: { _all: 40 } },
      ])
      .mockResolvedValueOnce([
        { npiStatus: "validated", _count: { _all: 80 } },
        { npiStatus: "pending", _count: { _all: 20 } },
      ])
      .mockResolvedValueOnce([
        { primarySpecialty: "Cardiology", _count: { _all: 30 } },
        { primarySpecialty: "Oncology", _count: { _all: 25 } },
        { primarySpecialty: null, _count: { _all: 45 } },
      ]);

    const stats = await getHcpStats();

    expect(stats).toEqual({
      total: 100,
      byEnrichmentStatus: {
        pending: 60,
        complete: 40,
      },
      byNpiStatus: {
        validated: 80,
        pending: 20,
      },
      bySpecialty: {
        Cardiology: 30,
        Oncology: 25,
        unknown: 45,
      },
      demoCount: 5,
    });
  });

  it("handles empty database", async () => {
    mockCount
      .mockResolvedValueOnce(0) // total
      .mockResolvedValueOnce(0); // demoCount

    mockGroupBy
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const stats = await getHcpStats();

    expect(stats).toEqual({
      total: 0,
      byEnrichmentStatus: {},
      byNpiStatus: {},
      bySpecialty: {},
      demoCount: 0,
    });
  });
});
