import React from "react";

const YourMap = ({
  src,
  title = "Our Location",
  description = "",
}) => (
  <div className="max-w-5xl mx-2 md:mx-4 lg:mx-auto my-4 md:my-10 lg:my-12">
    {/* Map Card */}
    <div className="bg-white rounded-2xl flex flex-col p-8" style={{boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.175)'}}>
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
