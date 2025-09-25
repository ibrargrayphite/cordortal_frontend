"use client";
import styles from "./Footer.module.css";
import ContactCard from "../../ContactCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cqc from "../../../../public/assets/images/footer/cqc.svg";
import Nhs from "../../../../public/assets/images/footer/nhs.svg";
import Gdc from "../../../../public/assets/images/footer/gdc.jpeg";
import HoursOfOperation from "../../HoursOfOperations";
import CustomButton from "../../CustomButton";
import { useTheme } from "../../../context/ThemeContext";
import { usePages } from '../../../context/PagesContext';
import { isAuthenticated } from '../../../utils/auth';
import { useState, useEffect } from 'react';

const Footer = ({ src, refersrc, title,data,media,noBgColor,footerLogin }) => {
  const { pages } = usePages();
  const ContactCardData = pages.data || {};
  const theme = useTheme();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mounting to ensure hydration is complete
    const timer = setTimeout(() => {
      setMounted(true);
      setAuthenticated(isAuthenticated());
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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

  const handleLogin = () => {
    window.open('/login', '_blank');
  };

  return (
    <>
      <footer>
        
        {
         ContactCardData && Object.keys(ContactCardData).length > 1 ?
         (<div className={styles.contactCard}>
          <ContactCard data={ContactCardData} />
        </div>):""
        }
        
        <div className={styles.footerTopWhiteSpace}></div>
        <div
          className={`w-full ${styles.contentMain}`}
          style={{ background: noBgColor?"":"#1f45b105", paddingTop: 30 }}
        >
          <div className="flex flex-wrap md:text-center lg:text-start">
            <div className="xxl:w-1/6" />
            <div className="w-full lg:w-1/3">
              <HoursOfOperation hoursData={data?.hoursData} lunchTime={data?.lunchTime}/>
            </div>
            {/* for mobile view */}
            <div
              className={`w-full lg:w-1/3 flex md:hidden flex-col items-center ${styles.bookingButton} ${styles.mobileBookingButton}`}
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
            </div>
            <div className={`w-full lg:w-1/3 flex flex-col md:items-center lg:items-start ${styles.mobileCenter}`}>
            {(typeof media == 'undefined'  ||  media)? 
              <>
                <p style={{ fontWeight: "bold", color: theme.content }}>
                  Affiliated
                </p>
                <div style={{ cursor: "pointer", marginTop: 20 }} className={`${styles.footerAward} max-lg:flex max-lg:justify-center`}>
                  <Cqc  height={"55px"} width={"170"}  alt="footerLogo1" onClick={() =>
                    window.open(
                      "https://www.cqc.org.uk/guidance-providers/dentists",
                      "_blank"
                    )
                  }/>
                </div>
                <div style={{ cursor: "pointer", marginTop: 20 }} className={`${styles.footerAward} max-lg:flex max-lg:justify-center`}>
                  <Nhs  height={"55px"} width={"100%"}  alt="nhs" onClick={() => window.open("https://www.nhs.uk/", "_blank")} />
                </div>
                <div className={`${styles.footerAward} max-lg:flex max-lg:justify-center`}>
                  <Image 
                  loading="lazy"
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
              </>
            : ""}
            </div>
          </div>
          {/* for desktop */}
          <div className="md:flex flex-wrap hidden">
            <div className="w-full lg:w-1/3"/>
            <div className={`w-full lg:w-1/3 flex flex-col text-center ${styles.hideOnMobile}`}>
              <div className={`max-lg:mt-0 max-xl:mt-40 ${styles.leftButton}`}>
                <CustomButton
                  headline="Book an Appointment"
                  onClick={() => handleBooking(src)}
                  className={styles.customButton}
                />
              </div>
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
            </div>
            <div className="flex-1" />
          </div>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/6" />
            <div className={`w-full lg:w-8/12 ${styles.footerContent}`}>
              <div className={styles.contentMain}>
                <ul className={styles.footerLink}>
                  <div className="w-full px-6 pb-6">
                    <div className="flex flex-wrap">
                      {footerLinks.map((link, index) => (
                        <div key={index} className="w-1/2 lg:w-1/3">
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
                        </div>
                      ))}
                      {/* Login button - show if footerLogin is true and component is mounted */}
                      {mounted && footerLogin && (
                        <div className="w-1/2 lg:w-1/3">
                          <li>
                            <a
                              style={{ 
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                opacity: 0.8
                              }}
                              onClick={handleLogin}
                            >
                              Login
                            </a>
                          </li>
                        </div>
                      )}
                    </div>
                  </div>
                </ul>
              </div>
            </div>
            <div className="w-full lg:w-1/6" />
          </div>
        </div>
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
