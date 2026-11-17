// SecureStore është vetëm për native. Në web përdorim ruajtjen e origjinës;
// gjatë eksportimit statik nuk prekim window. Mos vendos token-a në URL apo log-e.
export const ruajtjaESesionit = {
  async getItem(key: string) {
    return typeof window === "undefined"
      ? null
      : window.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};
