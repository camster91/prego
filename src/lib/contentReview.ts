import type { WorkoutPlan, UserProfile } from "../types";
import { calculatePregnancyInfo } from "../stores/userStore";
export interface ContentApproval {
  status: "draft" | "approved" | "withdrawn";
  reviewer: string;
  reviewedAt: string;
  evidence: string[];
  version: number;
}
// Empty until qualified reviewers supply documented approvals. Never infer them.
export const exerciseApprovals: Record<string, ContentApproval> = {};
export const workoutApprovals: Record<string, ContentApproval> = {};
const approved = (record: ContentApproval | undefined) =>
  record?.status === "approved" &&
  record.reviewer.trim().length > 0 &&
  Number.isFinite(Date.parse(record.reviewedAt)) &&
  record.evidence.length > 0 &&
  record.version > 0;
export function workoutAvailability(
  workout: WorkoutPlan,
  profile: UserProfile | null,
): { available: boolean; reason: string } {
  if (
    !approved(workoutApprovals[workout.id]) ||
    workout.exercises.some(
      (exercise) => !approved(exerciseApprovals[exercise.exerciseId]),
    )
  ) {
    return {
      available: false,
      reason:
        "This session is awaiting professional review. Guided workouts are not available yet.",
    };
  }
  if (
    !profile ||
    calculatePregnancyInfo(profile.dueDate).status !== "pregnancy"
  ) {
    return {
      available: false,
      reason:
        "Update your pregnancy information before choosing a session. Prego never assumes a pregnancy outcome.",
    };
  }
  // Screening and contraindication contracts are not supplied yet; approval alone
  // cannot grant clearance or enable selection.
  return {
    available: false,
    reason:
      "The professionally reviewed screening and eligibility policy is not configured yet.",
  };
}
