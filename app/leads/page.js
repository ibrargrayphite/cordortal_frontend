"use client";

import React, { Suspense } from "react";
import { FullPageSkeleton } from "../components/admin/SkeletonComponents";
import LeadsPage from "../components/admin/LeadsPage";

const InnerLeadsPage = () => {
  return <LeadsPage />;
};

export default function LeadsPageWrapper() {
  return (
    <Suspense fallback={<FullPageSkeleton showHeader={true} showStats={true} contentType="table" />}>
      <InnerLeadsPage />
    </Suspense>
  );
}
