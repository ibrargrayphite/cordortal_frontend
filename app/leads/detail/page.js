"use client";

import React, { Suspense } from "react";
import { FullPageSkeleton } from "../../components/admin/SkeletonComponents";
import LeadDetailPage from "../../components/admin/LeadDetailPage";

const LeadDetailClient = () => {
  return <LeadDetailPage />;
};

export default function LeadDetailPageWrapper() {
  return (
    <Suspense fallback={<FullPageSkeleton showHeader={true} contentType="default" />}>
      <LeadDetailClient />
    </Suspense>
  );
}

export const revalidate = 0;