"use client";
import TopAppBarMobile from "@/shared/components/custom/TopAppBarMobile";
import { cn } from "@/shared/utils";
import { Check, Pencil, UserRound } from "lucide-react";
import { useState } from "react";

export default function AccountContainer() {
  const [isEditDisplayName, setIsEditDisplayName] = useState(false);

  return (
    <>
      <TopAppBarMobile href="/home" title="Account" />

      <div className="flex flex-col items-center justify-center gap-1 my-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">
            <UserRound size={28} />
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center">
            <span className="text-sm font-normal">displayname</span>
            <span className="text-sm font-normal">email</span>
          </div>
          <span className="text-xs font-normal text-on-surface-variant">
            Data synced
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <input
              type="text"
              defaultValue="displayname"
              readOnly={!isEditDisplayName}
              placeholder="Display name"
              className={cn(
                "w-full text-sm focus-visible:outline-none placeholder:text-black",
                isEditDisplayName ? "border-b border-gray-300" : "",
              )}
            />
          </div>
          <button onClick={() => setIsEditDisplayName((prev) => !prev)}>
            {isEditDisplayName ? (
              <Check size={18} color="blue" />
            ) : (
              <Pencil size={18} color="gray" />
            )}
          </button>
        </div>
        {/* <div>email</div>
        <div>change password</div> */}
      </div>
    </>
  );
}
