"use client";
import { useState } from "react";
import FinancialSnapshotContainer from "./FinancialSnapshotContainer";
import RecentJournalContainer from "@/features/journal/containers/RecentJournalContainer";
import ListAssetsContainer from "../../assets/containers/ListAssetsContainer";
import CreateAssetsContainer from "@/features/assets/containers/CreateAssetsContainer";

export default function HomeContainer() {
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <FinancialSnapshotContainer />

        <ListAssetsContainer onAddAsset={() => setIsCreateAssetOpen(true)} />

        <RecentJournalContainer />
      </div>

      {isCreateAssetOpen && (
        <CreateAssetsContainer onClose={() => setIsCreateAssetOpen(false)} />
      )}
    </>
  );
}
