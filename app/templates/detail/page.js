"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../../components/admin/LoadingSpinner";
import TemplateDetailPage from "../../components/admin/TemplateDetailPage";

const TemplateDetailClient = () => {
  return <TemplateDetailPage />;
};

export default function TemplateDetailPageWrapper() {
  return (
    <Suspense fallback={<PageSpinner message="Loading template..." />}>
      <TemplateDetailClient />
    </Suspense>
  );
}

export const revalidate = 0;