import { Capacitor } from "@capacitor/core";
import {
  Purchases,
  type PurchasesPackage,
  type CustomerInfo,
} from "@revenuecat/purchases-capacitor";
const entitlement = "pregnancy_pass";
let configured: Promise<void> | undefined;
export function billingConfigured() {
  if (import.meta.env.VITE_PURCHASES_ENABLED !== "true") return false;
  const platform = Capacitor.getPlatform();
  return platform === "ios"
    ? !!import.meta.env.VITE_REVENUECAT_IOS_KEY
    : platform === "android"
      ? !!import.meta.env.VITE_REVENUECAT_ANDROID_KEY
      : false;
}
async function initialize() {
  if (!billingConfigured())
    throw new Error("Store purchases are not available in this build.");
  const apiKey =
    Capacitor.getPlatform() === "ios"
      ? import.meta.env.VITE_REVENUECAT_IOS_KEY
      : import.meta.env.VITE_REVENUECAT_ANDROID_KEY;
  configured ??= Purchases.configure({ apiKey }).catch((error) => {
    configured = undefined;
    throw error;
  });
  await configured;
}
const hasPass = (customer: CustomerInfo) =>
  !!customer.entitlements.active[entitlement]?.isActive;
export async function loadPregnancyPass(): Promise<PurchasesPackage | null> {
  await initialize();
  const offerings = await Purchases.getOfferings();
  // Only the configured lifetime package can be sold. Never silently offer a subscription.
  return offerings.current?.lifetime ?? null;
}
export async function purchasePregnancyPass(aPackage: PurchasesPackage) {
  await initialize();
  const result = await Purchases.purchasePackage({ aPackage });
  if (!hasPass(result.customerInfo))
    throw new Error(
      "The store transaction completed but access has not been confirmed. Use Restore purchases or contact support.",
    );
  return true;
}
export async function restorePregnancyPass() {
  await initialize();
  return hasPass((await Purchases.restorePurchases()).customerInfo);
}
