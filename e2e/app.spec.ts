import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function onboard(page: Page) {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByRole("textbox", { name: "Your name" }).fill("Alex");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const due = new Date();
  due.setDate(due.getDate() + 140);
  await page
    .getByLabel("Due date", { exact: true })
    .fill(
      `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}-${String(due.getDate()).padStart(2, "0")}`,
    );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Explore Prego" }).click();
  await expect(page.getByText("Hello, Alex.")).toBeVisible();
}
test("five destinations, responsive layout and accessible primary screens", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A little movement.",
  );
  await page.screenshot({
    path: `test-results/today-${info.project.name}.png`,
    fullPage: true,
  });
  for (const [name, heading] of [
    ["Today", "A little movement."],
    ["Move", "Find your kind"],
    ["Learn", "A little knowledge"],
    ["Progress", "Progress"],
    ["You", ""],
  ] as const) {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name, exact: true })
      .click();
    if (heading)
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        heading,
      );
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((value) => ({
        id: value.id,
        nodes: value.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test("profile persists and reset removes both profile and history", async ({
  page,
}) => {
  await onboard(page);
  await page.reload();
  await expect(page.getByText("Hello, Alex.")).toBeVisible();
  await page.getByRole("link", { name: "You", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Alex", exact: true }),
  ).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    accessibility.violations.map((value) => ({
      id: value.id,
      nodes: value.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "Delete data" }).click();
  await page.getByRole("button", { name: "Reset Everything" }).click();
  await expect(page).toHaveURL(/onboarding/);
  const saved = await page.evaluate(() =>
    Object.keys(localStorage).filter((key) => key.startsWith("prego-")),
  );
  expect(saved).toEqual([]);
});
test("unreviewed sessions and forged purchase URLs cannot grant access", async ({
  page,
}) => {
  await page.goto("/workout/quick-stretch/active");
  await expect(
    page.getByRole("heading", { name: "This session is not available yet" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start workout", exact: true }),
  ).toHaveCount(0);
  await page.goto("/success?session_id=forged");
  await expect(
    page.getByText("A checkout link does not confirm access.", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Your subscription is active.", { exact: false }),
  ).toHaveCount(0);
});
test("offline launch opens every bundled destination", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) throw new Error("No active worker");
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBeTruthy();
  await context.setOffline(true);
  await page.goto("/learn");
  await expect(
    page.getByRole("heading", { name: "A little knowledge. More confidence." }),
  ).toBeVisible();
  await page.goto("/workouts");
  await expect(
    page.getByRole("heading", { name: "Find your kind of movement." }),
  ).toBeVisible();
});
test("dark mode remains readable without horizontal overflow", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((value) => ({
      id: value.id,
      nodes: value.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBeTruthy();
});
