"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePages } from "../context/PagesContext";
import styles from "./Locations.module.css";

export default function LocationsPage() {
  const router = useRouter();
  const { pages } = usePages();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading locations...</p>
      </div>
    );
  }

  const locations = pages?.data?.locations || [];
  const activeLocations = locations.filter((loc) => !loc.disable);
  const orgName = pages?.name || pages?.title || "Our Clinic";

  const handleLocationClick = (location) => {
    if (location.slug) {
      router.push(`/locations/${location.slug}`);
    } else if (location.link?.startsWith("/")) {
      router.push(location.link);
    } else if (location.link) {
      window.open(location.link, "_blank");
    }
  };

  return (
    <div className={styles.locationsPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container mx-auto">
          <h1 className={styles.pageTitle}>Our Locations</h1>
          <p className={styles.pageSubtitle}>
            Find a {orgName} clinic near you
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className={styles.locationsSection}>
        <div className="container mx-auto">
          {activeLocations.length === 0 ? (
            <div className={styles.noLocations}>
              <p>No locations available at this time.</p>
            </div>
          ) : (
            <div className={styles.locationsGrid}>
              {activeLocations.map((location, index) => (
                <div
                  key={location.id || location.name || index}
                  className={styles.locationCard}
                  onClick={() => handleLocationClick(location)}
                >
                  <div className={styles.cardContent}>
                    <h2 className={styles.locationName}>
                      {location.displayName || location.shortName || `Location ${index + 1}`}
                    </h2>
                    <p className={styles.locationAddress}>{location.name}</p>
                    
                    {location.contact?.phone && (
                      <p className={styles.locationPhone}>
                        <span>📞</span> {location.contact.phone}
                      </p>
                    )}
                    
                    {location.isDefault && (
                      <span className={styles.defaultBadge}>Main Location</span>
                    )}
                  </div>
                  
                  <div className={styles.cardAction}>
                    <span className={styles.viewButton}>
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

