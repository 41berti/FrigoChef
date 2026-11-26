import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";

// Pa lexuar ende preferencën, shfaqim gjendjen pa animacion.
export function useLevizjeReduktuar(): boolean {
  const [reduktuar, setReduktuar] = useState(true);
  useEffect(() => {
    if (Platform.OS === "web") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const ndrysho = () => setReduktuar(media.matches);
      ndrysho();
      media.addEventListener("change", ndrysho);
      return () => media.removeEventListener("change", ndrysho);
    }
    let prit = true;
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => {
      prit = false;
      setReduktuar(v);
    });
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        if (prit) setReduktuar(v);
      })
      .catch(() => {});
    return () => {
      prit = false;
      sub.remove();
    };
  }, []);
  return reduktuar;
}
