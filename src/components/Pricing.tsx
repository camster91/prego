import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Leaf } from "lucide-react";
import type { PurchasesPackage } from "@revenuecat/purchases-capacitor";
import {
  billingConfigured,
  loadPregnancyPass,
  purchasePregnancyPass,
  restorePregnancyPass,
} from "../lib/billing";
import { Button } from "../shared/components/ui/Button";
export default function Pricing() {
  const [offer, setOffer] = useState<PurchasesPackage | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [owned, setOwned] = useState(false);
  useEffect(() => {
    let active = true;
    if (billingConfigured())
      void loadPregnancyPass()
        .then((value) => {
          if (active) setOffer(value);
        })
        .catch(() => {
          if (active)
            setMessage("The store could not load. Try again when connected.");
        });
    return () => {
      active = false;
    };
  }, []);
  const restore = async () => {
    setBusy(true);
    try {
      const pass = await restorePregnancyPass();
      setOwned(pass);
      setMessage(
        pass
          ? "Your Pregnancy Pass has been restored."
          : "No Pregnancy Pass was found for this store account.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Restoration could not complete. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-5 pb-nav pt-8">
      <Leaf className="mb-4 h-8 w-8 text-primary-700" aria-hidden="true" />
      <h1 className="text-3xl font-semibold text-primary-900">
        Good movement. Clear value.
      </h1>
      <p className="my-4 text-gray-600">
        An approachable free core, with a one-time Pregnancy Pass planned for
        the full reviewed library.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <section className="rounded-2xl border border-sage-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-primary-900">Prego Free</h2>
          <p className="my-3 text-3xl text-primary-900">$0</p>
          <ul className="space-y-3 text-gray-600">
            {[
              "Safety information",
              "Your preferences and data controls",
              "Basic progress",
              "Starter sessions after content approval",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/"
            className="mt-5 inline-flex min-h-12 items-center text-primary-800 underline"
          >
            Continue with Prego
          </Link>
        </section>
        <section className="rounded-2xl bg-sage-100 p-6">
          <h2 className="text-xl font-semibold text-primary-900">
            Pregnancy Pass
          </h2>
          <p className="my-3 text-2xl text-primary-900">
            {offer?.product.priceString ?? "Coming after review"}
          </p>
          <p className="text-gray-600">
            One-time purchase. No recurring subscription. The full library and
            training plans will be available after professional review.
          </p>
          <Button
            className="mt-6"
            fullWidth
            disabled={!offer || busy || owned}
            onClick={async () => {
              if (!offer) return;
              setBusy(true);
              try {
                await purchasePregnancyPass(offer);
                setOwned(true);
                setMessage(
                  "Your Pregnancy Pass is confirmed. Content availability still depends on professional review.",
                );
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : "Purchase did not complete.",
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {owned
              ? "Pass confirmed"
              : offer
                ? "Buy Pregnancy Pass"
                : "Not available yet"}
          </Button>
          <Button
            variant="ghost"
            fullWidth
            disabled={!billingConfigured() || busy}
            onClick={restore}
            className="mt-2"
          >
            Restore purchases
          </Button>
          <p className="mt-3 text-xs text-gray-600">
            Purchases use your device’s app store. Availability and price come
            from the store.
          </p>
        </section>
      </div>
      <p role="status" className="mt-5 text-gray-700">
        {message}
      </p>
    </main>
  );
}
