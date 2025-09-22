"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FullPageSkeleton } from "../../components/admin/SkeletonComponents";
import AdminConsentFormPage from "../../components/admin/AdminConsentFormPage";

const AdminConsentFormClient = () => {
  const searchParams = useSearchParams();
  const isNewForm = searchParams.get('new') === 'true';
  const templateParam = searchParams.get('template');
  
  let templateData = null;
  if (templateParam) {
    try {
      templateData = JSON.parse(decodeURIComponent(templateParam));
    } catch (e) {
      console.error('Error parsing template data:', e);
    }
  }
  
  return <AdminConsentFormPage isNewForm={isNewForm} templateData={templateData} />;
};

export default function AdminConsentFormPageWrapper() {
  return (
    <Suspense fallback={<FullPageSkeleton showHeader={true} contentType="form" />}>
      <AdminConsentFormClient />
    </Suspense>
  );
}