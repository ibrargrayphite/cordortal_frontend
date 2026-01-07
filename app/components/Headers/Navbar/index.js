"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MenuIcon from "../../../../public/assets/images/navIcon.svg";
import CrossIcon from "../../../../public/assets/images/cross.svg";
import locationIcon from "../../../../public/assets/images/location.png";
import styles from "./Navbar.module.css";
import { useTheme } from "../../../context/ThemeContext";
import { useLocation } from "../../../context/LocationContext";
import defaultMedia from "../../../../public/assets/images/solutions/implants.png";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../utils/utils";
import phoneIcon from "../../../../public/assets/images/footer/phone.png";
const NavBar = ({ media, src, name, menuItems, locations: propsLocations }) => {
  const theme = useTheme();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const currentPath = router.pathname;
  
  // Location context for multi-location support
  const { selectLocation, selectedLocation, hasMultipleLocations, isHydrated, locations: contextLocations, phone, callbutton } = useLocation();
  
  // Use context locations if available (ensures consistency), fallback to props
  const locations = contextLocations?.length > 0 ? contextLocations : propsLocations;

  const [activeItem, setActiveItem] = useState("Home");
  const [expanded, setExpanded] = useState(false);
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setLocationDropdownVisible(!locationDropdownVisible);
  };

  const handlePhoneClick = (e) => {
    // On mobile, open dialer
    if (window.innerWidth < 991) {
      if (phone) {
        window.location.href = `tel:${phone.replace(/\s/g, '')}`;
      }
    }
    // On desktop, do nothing (prevent default)
    e.preventDefault();
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setLocationDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (locationDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locationDropdownVisible]);
  const handleNavigation = (href) => {
    if (href.startsWith("http") || href.startsWith("www")) {
      // Open external links in a new tab
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href); // Use router.push for navigation
      if (
        !(
          href === "/about-us" ||
          href === "/services" ||
          href === "/information"
        )
      ) {
        setExpanded(false);
      }
    }
  };

  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  /**
   * Smart location click handler - supports both existing external links and new context-based selection
   * @param {Object} location - Location object from data.locations[]
   */
  const handleLocationClick = (location) => {
    // Don't do anything if location is disabled
    if (location.disable) return;

    const link = location.link;
    
    // PRIORITY 1: Has slug or id → use context to switch location (re-render components)
    // This takes priority because if slug/id exists, we want context-based switching
    if (location.slug || location.id) {
      selectLocation(location.slug || location.id);
      setLocationDropdownVisible(false);
      setExpanded(false);
    }
    // PRIORITY 2: External URL (starts with http/https) → open in new tab (for sites without slug/id)
    else if (link?.startsWith('http')) {
      window.open(link, "_blank");
    }
    // PRIORITY 3: Internal path (starts with /) → navigate within site
    else if (link?.startsWith('/')) {
      router.push(link);
      setLocationDropdownVisible(false);
      setExpanded(false);
    }
    // PRIORITY 4: Fallback - try to open link in new tab if it exists
    else if (link) {
      window.open(link, "_blank");
    }
  };
  
  /**
   * Check if a location is currently selected
   */
  const isLocationSelected = (location) => {
    if (!selectedLocation) return false;
    return (location.slug && location.slug === selectedLocation.slug) ||
           (location.id && location.id === selectedLocation.id);
  };

  // useEffect(() => {
  //   if (currentPath.startsWith("/about-us")) setActiveItem("AboutUs");
  //   else if (currentPath.startsWith("/services")) setActiveItem("Services");
  //   else if (currentPath.startsWith("/information")) setActiveItem("Information");
  //   else if (currentPath === "/blogs") setActiveItem("Blogs");
  //   else if (currentPath === "/location") setActiveItem("Location");
  //   else setActiveItem("Home");
  // }, [currentPath]);

  return (
    <div
      style={{
        background: theme.mainAccentDark,
        position: "fixed",
        width: "100%",    // FIXED: was 100vw
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1100,
        margin: 0,
        padding: 0,
      }}
      className={styles.navbarCollapse}
    >
      <div className={`container mx-auto flex items-center justify-between xxl:max-w-[1320px] py-3 ${styles.navBarContainer}`}>
        {/* Logo (always visible) */}
        <div
          style={{ cursor: "pointer", maxWidth: "207px" }}
          onClick={() => handleNavigation("/")}
        >
          <Image
            loading="lazy"
            width={100}
            height={69}
            src={media?.startsWith("https") ? media : defaultMedia.src}
            className={styles.logoMob}
            alt={`Best Dental Care ${name}`}
          />
        </div>

        {/* Desktop nav (hidden on mobile) */}
        <div
          className={`hidden lg:flex items-center justify-end`}
          style={{ minHeight: "1vh", maxHeight: "63vh" }}
        >
          <div className="me-auto flex flex-col lg:flex-row items-center">
            {menuItems?.map((item) => (
              <div
                key={item.label}
                className={`${styles.aboutDropdown} !mb-4 lg:!mb-0`}
              >
                <a
                  style={{ fontSize: "16px" }}
                  className={`${styles.listStyle} ${
                    activeItem === item.label ? styles.active : ""
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.label}
                </a>
                {item.htmlContent && (
                  <span dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                )}
                {item.subItems?.length > 0 && (
                  <div className={styles[`${"aboutDropdown"}Content`]}>
                    {item.subItems.map((subItem) => (
                      <a
                        key={subItem.label}
                        onClick={() => handleNavigation(subItem.href)}
                      >
                        {subItem.label.replace("{name}", name)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Emergency button */}
            <div className={`!mb-4 lg:!mb-0 ${styles.emergencyButton}`}>
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  onClick={() => handleNavigation("/emergency")}
                  variant="emergency"
                  className={cn(
                    "border-2 border-red-500 bg-[color-mix(in_srgb,var(--main-accent-color)_20%,white)]",
                    "hover:bg-red-500",
                    "hover:border-white"
                  )}
                >
                  Emergency
                </Button>
              </div>
            </div>

            {/* Desktop location dropdown */}
            {/* <div className={styles.locationDropdown}>
              <div
                className={`${styles.informationDropdown} !mb-4 lg:!mb-0`}
                ref={dropdownRef}
              >
                <a
                  style={{ fontSize: "16px" }}
                  className={` font-size-lg font-size-md-md font-size-sm-sm ${
                    styles.listStyle
                  } ${activeItem === "Location" ? styles.active : ""}`}
                  onClick={toggleDropdown}
                >
                  <Image
                    loading="lazy"
                    width={100}
                    height={32}
                    className={styles.locationIconStyle}
                    src={locationIcon.src}
                    alt={`Exceptional Dental Service at ${name}`}
                  />
                </a>
                <div
                  className={`${styles.informationDropdownContent} ${
                    locationDropdownVisible ? styles.visible : ""
                  }`}
                >
                  {locations?.map((loc) => (
                    <a
                      key={loc.name + 2}
                      className={`${loc.disable ? styles.disabled : ""} ${isLocationSelected(loc) ? styles.selectedLocation : ""}`}
                      onClick={() => handleLocationClick(loc)}
                    >
                      {loc.displayName || loc.shortName || loc.name}
                      {isLocationSelected(loc) && <span className={styles.checkmark}>✓</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div> */}

           {phone && callbutton && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={`${styles.callButton} ${styles.callButtonDesktop}`}
                style={{ 
                  width: 140,
                  cursor: "not-allowed",
                  pointerEvents: "none"
                }}
                variant="default"
                size="default"
                disabled
              >
                <Image
                  src={phoneIcon}
                  alt="Phone"
                  width={16}
                  height={16}
                  className={styles.phoneIcon}
                />
                {phone}
              </Button>
            )}
            {/* Book Online button - Only show if src exists and is a non-empty string */}
            {src && typeof src === 'string' && src.trim() !== '' && (
              <Button
                onClick={() => handleBooking(src)}
                className={`${styles.customNavbarBtn} bg-main-accent`}
                style={{ width: 211, marginLeft: "14px" }}
                variant="default"
                size="default"
              >
                Book Online
              </Button>
            )}
          </div>
        </div>

        {/* Mobile controls (only on < md) */}
        <div className={`flex lg:hidden items-center gap-2 ${styles.locationMob}`}>
          {/* Location dropdown (mobile) */}
          {/* <div
            style={{
              margin: "0px 6px",
              display: "flex",
              justifyContent: "end",
              position: "relative",
            }}
            className={`${styles.informationDropdown}`}
            ref={dropdownRef}
          >
            <a
              style={{ fontSize: "16px" }}
              className={` font-size-lg font-size-md-md font-size-sm-sm ${
                styles.listStyle
              } ${activeItem === "Location" ? styles.active : ""}`}
              onClick={toggleDropdown}
            >
              <Image
                loading="lazy"
                width={100}
                height={26}
                style={{ marginTop: 3 }}
                className={styles.mobilelocationicon}
                src={locationIcon.src}
                alt={`Premier Dental Services at ${name}`}
              />
            </a>
            <div
              className={`${styles.informationDropdownContent} ${
                locationDropdownVisible ? styles.visible : ""
              }`}
              style={{ marginTop: 40 }}
            >
              {locations?.map((loc) => (
                <a
                  key={loc.name + 1}
                  className={`${loc.disable === true ? styles.disabled : ""} ${isLocationSelected(loc) ? styles.selectedLocation : ""}`}
                  onClick={() => handleLocationClick(loc)}
                >
                  {loc.displayName || loc.shortName || loc.name}
                  {isLocationSelected(loc) && <span className={styles.checkmark}>✓</span>}
                </a>
              ))}
            </div>
          </div> */}
          {/* Phone icon - Mobile (clickable) - Left of hamburger */}
          {phone && callbutton && (
            <button
              onClick={handlePhoneClick}
              className={styles.phoneIconButton}
              style={{
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label={`Call ${phone}`}
            >
              <Image
                src={phoneIcon}
                alt="Call"
                width={30}
                height={24}
                className={styles.phoneIcon}
              />
            </button>
          )}
          {/* Mobile menu toggle */}
          <button
            onClick={() => setExpanded(expanded ? false : true)}
            style={{
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
            }}
          >
            {expanded ? (
              <CrossIcon
                width={22}
                height={24}
                className={styles.mobileMenuIcon}
                alt="cross"
              />
            ) : (
              <MenuIcon
                height={24}
                width={30}
                className={styles.mobileMenuIcon}
                alt="menu"
              />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible nav for mobile (below logo + controls) */}
      {expanded && (
        <div
          className="block md:hidden"
          style={{ minHeight: "1vh", maxHeight: "63vh" }}
        >
          <div className="me-auto flex flex-col items-center pb-2 gap-4">
            {menuItems?.map((item) => (
              <div
                key={item.label}
                className={`${styles.aboutDropdown}`}
              >
                <a
                  style={{ fontSize: "16px" }}
                  className={`${styles.listStyle} ${
                    activeItem === item.label ? styles.active : ""
                  }`}
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.label}
                </a>
                  {item.htmlContent && (
                    <span dangerouslySetInnerHTML={{ __html: item.htmlContent }} />
                  )}
                  {item.subItems?.length > 0 && (
                    <div className={styles[`${"aboutDropdown"}Content`]}>
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.label}
                          onClick={() => handleNavigation(subItem.href)}
                        >
                          {subItem.label.replace("{name}", name)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* hardcoded emergency button */}
              <div 
              // style={{ margin: "0px 18px" }} 
              className={`lg:!mb-0 ${styles.emergencyButton}`}>
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    style={{ fontSize: "16px" }}
                    className={`font-size-lg font-size-md-md font-size-sm-sm ${
                      styles.listStyle
                    } ${activeItem === "Blogs" ? styles.active : ""}`}
                    onClick={() => handleNavigation("/emergency")}
                  >
                    {/* Emergency{" "} */}
                  </a>
                  <Button
                    onClick={() => handleNavigation("/emergency")}
                    variant="emergency"
                    className={cn(
                      "border-2 border-red-500 bg-[color-mix(in_srgb,var(--main-accent-color)_20%,white)]",
                      "hover:bg-red-500",
                      "hover:border-white"
                    )}
                  >
                    Emergency
                  </Button>
                  {/* <div>
                    <Image priority={true}  src={Emergency} height={10} />
                  </div> */}
                </div>
              </div>
              {/* <div className={styles.locationDropdown}>
                <div
                  // style={{ margin: "0px 18px" }}
                  className={`${styles.informationDropdown} mb-4 lg:!mb-0`}
                  ref={dropdownRef}
                >
                  <a
                    style={{ fontSize: "16px" }}
                    className={` font-size-lg font-size-md-md font-size-sm-sm ${
                      styles.listStyle
                    } ${activeItem === "Location" ? styles.active : ""}`}
                    onClick={toggleDropdown}
                  >
                    <Image
                      loading="lazy"
                      width={100}
                      height={32}
                      className={styles.locationIconStyle}
                      src={locationIcon.src}
                      alt={`Exceptional Dental Service at ${name}`}
                    />
                  </a>
                  <div
                    className={`${styles.informationDropdownContent} ${
                      locationDropdownVisible ? styles.visible : ""
                    }`}
                  >
                    {locations?.map((loc) => (
                      <a key={loc.name+2} className={`${loc.disable?styles.disabled:""} ${isLocationSelected(loc) ? styles.selectedLocation : ""}`}
                        onClick={() => handleLocationClick(loc)}
                      >
                        {loc.displayName || loc.shortName || loc.name}
                        {isLocationSelected(loc) && <span className={styles.checkmark}>✓</span>}
                      </a>
                    ))}
                  </div>
                </div>
              </div> */}
            {/* Book Online button - Only show if src exists and is a non-empty string */}
            {src && typeof src === 'string' && src.trim() !== '' && (
              <Button
                onClick={() => handleBooking(src)}
                className={`${styles.customNavbarBtn} bg-main-accent`}
                style={{ width: 211, marginLeft: "14px" }}
                variant="default"
                size="default"
              >
                Book Online
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NavBar;
