"use client";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./Footer.module.css";
import ContactCard from "../ContactCard";
import { useRouter } from "next/navigation"; // Use Next.js router instead of react-router
import Image from "next/image";
import Cqc from "../../../public/assets/images/footer/cqc.svg";
import Nhs from "../../../public/assets/images/footer/nhs.svg";
import Gdc from "../../../public/assets/images/footer/gdc.jpeg";
import HoursOfOperation from "../HoursOfOperations";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext"; // Import the useTheme hook
import currentLocation from "../../data";

const Footer = ({ src, refersrc, title }) => {
  const ContactCardData = currentLocation.data || {};
  const theme = useTheme(); // Access the theme colors

  const router = useRouter();

  const handleNavigation = (path, external = false) => {
    if (external) {
      window.open(path, "_blank"); // For external links
    } else {
      router.push(path); // For internal navigation
    }
  };

  const footerLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about-us" },
    { label: "Meet The Team", path: "/team" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Pricing", path: "/information/pricing" },
    { label: "Information For Patients", path: "/information/forpatient" },
    { label: "What We Offer", path: "/information/pricing" },
    { label: "Modern Slavery Policy", path: "/modern-slavery" },
  ];

  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <>
      <footer>
        <div className={styles.contactCard}>
          <ContactCard data={ContactCardData} />
        </div>
        <div className={styles.footerTopWhiteSpace}></div>
        <Container
          fluid
          className={styles.contentMain}
          style={{ background: "#1f45b105", paddingTop: 30 }}
        >
          <Row>
            <Col lg={2} />
            <Col lg={4} sm={12}>
              <HoursOfOperation />
            </Col>
            {/* for mobile view */}
            <Col
              lg={4}
              sm={12}
              className={`${styles.bookingButton} ${styles.mobileBookingButton}`}
            >
              <CustomButton
                headline="Book an Appointment"
                onClick={handleBooking}
                className={styles.customButton}
              />
              <div>
                <ul className={styles.footerLink}>
                  <li>
                    <a style={{ cursor: "pointer" }}>Refer Your Patient</a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={4} sm={12} className={styles.mobileCenter}>
              <p style={{ fontWeight: "bold", color: theme.content }}>
                Affiliated
              </p>
                <div style={{ cursor: "pointer", marginTop: 20 }}>
                  <Cqc  height={"55px"} width={"40%"} alt="footerLogo1" onClick={() =>
                    window.open(
                      "https://www.cqc.org.uk/guidance-providers/dentists",
                      "_blank"
                    )
                  }/>
                  </div>
              <div style={{ cursor: "pointer", marginTop: 20 }}>
                {/* <Image
                  height={50}
                  width={50}
                  style={{ cursor: "pointer", marginTop: 20 }}
                  src={Nhs}
                  alt="nhs"
                  onClick={() => window.open("https://www.nhs.uk/", "_blank")}
                /> */}
                <Nhs  height={"55px"} width={"30%"} alt="nhs" onClick={() => window.open("https://www.nhs.uk/", "_blank")} />
              </div>
              <div>
                <Image
                  height={70}
                  width={70}
                  style={{ cursor: "pointer", marginTop: 20 }}
                  src={Gdc}
                  alt="Certified by the General Dental Council"
                  onClick={() =>
                    window.open("https://www.gdc-uk.org/", "_blank")
                  }
                />
              </div>
            </Col>
          </Row>
          {/* for desktop */}
          <Row>
            <Col lg={4} />
            <Col lg={4} sm={12} className={styles.hideOnMobile}>
              <CustomButton
                headline="Book an Appointment"
                onClick={() => handleBooking(src)}
                className={styles.customButton}
              />
              <div style={{ marginTop: 20 }}>
                <ul className={styles.footerLink}>
                  <li>
                    <a
                      href={refersrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
                    >
                      Refer Your Patient
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col />
          </Row>
          <Row>
            <Col lg={2} />
            <Col lg={8} sm={12} className={styles.footerContent}>
              <div className={styles.contentMain}>
                <ul className={styles.footerLink}>
                  <Container fluid>
                    <Row>
                      {footerLinks.map((link, index) => (
                        <Col
                          key={index}
                          lg={4}
                          sm={6}
                          xs={6}
                        >
                          <li>
                            <a
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleNavigation(link.path, link.external || false)
                              }
                            >
                              {link.label}
                            </a>
                          </li>
                        </Col>
                      ))}
                    </Row>
                  </Container>
                </ul>
              </div>
            </Col>
            <Col lg={2} />
          </Row>
        </Container>
      </footer>
      <div className={styles.copywrightText}>
        Copyright 2024 All Rights Reserved by{" "}
        <a
          onClick={handleHome}
          style={{
            color: "#52575D",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {title}
        </a>
        .
      </div>
    </>
  );
};

export default Footer;
