"use client";
import { useState, type ReactNode } from "react";
import {
  Lightbulb,
  Lock,
  MessageSquareText,
  Tags,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/shared/components/animate-ui/components/animate/tabs";
import { useIsGuest } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockModal } from "@/shared/lib/hooks/useFeatureLockModal.hook";

export default function SettingsDesktopTabs({
  labels,
  lockMessage,
  isInitialGuest = true,
  account,
  categories,
  assets,
  feedback,
  contact,
}: Readonly<{
  labels: {
    account: string;
    categories: string;
    assets: string;
    feedback: string;
    contact: string;
  };
  lockMessage?: string;
  isInitialGuest?: boolean;
  account: ReactNode;
  categories: ReactNode;
  assets: ReactNode;
  feedback: ReactNode;
  contact: ReactNode;
}>) {
  const isGuest = useIsGuest();
  const openLockModal = useFeatureLockModal((state) => state.openModal);
  const effectiveIsGuest =
    typeof window === "undefined" ? isInitialGuest : isGuest;
  const [activeTab, setActiveTab] = useState<string>(
    effectiveIsGuest ? "categories" : "account",
  );

  const handleTabChange = (value: string) => {
    if (value === "account" && effectiveIsGuest) {
      if (lockMessage) openLockModal(lockMessage);
      return;
    }
    setActiveTab(value);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="mx-auto max-w-360 gap-6"
    >
      <div className="overflow-x-auto border-b border-border">
        <TabsList
          className="h-fit w-max min-w-0 justify-start gap-7 rounded-none bg-transparent p-0"
          highlightClassName="inset-x-0 top-auto bottom-0 h-0.5 rounded-none border-0 bg-primary shadow-none dark:border-0"
        >
          <TabsTrigger
            value="account"
            itemClassName="flex-none"
            className="rounded-none px-3 text-sm"
          >
            <UserRound aria-hidden="true" className="size-4" />
            {labels.account}
            {effectiveIsGuest && (
              <Lock
                aria-hidden="true"
                className="size-3.5 text-secondary-text ml-0.5 opacity-80"
              />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            itemClassName="flex-none"
            className="rounded-none px-3 text-sm"
          >
            <Tags aria-hidden="true" className="size-4" />
            {labels.categories}
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            itemClassName="flex-none"
            className="rounded-none px-3 text-sm"
          >
            <WalletCards aria-hidden="true" className="size-4" />
            {labels.assets}
          </TabsTrigger>
          <TabsTrigger
            value="feedback"
            itemClassName="flex-none"
            className="rounded-none px-3 text-sm"
          >
            <Lightbulb aria-hidden="true" className="size-4" />
            {labels.feedback}
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            itemClassName="flex-none"
            className="rounded-none px-3 text-sm"
          >
            <MessageSquareText aria-hidden="true" className="size-4" />
            {labels.contact}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContents>
        <TabsContent value="account">
          <div className="w-full min-w-0">{account}</div>
        </TabsContent>
        <TabsContent value="categories">
          <div className="w-full min-w-0">{categories}</div>
        </TabsContent>
        <TabsContent value="assets">
          <div className="w-full min-w-0">{assets}</div>
        </TabsContent>
        <TabsContent value="feedback">
          <div className="w-full min-w-0">{feedback}</div>
        </TabsContent>
        <TabsContent value="contact">
          <div className="w-full min-w-0">{contact}</div>
        </TabsContent>
      </TabsContents>
    </Tabs>
  );
}
