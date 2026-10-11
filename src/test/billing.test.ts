import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  platform: "web",
  configure: vi.fn(),
  offerings: vi.fn(),
  purchase: vi.fn(),
  restore: vi.fn(),
}));
vi.mock("@capacitor/core", () => ({
  Capacitor: { getPlatform: () => mocks.platform },
}));
vi.mock("@revenuecat/purchases-capacitor", () => ({
  Purchases: {
    configure: mocks.configure,
    getOfferings: mocks.offerings,
    purchasePackage: mocks.purchase,
    restorePurchases: mocks.restore,
  },
}));
describe("native store boundary", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    mocks.platform = "web";
    mocks.configure.mockResolvedValue(undefined);
  });
  it("cannot initiate web checkout or a purchase in an unconfigured build", async () => {
    const billing = await import("../lib/billing");
    expect(billing.billingConfigured()).toBe(false);
    await expect(billing.restorePregnancyPass()).rejects.toThrow(
      "not available",
    );
    expect(mocks.configure).not.toHaveBeenCalled();
  });
  it("offers only the configured lifetime package, never a recurring fallback", async () => {
    mocks.platform = "ios";
    vi.stubEnv("VITE_PURCHASES_ENABLED", "true");
    vi.stubEnv("VITE_REVENUECAT_IOS_KEY", "public-test-fixture");
    mocks.offerings.mockResolvedValue({
      current: { lifetime: null, monthly: { identifier: "monthly" } },
    });
    const billing = await import("../lib/billing");
    expect(await billing.loadPregnancyPass()).toBeNull();
    expect(mocks.configure).toHaveBeenCalledWith({
      apiKey: "public-test-fixture",
    });
  });
  it("does not grant pass access when a store transaction lacks the entitlement", async () => {
    mocks.platform = "android";
    vi.stubEnv("VITE_PURCHASES_ENABLED", "true");
    vi.stubEnv("VITE_REVENUECAT_ANDROID_KEY", "public-test-fixture");
    mocks.offerings.mockResolvedValue({
      current: { lifetime: { identifier: "lifetime-fixture" } },
    });
    mocks.purchase.mockResolvedValue({
      customerInfo: { entitlements: { active: {} } },
    });
    const billing = await import("../lib/billing");
    const offer = await billing.loadPregnancyPass();
    if (!offer) throw new Error("Fixture missing");
    await expect(billing.purchasePregnancyPass(offer)).rejects.toThrow(
      "access has not been confirmed",
    );
  });
  it("restores access only from the active named entitlement", async () => {
    mocks.platform = "ios";
    vi.stubEnv("VITE_PURCHASES_ENABLED", "true");
    vi.stubEnv("VITE_REVENUECAT_IOS_KEY", "public-test-fixture");
    mocks.restore
      .mockResolvedValueOnce({ customerInfo: { entitlements: { active: {} } } })
      .mockResolvedValueOnce({
        customerInfo: {
          entitlements: { active: { pregnancy_pass: { isActive: true } } },
        },
      });
    const billing = await import("../lib/billing");
    expect(await billing.restorePregnancyPass()).toBe(false);
    expect(await billing.restorePregnancyPass()).toBe(true);
  });
});
