"use client";

import React, { Suspense } from "react";
import { FullPageSkeleton } from "../components/admin/SkeletonComponents";
import IntegrationsPage from "../components/admin/IntegrationsPage";

const InnerIntegrationsPage = () => {
  return <IntegrationsPage />;
};

export default function IntegrationsPageWrapper() {
  return (
    <Suspense fallback={<FullPageSkeleton showHeader={true} contentType="cards" />}>
      <InnerIntegrationsPage />
    </Suspense>
  );
}