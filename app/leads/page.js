"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../components/admin/LoadingSpinner";
import LeadsPage from "../components/admin/LeadsPage";

const InnerLeadsPage = () => {
  return <LeadsPage />;
};
export default function LeadsPageWrapper() {
  return (
    <Suspense fallback={<PageSpinner message="Loading leads..." />}>
      <InnerLeadsPage />
    </Suspense>
  );
}
