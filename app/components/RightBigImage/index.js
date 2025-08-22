"use client";
import React from "react";
import styles from "./RightBigImage.module.css";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";
import {
  FaChevronRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaClock,
  FaUserFriends,
  FaMedkit,
  FaGlobe,
  
} from "react-icons/fa";
import {
  MdOutlineFacebook,
  MdOutlinePeople,
  MdOutlineAccessTime,
  MdOutlineMedicalServices,
  MdOutlinePublic,
} from "react-icons/md";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const RightBigImage = ({ headline, description, media, data }) => {
  const theme = useTheme();
  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-wrap items-center g-0">
        {/* Left Section */}
        <div className="w-full md:w-1/2">
          <div className="container mx-auto mt-10 mb-5 flex items-center">
            <div className=" px-3 ">
              <p className={styles.description}>{description}</p>
              <h2 className={styles.headline}>{headline}</h2>
              <div className={styles.BulletParent}>
                <div className="flex flex-wrap items-center">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      class="w-full sm:w-1/2 md:w-1/2 flex flex-col p-2"
                    >
                      <div className={styles.icon}>
                      {item.icon === "FaGlobe" && <FaGlobe />}
                      {item.icon === "MdOutlinePeople" && <MdOutlinePeople />}
                        {item.icon === "MdOutlineAccessTime" && <MdOutlineAccessTime />}
                        {item.icon === "MdOutlineMedicalServices" && <MdOutlineMedicalServices />}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">
                        {item.headline}
                      </h3>
                      <p
                        style={{
                          color: theme.content,
                        }}
                      >
                        {item.description}
                      </p>
                      <a
                        style={{
                          textDecoration: "none",
                          cursor:"pointer",
                          color: theme.mainAccentDark,
                        }}
                        // href={item.link || "#"}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        onClick={() => handleNavigation(item.link)}
                      >
                        <div style={{ display: "flex" }}>
                          <p> More about this</p>{" "}
                          <FaChevronRight
                            style={{ marginLeft: 10, marginTop: 5 }}
                          />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Image with shadow/reflection */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className={styles.imageWrapper}>
            <Image loading="lazy" width={100} height={100} src={media && media?.startsWith('https') ? media : defaultMedia.src} alt="Right Section" className="img-fluid h-auto w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBigImage;
