import { useMatches } from "@remix-run/react";
import type { WizardType } from "~/sessions/wizard-session.server";

export type WizardHandle<T extends WizardType> = {
  key: T;
};

export function useOutletHandle<T extends WizardHandle<WizardType>>(
  key: T["key"]
) {
  const handles = useMatches()
    .filter((match) => match.handle && match.handle.key === key)
    .map((match) => match.handle);

  if (handles.length === 0) {
    throw new Error(`This route should export a handle with key ${key}`);
  }

  return handles as T[];
}
