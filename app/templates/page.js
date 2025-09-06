"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../components/admin/LoadingSpinner";
import TemplatesListPage from "../components/admin/TemplatesListPage";

const TemplatesPageClient = () => {
  return <TemplatesListPage />;
};

export default function TemplatesPageWrapper() {
  return (
    <Suspense fallback={<PageSpinner message="Loading templates..." />}>
      <TemplatesPageClient />
    </Suspense>
  );
}