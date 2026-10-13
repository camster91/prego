import { useEffect, useState } from "react";
import { useUserStore } from "../stores";
import { calculatePregnancyInfo } from "../stores/userStore";
export function usePregnancyStage() {
  const dueDate = useUserStore((state) => state.profile?.dueDate);
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setToday(new Date());
    const timer = window.setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return calculatePregnancyInfo(dueDate ?? new Date(NaN), today);
}
