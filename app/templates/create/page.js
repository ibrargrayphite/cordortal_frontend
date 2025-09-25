"use client";

import React, { Suspense } from "react";
import { FullPageSkeleton } from "../../components/admin/SkeletonComponents";
import TemplateCreatePage from "../../components/admin/TemplateCreatePage";

const TemplateDetailClient = () => {
    return <TemplateCreatePage />;
};

export default function TemplateCreatePageWrapper() {
    return (
        <Suspense fallback={<FullPageSkeleton showHeader={true} contentType="form" />}>
            <TemplateDetailClient />
        </Suspense>
    );
}
