import { useSyncExternalStore } from "react";

const PRIVACY_MODE_KEY = "findmytang_privacy_mode";
const PRIVACY_MODE_EVENT = "findmytang-privacy-mode-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PRIVACY_MODE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PRIVACY_MODE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return localStorage.getItem(PRIVACY_MODE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

export function useFinancialSnapshotPrivacy() {
  const isPrivate = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const togglePrivacy = () => {
    localStorage.setItem(PRIVACY_MODE_KEY, String(!isPrivate));
    window.dispatchEvent(new Event(PRIVACY_MODE_EVENT));
  };

  return { isPrivate, togglePrivacy };
}
