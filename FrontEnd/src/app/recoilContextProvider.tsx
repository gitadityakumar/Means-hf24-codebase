"use client";

import { RecoilRoot, atom } from "recoil";
export const modeState = atom<"public" | "private">({
  key: 'modeState', 
  default: 'public', 
});

// atom for button state that show on serviceCards
export const activeServiceState = atom<"gemini" | "graq" | null>({
  key: 'activeServiceState',
  default: null,  
});

export const apiKeyDataState = atom <{}> ({
  key: 'apikeyDataState',
  default: { }
})
export default function RecoidContextProvider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}