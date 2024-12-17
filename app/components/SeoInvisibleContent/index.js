import React from "react";

const SeoInvisibleContent = ({ htmlContent }) => {
  return (
    <div style={{ display: "none" }}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default SeoInvisibleContent;
