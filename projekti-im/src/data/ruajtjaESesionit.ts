import * as SecureStore from "expo-secure-store";

import { krijoRuajtjenMePjese } from "@/data/ruajtjaMePjese";

export const ruajtjaESesionit = krijoRuajtjenMePjese({
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
});
