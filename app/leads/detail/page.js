"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../../components/admin/LoadingSpinner";
import LeadDetailPage from "../../components/admin/LeadDetailPage";

const LeadDetailClient = () => {
  return <LeadDetailPage />;
};

export default function LeadDetailPageWrapper() {
  return (
    <Suspense fallback={<PageSpinner message="Loading lead details..." />}>
      <LeadDetailClient />
    </Suspense>
  );
}

export const revalidate = 0;