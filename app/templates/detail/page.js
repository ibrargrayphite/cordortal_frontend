"use client";

import React, { Suspense } from "react";
import { FullPageSkeleton } from "../../components/admin/SkeletonComponents";
import TemplateDetailPage from "../../components/admin/TemplateDetailPage";

const TemplateDetailClient = () => {
  return <TemplateDetailPage />;
};

export default function TemplateDetailPageWrapper() {
  return (
    <Suspense fallback={<FullPageSkeleton showHeader={true} contentType="form" />}>
      <TemplateDetailClient />
    </Suspense>
  );
}

export const revalidate = 0;