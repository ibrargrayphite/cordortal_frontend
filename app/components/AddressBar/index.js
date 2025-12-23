"use client";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "../../context/LocationContext";
import Image from "next/image";
import locationIcon from "../../../public/assets/images/location.png";
import { ChevronDown } from "lucide-react";
import styles from "./AddressBar.module.css";

const AddressBar = () => {
  const { address, locations, selectedLocation, selectLocation, hasMultipleLocations } = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLocationClick = (location) => {
    if (location.disable) return;
    
    const link = location.link;
    
    if (location.slug || location.id) {
      selectLocation(location.slug || location.id);
      setIsDropdownOpen(false);
    } else if (link?.startsWith('http')) {
      window.open(link, "_blank");
      setIsDropdownOpen(false);
    } else if (link?.startsWith('/')) {
      window.location.href = link;
      setIsDropdownOpen(false);
    } else if (link) {
      window.open(link, "_blank");
      setIsDropdownOpen(false);
    }
  };

  const isLocationSelected = (location) => {
    if (!selectedLocation) return false;
    return (location.slug && location.slug === selectedLocation.slug) ||
           (location.id && location.id === selectedLocation.id);
  };

  // Don't render if no address
  if (!address) return null;

  return (
    <div className={styles.addressBar} ref={dropdownRef}>
      <div className={`container mx-auto xxl:max-w-[1320px] ${styles.addressBarContainer}`}>
        <div className={styles.addressContent}>
          <div className={styles.addressWrapper}>
            <Image
              src={locationIcon.src}
              alt="Location"
              width={16}
              height={16}
              className={styles.locationIcon}
            />
            <span className={styles.addressText} onClick={() => handleLocationClick(selectedLocation)}>{address}</span>
          </div>
          
          {hasMultipleLocations && (
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={styles.dropdownButton}
              aria-label="Select location"
            >
              <ChevronDown 
                size={16} 
                className={`${styles.chevronIcon} ${isDropdownOpen ? styles.chevronOpen : ''}`}
              />
            </button>
          )}
        </div>
        
        {isDropdownOpen && hasMultipleLocations && (
          <div className={styles.dropdownMenu}>
            {locations?.filter(loc => !loc.disable).map((loc) => (
              <button
                key={loc.name || loc.id}
                className={`${styles.dropdownItem} ${isLocationSelected(loc) ? styles.selectedLocation : ''}`}
                onClick={() => handleLocationClick(loc)}
              >
                {loc.displayName || loc.shortName || loc.name}
                {isLocationSelected(loc) && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBar;