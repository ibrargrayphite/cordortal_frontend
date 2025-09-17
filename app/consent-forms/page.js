"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../components/admin/LoadingSpinner";
import ConsentFormPage from "../components/admin/ConsentFormPage";

const InnerConsentFormsPage = () => {
  return <ConsentFormPage />;
};

export default function ConsentFormsPageWrapper() {
  return (
    <Suspense fallback={<PageSpinner message="Loading consent forms..." />}>
      <InnerConsentFormsPage />
    </Suspense>
  );
}