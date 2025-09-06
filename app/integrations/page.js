"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../components/admin/LoadingSpinner";
import IntegrationsPage from "../components/admin/IntegrationsPage";

const InnerIntegrationsPage = () => {
  return <IntegrationsPage />;
};

export default function IntegrationsPageWrapper() {
  return (
    <Suspense fallback={<PageSpinner message="Loading integrations..." />}>
      <InnerIntegrationsPage />
    </Suspense>
  );
}