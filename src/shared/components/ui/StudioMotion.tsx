import { useEffect, useState } from "react";
export function StudioMotion() {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setPlaying(!preference.matches && document.visibilityState === "visible");
    update();
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div className="relative overflow-hidden rounded-2xl bg-sage-100">
      {playing ? (
        <video
          className="aspect-video w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/media/studio-poster.webp"
          aria-hidden="true"
        >
          <source src="/media/studio-loop.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/media/studio-poster.webp"
          alt=""
          className="aspect-video w-full object-cover"
          loading="lazy"
        />
      )}
      <button
        type="button"
        className="absolute bottom-3 right-3 min-h-12 rounded-full bg-white px-4 text-sm text-primary-900"
        onClick={() => setPlaying((value) => !value)}
        aria-pressed={playing}
      >
        {playing ? "Pause animation" : "Play animation"}
      </button>
    </div>
  );
}
