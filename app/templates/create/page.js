"use client";

import React, { Suspense } from "react";
import { PageSpinner } from "../../components/admin/LoadingSpinner";
import TemplateCreatePage from "../../components/admin/TemplateCreatePage";

const TemplateDetailClient = () => {
    return <TemplateCreatePage />;
};

export default function TemplateCreatePageWrapper() {
    return (
        <Suspense fallback={<PageSpinner message="Loading template editor..." />}>
            <TemplateDetailClient />
        </Suspense>
    );
}
