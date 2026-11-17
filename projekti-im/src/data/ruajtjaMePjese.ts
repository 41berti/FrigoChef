// SecureStore ka kufij të vegjël në disa pajisje. Manifesti ndërrohet vetëm
// pasi të jenë ruajtur të gjitha pjesët, që një shkrim i dështuar të mos prishë sesionin.
type Ruajtja = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

type Manifesti = { versioni: string; pjese: number };

export function krijoRuajtjenMePjese(ruajtja: Ruajtja): Ruajtja {
  async function manifesti(key: string): Promise<Manifesti | null> {
    const value = await ruajtja.getItem(key);
    if (value === null) return null;
    const data: Manifesti = JSON.parse(value);
    if (
      !/^[a-z0-9-]+$/.test(data.versioni) ||
      !Number.isInteger(data.pjese) ||
      data.pjese < 1 ||
      data.pjese > 1000
    ) {
      throw new Error("Sesioni i ruajtur nuk mund të lexohet.");
    }
    return data;
  }

  async function pastro(key: string, data: Manifesti | null) {
    if (!data) return;
    await Promise.all(
      Array.from({ length: data.pjese }, (_, i) =>
        ruajtja.removeItem(`${key}.${data.versioni}.${i}`),
      ),
    );
  }

  return {
    async getItem(key) {
      const data = await manifesti(key);
      if (!data) return null;
      const pjeset = await Promise.all(
        Array.from({ length: data.pjese }, (_, i) =>
          ruajtja.getItem(`${key}.${data.versioni}.${i}`),
        ),
      );
      if (pjeset.some((pjese) => pjese === null)) {
        throw new Error("Sesioni i ruajtur është i paplotë.");
      }
      return pjeset.join("");
    },
    async setItem(key, value) {
      const vjeter = await manifesti(key);
      // 500 njësi UTF-16 zënë më së shumti 1500 byte UTF-8, nën kufirin 2048.
      const data = {
        versioni: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
        pjese: Math.max(1, Math.ceil(value.length / 500)),
      };
      if (data.pjese > 1000) throw new Error("Sesioni është tepër i madh për ruajtje.");
      try {
        for (let i = 0; i < data.pjese; i++) {
          await ruajtja.setItem(
            `${key}.${data.versioni}.${i}`,
            value.slice(i * 500, (i + 1) * 500),
          );
        }
        await ruajtja.setItem(key, JSON.stringify(data));
      } catch (error) {
        await pastro(key, data).catch(() => {});
        throw error;
      }
      // Pas ndërrimit të manifestit, dështimi i pastrimit nuk e prish sesionin e ri.
      await pastro(key, vjeter).catch(() => {});
    },
    async removeItem(key) {
      const data = await manifesti(key);
      await ruajtja.removeItem(key);
      await pastro(key, data).catch(() => {});
    },
  };
}
