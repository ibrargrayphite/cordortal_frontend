import React from "react";

const YourMap = ({
  src,
  title = "Our Location",
  description = "",
}) => (
  <div className="max-w-5xl mx-auto my-12">
    {/* Map Card */}
    <div className="bg-white rounded-2xl shadow-lg flex flex-col p-8">
      <div className="text-2xl font-bold text-[#4a3f2a] mb-6">{title}</div>
      {description && (
        <div className="text-base text-gray-600 mb-4">{description}</div>
      )}
      <div className="flex-1 flex">
        <iframe
          src={src}
          title={title}
          aria-label={title}
          className="w-full h-[300px] min-h-[350px] rounded-xl border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </div>
);

export default YourMap;
