"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./HeaderDefault.module.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import defaultMedia from "../../../../public/assets/images/solutions/implants.png";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeaderDefault = ({ media, name, menuItems, button }) => {
  const router = useRouter();
  const theme = useTheme();
  const [activeLink, setActiveLink] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLinkClick = (index) => {
    if(index =='/')
       {
        router.push('/')
       }
    setActiveLink(index);
    if(isMenuOpen) {
      setIsMenuOpen(false)
    }
  };

  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  return (
    <div className={styles.header} style={{ background: theme.mainAccentDark }}>
      <div className="container">
        <nav>
          <div class="flex flex-wrap items-center justify-between mx-auto">
            <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
              <div className={styles.container}>
                {/* Logo Section */}
                <div
                  className={styles.logo}
                  onClick={() => handleLinkClick("/")}
                >
                  <Navbar.Brand>
                    <Image 
                    loading="lazy"
                    width={100} height={100}
                      src={
                        media && media?.startsWith("https")
                          ? media
                          : defaultMedia.src
                      }
                      alt={`Best Dental Care ${name}`}
                      className="h-10 w-full"
                    />
                  </Navbar.Brand>
                  {/* </Link> */}
                </div>
              </div>
            </a>
            <button className="lg:hidden text-white" onClick={toggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div
              class="hidden w-full lg:flex md:w-auto gap-4"
              id="navbar-default"
            >
              {menuItems.map((item, index) =>
                item.dropdown ? (
                  <div
                    key={index}
                    className={styles.dropdown}
                    onMouseEnter={() => setIsDropdownVisible(true)}
                    onMouseLeave={() => setIsDropdownVisible(false)}
                  >
                    <button className={styles.navItem}>{item.name}</button>
                    {isDropdownVisible && (
                      <div className={styles.dropdownMenu}>
                        {item.dropdown.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={styles.dropdownLink}
                            onClick={() => handleLinkClick(subIndex)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className={`${styles.navItem} ${
                      activeLink === index ? styles.navItemActive : ""
                    }`}
                    onClick={() => handleLinkClick(index)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
            <div class="hidden lg:block">
              <button
                onClick={() => handleBooking(button.href)}
                className={styles.bookNowButton}
              >
                {button.name}
              </button>
            </div>
          </div>
          {/* Mobile Menu (toggles visibility based on state) */}
          <div
            className={`lg:hidden ${
              isMenuOpen ? "block" : "hidden"
            } text-white flex flex-col justify-center items-center space-y-4 p-4`}
          >
            {menuItems.map((item, index) =>
              item.dropdown ? (
                <div
                  key={index}
                  className={styles.dropdown}
                  onMouseEnter={() => setIsDropdownVisible(true)}
                  onMouseLeave={() => setIsDropdownVisible(false)}
                >
                  <button className={styles.navItem}>{item.name}</button>
                  {isDropdownVisible && (
                    <div className={styles.dropdownMenu}>
                      {item.dropdown.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={styles.dropdownLink}
                          onClick={() => handleLinkClick(subIndex)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className={`${styles.navItem} ${
                    activeLink === index ? styles.navItemActive : ""
                  }`}
                  onClick={() => handleLinkClick(index)}
                >
                  {item.name}
                </Link>
              )
            )}
            <button
              onClick={() => handleBooking(button.href)}
              className={styles.bookNowButton}
            >
              {button.name}
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default HeaderDefault;
