"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { usePages } from "../../context/PagesContext";
import styles from "./LocationPage.module.css";
import HoursOfOperation from "../../components/HoursOfOperations";
import GetInTouch from "../../components/GetInTouch";
import YourTeam from "../../components/YourTeam";
import getInTouchBg from "../../../public/assets/images/getBackground.jpeg";

/**
 * Resolves location data with fallbacks to organization defaults
 */
function resolveLocationData(location, orgData, sharedData) {
  // Get org-level defaults
  const orgContact = {
    phone: orgData?.phone,
    email: orgData?.email,
    address: orgData?.address,
  };
  const orgHours = sharedData?.footer?.data?.hoursData || [];
  const orgLunchTime = sharedData?.footer?.data?.lunchTime || "";

  return {
    // Basic info
    id: location.id,
    slug: location.slug,
    name: location.displayName || location.name,
    shortName: location.shortName || location.displayName || location.name,

    // Contact - location overrides org
    contact: {
      phone: location.contact?.phone || orgContact.phone,
      email: location.contact?.email || orgContact.email,
      address: location.contact?.address || location.name || orgContact.address,
      mapEmbedUrl: location.contact?.mapEmbedUrl || null,
      mapLink: location.contact?.mapLink || null,
      bookingUrl: location.contact?.bookingUrl || location.link || sharedData?.header?.src,
    },

    // Hours - location overrides org
    hours: {
      hoursData: location.hours?.hoursData || orgHours,
      lunchTime: location.hours?.lunchTime || orgLunchTime,
      specialHours: location.hours?.specialHours || [],
    },

    // Team - location specific only
    team: location.team || [],

    // SEO
    seo: location.seo || null,

    // Geo
    geo: location.geo || null,
  };
}

export default function LocationPage() {
  const params = useParams();
  const router = useRouter();
  const { pages } = usePages();
  const [isClient, setIsClient] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !pages) return;

    const slug = params?.slug;
    const locations = pages?.data?.locations || [];
    
    // Find location by slug or id
    const location = locations.find(
      (loc) => loc.slug === slug || loc.id === slug
    );

    if (location) {
      const resolved = resolveLocationData(location, pages?.data, pages?.shared);
      setLocationData(resolved);
    } else {
      // Location not found - redirect to home or show 404
      console.warn(`Location not found: ${slug}`);
      setLocationData(null);
    }
    
    setLoading(false);
  }, [isClient, pages, params?.slug]);

  // Loading state
  if (!isClient || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading location...</p>
      </div>
    );
  }

  // Location not found
  if (!locationData) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Location Not Found</h1>
        <p>The location you're looking for doesn't exist.</p>
        <button onClick={() => router.push("/")} className={styles.backButton}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.locationPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container mx-auto">
          <h1 className={styles.locationTitle}>{locationData.name}</h1>
          <p className={styles.locationAddress}>{locationData.contact.address}</p>
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section className={styles.infoSection}>
        <div className="container mx-auto">
          <div className="flex flex-wrap -mx-4">
            {/* Contact Info */}
            <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
              <div className={styles.infoCard}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Address:</span>
                  <span className={styles.contactValue}>{locationData.contact.address}</span>
                </div>
                
                {locationData.contact.phone && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>Phone:</span>
                    <a href={`tel:${locationData.contact.phone}`} className={styles.contactLink}>
                      {locationData.contact.phone}
                    </a>
                  </div>
                )}
                
                {locationData.contact.email && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactLabel}>Email:</span>
                    <a href={`mailto:${locationData.contact.email}`} className={styles.contactLink}>
                      {locationData.contact.email}
                    </a>
                  </div>
                )}

                {locationData.contact.bookingUrl && (
                  <div className={styles.bookingButtonWrapper}>
                    <a
                      href={locationData.contact.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.bookingButton}
                    >
                      Book an Appointment
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Hours */}
            <div className="w-full lg:w-1/2 px-4">
              <div className={styles.infoCard}>
                <HoursOfOperation 
                  hoursData={locationData.hours.hoursData} 
                  lunchTime={locationData.hours.lunchTime}
                />
                
                {/* Special Hours Alert */}
                {locationData.hours.specialHours?.length > 0 && (
                  <div className={styles.specialHours}>
                    <h3>Special Hours</h3>
                    {locationData.hours.specialHours.map((special, index) => (
                      <div key={index} className={styles.specialHourItem}>
                        <span className={styles.specialDate}>{special.label} ({special.date}):</span>
                        <span className={styles.specialTime}>{special.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {locationData.contact.mapEmbedUrl && (
        <section className={styles.mapSection}>
          <div className="container mx-auto">
            <h2 className={styles.sectionTitle}>Find Us</h2>
            <div className={styles.mapWrapper}>
              <iframe
                src={locationData.contact.mapEmbedUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${locationData.name}`}
              ></iframe>
            </div>
            {locationData.contact.mapLink && (
              <div className={styles.mapLinkWrapper}>
                <a
                  href={locationData.contact.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  Open in Google Maps →
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Team Section */}
      {locationData.team?.length > 0 && (
        <section className={styles.teamSection}>
          <div className="container mx-auto">
            <h2 className={styles.sectionTitle}>Our Team at {locationData.shortName}</h2>
            <YourTeam
              teamMembers={locationData.team.map((member) => ({
                teamMemberName: member.name,
                teamMemberSpeciality: member.role,
                teamMemberImage: member.image || "",
              }))}
            />
          </div>
        </section>
      )}

      {/* Get In Touch Section */}
      <section className={styles.getInTouchSection}>
        <GetInTouch headline="Get in touch" media={getInTouchBg.src} />
      </section>
    </div>
  );
}

