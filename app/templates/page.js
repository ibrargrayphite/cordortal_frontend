"use client";

import React, { Suspense } from "react";
import { FullPageSkeleton } from "../components/admin/SkeletonComponents";
import TemplatesListPage from "../components/admin/TemplatesListPage";

const TemplatesPageClient = () => {
  return <TemplatesListPage />;
};

export default function TemplatesPageWrapper() {
  return (
    <Suspense fallback={<FullPageSkeleton showHeader={true} showStats={true} contentType="table" />}>
      <TemplatesPageClient />
    </Suspense>
  );
}