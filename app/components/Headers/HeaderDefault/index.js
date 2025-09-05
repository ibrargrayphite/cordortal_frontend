"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../../../context/ThemeContext";
import styles from "./HeaderDefault.module.css";
import defaultMedia from "../../../../public/assets/images/solutions/implants.png";
import { useRouter } from "next/navigation";
import CrossIcon from "../../../../public/assets/images/cross.svg";
import MenuIcon from "../../../../public/assets/images/navIcon.svg";
import Image from "next/image";

const HeaderDefault = ({ media, name, menuItems, button }) => {
  const router = useRouter();
  const theme = useTheme();
  const [activeLink, setActiveLink] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = (index) => {
    if (index == "/") {
      router.push("/");
    }
    setActiveLink(index);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleBooking = (src) => {
    window.open(src, "_blank");
  };

  return (
    <div className={styles.header} style={{ background: theme.mainAccentDark }}>
      <div className="container mx-auto xxl:max-w-[1320px]">
        <nav>
          <div className="flex flex-wrap items-center justify-between mx-auto">
            {/* Logo */}
            <div className={styles.container}>
              <div
                className={styles.logo}
                onClick={() => handleLinkClick("/")}
              >
                <Image
                  loading="lazy"
                  width={100}
                  height={100}
                  src={media?.startsWith("https") ? media : defaultMedia.src}
                  alt={`Best Dental Care ${name}`}
                  className="h-10 w-full"
                />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden text-white" onClick={toggleMenu}>
              {isMenuOpen ? (
                <CrossIcon
                  width={22}
                  height={24}
                  className={styles.mobileMenuIcon}
                  alt="cross"
                />
              ) : (
                <MenuIcon
                  height={24}
                  width={48}
                  className={styles.mobileMenuIcon}
                  alt="menu"
                />
              )}
            </div>

            {/* Desktop Nav */}
            <div className="hidden w-full lg:flex md:w-auto gap-4" id="navbar-default">
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

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <button
                onClick={() => handleBooking(button.href)}
                className={styles.bookNowButton}
              >
                {button.name}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
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
