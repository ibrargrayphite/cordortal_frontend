"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Nav, Navbar } from "react-bootstrap";
import MenuIcon from "../../../../public/assets/images/navIcon.svg";
import CrossIcon from "../../../../public/assets/images/cross.svg";
import locationIcon from "../../../../public/assets/images/location.png";
import styles from "./Navbar.module.css";
import { useTheme } from '../../../context/ThemeContext';
import defaultMedia from "../../../../public/assets/images/solutions/implants.png";

const NavBar = ({media,src,name}) => {
  const theme = useTheme();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const currentPath = router.pathname;

  const [activeItem, setActiveItem] = useState("Home");
  const [expanded, setExpanded] = useState(false);
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
  
  const toggleDropdown = (e) => {
    e.preventDefault();
    setLocationDropdownVisible(!locationDropdownVisible);
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

  const handleNavigation = (path) => {
    router.push(path); // Use router.push for navigation
    if (!(path === "/about-us" || path === "/services" || path === "/information")) {
      setExpanded(false);
    }
  };

  const handleBooking = (src) => {
    window.open(src, "_blank");
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
    <Navbar
      collapseOnSelect
      style={{
        background: theme.mainAccentDark,
        position: "fixed",
        width: "100%",
        top: "0px",
        zIndex: 1100,
      }}
      className={styles.navbarCollapse}
      expand="lg"
      // className=" mt-3"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => handleNavigation("/")}
        >
          <img src={media && media?.startsWith('https') ? media : defaultMedia.src} height={69} className={styles.logoMob} alt={`Best Dental Care${name}`} />
        </Navbar.Brand>
        <div className={styles.locationMob}>
          <div
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
              <img
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
              <a className={styles.disabled}>Huddersfield</a>
              <a
                onClick={() =>
                  window.open("https://www.bailiffbridgedental.com/", "_blank")
                }
              >
                Brighouse
              </a>
            </div>
          </div>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(expanded ? false : "expanded")}
            style={{
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
              boxShadow: "none",
            }}
          >
            {expanded ? (
              <CrossIcon width={22} height={24} className={styles.mobileMenuIcon} alt="cross" />
            ) : (
              <MenuIcon height={24} width={48} className={styles.mobileMenuIcon} alt="menu" />
            )}
          </Navbar.Toggle>
        </div>
        <Navbar.Collapse
          id="responsive-navbar-nav  justify-content-center  "
          className=" d-lg-flex justify-content-end  "
        >
          <div>
            <Nav className="me-auto  d-flex flex-column flex-lg-row align-items-center   ">
              <div
                style={{ margin: "0px 18px" }}
                className="mt-4 mb-4 mb-lg-0  mt-lg-0 "
              >
                {/* <a
                  style={{ fontSize: "16px" }}
                  className={`font-size-lg font-size-md-md font-size-sm-sm ${
                    styles.listStyle
                  } ${activeItem === "Home" ? styles.active : ""}`}
                  onClick={() => handleNavigation("/")}
                >
                  Home
                </a> */}
              </div>
              <div
                style={{ margin: "0px 18px" }}
                className={`${styles.aboutDropdown} mb-4 mb-lg-0`}
              >
                <a
                  style={{ fontSize: "16px" }}
                  className={`  ${styles.listStyle} ${
                    activeItem === "AboutUs" ? styles.active : ""
                  }`}
                  onClick={() => handleNavigation("/about-us")}
                >
                  About Us
                </a>
                <div className={styles.aboutDropdownContent}>
                  <a onClick={() => handleNavigation("/about-us")}>
                    About {name}
                  </a>
                  <a onClick={() => handleNavigation("/team")}>
                    Meet The Team
                  </a>
                  <a onClick={() => handleNavigation("/testimonials")}>
                    Testimonials
                  </a>
                </div>
              </div>
              <div
                style={{ margin: "0px 18px" }}
                className={`${styles.servicesDropdown} mb-4 mb-lg-0`}
              >
                <a
                  style={{ fontSize: "16px" }}
                  className={` font-size-lg font-size-md-md font-size-sm-sm ${
                    styles.listStyle
                  } ${activeItem === "Services" ? styles.active : ""}`}
                  onClick={() => handleNavigation("/services")}
                >
                  Treatments
                </a>
                <div className={styles.servicesDropdownContent}>
                  <a onClick={() => handleNavigation("/services/implants")}>
                    Implants
                  </a>
                  <a onClick={() => handleNavigation("/services/smile")}>
                    Smile Design
                  </a>
                  <a
                    onClick={() => handleNavigation("/services/clear-aligners")}
                  >
                    Clear Aligners
                  </a>
                  <a
                    onClick={() =>
                      handleNavigation("/services/composite-bonding")
                    }
                  >
                    Composite Bonding
                  </a>
                  <a
                    onClick={() =>
                      handleNavigation("/services/teeth-whitening")
                    }
                  >
                    Teeth Whitening
                  </a>

                  <a
                    onClick={() =>
                      handleNavigation("/services/restorative-dentistry")
                    }
                  >
                    Restorative Dentistry
                  </a>

                  <a onClick={() => handleNavigation("/services/family-care")}>
                    Family Care
                  </a>
                  <a
                    onClick={() =>
                      handleNavigation("/services/minor-oral-surgery")
                    }
                  >
                    Minor Oral Surgery
                  </a>
                  <a onClick={() => handleNavigation("/services/sedation")}>
                    Sedation
                  </a>
                </div>
              </div>
              <div
                style={{ margin: "0px 18px" }}
                className={`${styles.informationDropdown} mb-4 mb-lg-0`}
              >
                <a
                  style={{ fontSize: "16px" }}
                  className={` font-size-lg font-size-md-md font-size-sm-sm ${
                    styles.listStyle
                  } ${activeItem === "Information" ? styles.active : ""}`}
                  onClick={() => handleNavigation("/information")}
                >
                  Information
                </a>
                <div className={styles.informationDropdownContent}>
                  <a onClick={() => handleNavigation("/information/pricing")}>
                    Private Treatment Pricing
                  </a>
                  <a onClick={() => handleNavigation("/information/nhs")}>
                    NHS Pricing
                  </a>
                  <a onClick={() => handleNavigation("/information/tabeo")}>
                    Tabeo
                  </a>
                  <a onClick={() => handleNavigation("/information/finance")}>
                    Finance Calculator
                  </a>
                  <a
                    onClick={() => handleNavigation("/information/forpatient")}
                  >
                    Information for Patients
                  </a>
                  {/* <a onClick={() => handleNavigation("/information/documents")}>
                    Documents
                  </a> */}
                  <a onClick={() => handleNavigation("/blogs")}>Blogs</a>
                </div>
              </div>
              {/* <div style={{ margin: "0px 18px" }} className="mb-4 mb-lg-0 ">
                <a
                  style={{ fontSize: "16px" }}
                  className={`font-size-lg font-size-md-md font-size-sm-sm ${
                    styles.listStyle
                  } ${activeItem === "Blogs" ? styles.active : ""}`}
                  onClick={() => handleNavigation("/blogs")}
                >
                  Blogs
                </a>
              </div> */}
              <div style={{ margin: "0px 18px" }} className="mb-4 mb-lg-0 ">
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
                  <div
                    style={{
                      color: "red",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleNavigation("/emergency")}
                    className={styles.emergencyAppointment2}
                  >
                    Emergency
                  </div>
                  {/* <div>
                    <img src={Emergency} height={10} />
                  </div> */}
                </div>
              </div>
              {/* <div style={{ margin: "0px 18px" }} className="mb-4 mb-lg-0 me-4">
                <a
                  style={{ fontSize: "16px" }}
                  className={`font-size-lg font-size-md-md font-size-sm-sm ${
                    styles.listStyle
                  } ${activeItem === "ContactUs" ? styles.active : ""}`}
                  onClick={() => handleNavigation("/contact-us")}
                >
                  Contact Us
                </a>
              </div> */}
              <div className={styles.locationDropdown}>
                <div
                  style={{ margin: "0px 18px" }}
                  className={`${styles.informationDropdown} mb-4 mb-lg-0`}
                  ref={dropdownRef}
                >
                  <a
                    style={{ fontSize: "16px" }}
                    className={` font-size-lg font-size-md-md font-size-sm-sm ${
                      styles.listStyle
                    } ${activeItem === "Location" ? styles.active : ""}`}
                    onClick={toggleDropdown}
                  >
                    <img height={32} src={locationIcon.src} alt={`Exceptional Dental Service at ${name}`}  />
                  </a>
                  <div
                    className={`${styles.informationDropdownContent} ${
                      locationDropdownVisible ? styles.visible : ""
                    }`}
                  >
                    <a className={styles.disabled}>Huddersfield</a>
                    <a
                      onClick={() =>
                        window.open(
                          "https://www.bailiffbridgedental.com/",
                          "_blank"
                        )
                      }
                    >
                      Brighouse
                    </a>
                  </div>

                  <>
                    {name === "Oaklands Dental" ? (
                      <div
                        className={`${styles.informationDropdownContent} ${
                          locationDropdownVisible ? styles.visible : ""
                        }`}
                      >
                        <a className={styles.disabled}>Huddersfield</a>
                        <a
                          onClick={() =>
                            window.open("https://www.bailiffbridgedental.com/", "_blank")
                          }
                        >
                          Brighouse
                        </a>
                      </div>
                    ) : name === "Bailiff Bridge" ? (
                      <div
                        className={`${styles.informationDropdownContent} ${
                          locationDropdownVisible ? styles.visible : ""
                        }`}
                      >
                        <a className={styles.disabled}>Brighouse</a>
                        <a
                          onClick={() =>
                            window.open("https://oaklandsdentalhudds.co.uk/", "_blank")
                          }
                        >
                          Huddersfield
                        </a>
                      </div>
                    ) : null}
                  </>
                </div>
              </div>
              <button
                className={styles.button}
                onClick={() => handleBooking(src)}
                style={{ width: 211, marginLeft: "14px" }}
              >
                Book Online
              </button>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavBar;
