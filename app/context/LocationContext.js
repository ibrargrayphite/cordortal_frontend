"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext();

const LOCATION_COOKIE_NAME = 'selected_location';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

/**
 * Get cookie value by name
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Set cookie
 */
function setCookie(name, value, maxAge) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

/**
 * Resolve location data with fallbacks to organization defaults
 */
function resolveLocationData(location, orgData, sharedData) {
  if (!location) {
    // No location selected - return org defaults
    return {
      id: null,
      slug: null,
      name: orgData?.address || 'Main Location',
      shortName: 'Main',
      contact: {
        phone: orgData?.phone || '',
        email: orgData?.email || '',
        address: orgData?.address || '',
        media: orgData?.media || '',
        emailMedia: orgData?.emailMedia || '',
        phoneMedia: orgData?.phoneMedia || '',
        addressMedia: orgData?.addressMedia || '',
        bookingUrl: sharedData?.header?.src || '',
        mapEmbedUrl: orgData?.mapEmbedUrl || orgData?.contact?.mapEmbedUrl || null,
        mapLink: orgData?.mapLink || orgData?.contact?.mapLink || null,
      },
      hours: {
        hoursData: sharedData?.footer?.data?.hoursData || [],
        lunchTime: sharedData?.footer?.data?.lunchTime || '',
        specialHours: [],
      },
      team: [],
      seo: null,
      geo: null,
      map: orgData?.map || null, // Organization-level map component
    };
  }

  // Get org-level defaults
  const orgContact = {
    phone: orgData?.phone,
    email: orgData?.email,
    address: orgData?.address,
    media: orgData?.media,
    emailMedia: orgData?.emailMedia,
    phoneMedia: orgData?.phoneMedia,
    addressMedia: orgData?.addressMedia,
  };
  const orgHours = sharedData?.footer?.data?.hoursData || [];
  const orgLunchTime = sharedData?.footer?.data?.lunchTime || '';

  return {
    id: location.id || null,
    slug: location.slug || null,
    name: location.displayName || location.name,
    shortName: location.shortName || location.displayName || location.name,

    contact: {
      phone: location.contact?.phone || orgContact.phone,
      email: location.contact?.email || orgContact.email,
      address: location.contact?.address || location.name || orgContact.address,
      media: orgContact.media,
      emailMedia: orgContact.emailMedia,
      phoneMedia: orgContact.phoneMedia,
      addressMedia: orgContact.addressMedia,
      bookingUrl: location.contact?.bookingUrl || location.link || sharedData?.header?.src,
      mapEmbedUrl: location.contact?.mapEmbedUrl || orgData?.mapEmbedUrl || orgData?.contact?.mapEmbedUrl || null,
      mapLink: location.contact?.mapLink || orgData?.mapLink || orgData?.contact?.mapLink || null,
    },

    hours: {
      hoursData: location.hours?.hoursData || orgHours,
      lunchTime: location.hours?.lunchTime || orgLunchTime,
      specialHours: location.hours?.specialHours || [],
    },

    team: location.team || [],
    seo: location.seo || null,
    geo: location.geo || null,
    map: location.map || orgData?.map || null, // Location map component with org fallback
  };
}

/**
 * Get default location from locations array
 */
function getDefaultLocation(locations) {
  if (!locations?.length) return null;
  // Find location marked as default
  const defaultLoc = locations.find(loc => loc.isDefault && !loc.disable);
  if (defaultLoc) return defaultLoc;
  // Find first non-disabled location
  const firstActive = locations.find(loc => !loc.disable);
  if (firstActive) return firstActive;
  // Return first location
  return locations[0];
}

/**
 * Find location by slug or id
 */
function findLocation(locations, identifier) {
  if (!locations?.length || !identifier) return null;
  return locations.find(
    loc => loc.slug === identifier || loc.id === identifier
  );
}

export function LocationProvider({ children, pagesData }) {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const locations = pagesData?.data?.locations || [];
  const orgData = pagesData?.data || {};
  const sharedData = pagesData?.shared || {};

  // Find the selected location object
  const selectedLocation = selectedLocationId 
    ? findLocation(locations, selectedLocationId)
    : getDefaultLocation(locations);

  // Resolve data with fallbacks
  const resolvedData = resolveLocationData(selectedLocation, orgData, sharedData);

  // Initialize from cookie on mount
  useEffect(() => {
    const stored = getCookie(LOCATION_COOKIE_NAME);
    if (stored && findLocation(locations, stored)) {
      setSelectedLocationId(stored);
    } else {
      // Set to default location
      const defaultLoc = getDefaultLocation(locations);
      if (defaultLoc?.slug || defaultLoc?.id) {
        setSelectedLocationId(defaultLoc.slug || defaultLoc.id);
      }
    }
    setIsHydrated(true);
  }, [locations]);

  // Select a location
  const selectLocation = useCallback((identifier) => {
    const location = findLocation(locations, identifier);
    if (location) {
      const id = location.slug || location.id;
      setSelectedLocationId(id);
      setCookie(LOCATION_COOKIE_NAME, id, COOKIE_MAX_AGE);
    }
  }, [locations]);

  // Get callbutton flag from orgData (defaults to false if missing)
  const callbutton = orgData?.callbutton === true;

  // Get basic footer flag from orgData (defaults to false if missing)
  const basicFooter = orgData?.basicFooter === true;

  // Context value
  const value = {
    // Raw data
    locations,
    selectedLocation,
    selectedLocationId,
    isHydrated,

    // Resolved data (with fallbacks applied)
    locationName: resolvedData.name,
    locationShortName: resolvedData.shortName,
    
    // Contact info
    contact: resolvedData.contact,
    phone: resolvedData.contact.phone,
    email: resolvedData.contact.email,
    address: resolvedData.contact.address,
    bookingUrl: resolvedData.contact.bookingUrl,
    mapEmbedUrl: resolvedData.contact.mapEmbedUrl,
    mapLink: resolvedData.contact.mapLink,
    
    // Hours
    hours: resolvedData.hours,
    hoursData: resolvedData.hours.hoursData,
    lunchTime: resolvedData.hours.lunchTime,
    specialHours: resolvedData.hours.specialHours,
    
    // Team
    team: resolvedData.team,
    
    // Map component
    map: resolvedData.map,
    
    // Call button flag
    callbutton,
    
    // Helpers
    hasMultipleLocations: locations.filter(l => !l.disable).length > 1,
    selectLocation,
    getDefaultLocation: () => getDefaultLocation(locations),

    // Basic footer flag
    basicFooter,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    // Return safe defaults if context not available
    return {
      locations: [],
      selectedLocation: null,
      selectedLocationId: null,
      isHydrated: false,
      locationName: '',
      locationShortName: '',
      contact: {},
      phone: '',
      email: '',
      address: '',
      bookingUrl: '',
      mapEmbedUrl: null,
      mapLink: null,
      hours: {},
      hoursData: [],
      lunchTime: '',
      specialHours: [],
      team: [],
      map: null,
      callbutton: false,
      basicFooter: false,
      hasMultipleLocations: false,
      selectLocation: () => {},
      getDefaultLocation: () => null,
    };
  }
  return context;
}

