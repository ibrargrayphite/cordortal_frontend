"use client";

import React from "react";
import { useLocation } from '../../context/LocationContext';

const YourMap = ({
  src: propSrc,
  title: propTitle,
  description: propDescription,
}) => {
  // Get data from location context
  const locationContext = useLocation();
  
  // Check if location has a map component configuration
  const locationMapComponent = locationContext?.map;
  
  // Priority: location map component src > location mapEmbedUrl > prop src
  const mapEmbedUrl = locationMapComponent?.src 
    || locationContext?.mapEmbedUrl 
    || propSrc 
    || '';
  // mapLink is optional - only show if provided
  const mapLink = locationMapComponent?.mapLink || locationContext?.mapLink || null;
  
  // Debug: Log map data (remove in production)
  React.useEffect(() => {
    console.log('YourMap - Location changed:', {
      locationId: locationContext?.selectedLocationId,
      locationName: locationContext?.locationShortName,
      mapComponent: locationMapComponent,
      mapEmbedUrl: locationContext?.mapEmbedUrl,
      finalMapEmbedUrl: mapEmbedUrl,
      propSrc
    });
  }, [locationContext?.selectedLocationId, mapEmbedUrl]);
  
  // Use location map component title, or location name, or prop title
  const title = locationMapComponent?.title 
    || propTitle 
    || (locationContext?.hasMultipleLocations 
      ? `${locationContext?.locationShortName} Location`
      : 'Our Location');
  const description = locationMapComponent?.description 
    || propDescription 
    || '';
  
  // Don't render if no map URL is available
  if (!mapEmbedUrl) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-2 md:mx-4 lg:mx-auto my-4 md:my-10 lg:my-12">
      {/* Map Card */}
      <div className="bg-white rounded-2xl flex flex-col p-8" style={{boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.175)'}}>
        <div className="text-2xl font-bold text-[#4a3f2a] mb-6">{title}</div>
        {description && (
          <div className="text-base text-gray-600 mb-4">{description}</div>
        )}
        <div className="flex-1 flex">
          <iframe
            key={mapEmbedUrl} // Force re-render when map URL changes
            src={mapEmbedUrl}
            title={title}
            aria-label={title}
            className="w-full h-[300px] min-h-[350px] rounded-xl border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        {mapLink && (
          <div className="mt-4">
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourMap;
