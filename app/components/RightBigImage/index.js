"use client";
import React from "react";
import styles from "./RightBigImage.module.css";
import { Container, Row, Col } from "react-bootstrap";
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

const RightBigImage = ({ headline, description, media, data }) => {
  const theme = useTheme();
  const router = useRouter(); // Use Next.js router

  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center g-0">
        {/* Left Section */}
        <Col xs={12} md={6}>
          <Container className="mt-10 mb-5 flex items-center">
            <div className=" px-3 ">
              <p className={styles.description}>{description}</p>
              <h1 className={styles.headline}>{headline}</h1>
              <div className={styles.BulletParent}>
                <Row>
                  {data.map((item, index) => (
                    <Col
                      key={index}
                      md={6}
                      sm={6}
                      xs={12}
                      className="flex flex-col p-2"
                    >
                      <div className={styles.icon}>
                      {item.icon === "FaGlobe" && <FaGlobe />}
                      {item.icon === "MdOutlinePeople" && <MdOutlinePeople />}
                        {item.icon === "MdOutlineAccessTime" && <MdOutlineAccessTime />}
                        {item.icon === "MdOutlineMedicalServices" && <MdOutlineMedicalServices />}
                      </div>
                      <h1 className="mt-4 text-lg font-semibold">
                        {item.headline}
                      </h1>
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
                          color: theme.mainAccentDark,
                        }}
                        href={item.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div style={{ display: "flex" }}>
                          <p> More about this</p>{" "}
                          <FaChevronRight
                            style={{ marginLeft: 10, marginTop: 5 }}
                          />
                        </div>
                      </a>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </Container>
        </Col>

        {/* Right Section: Image with shadow/reflection */}
        <Col xs={12} md={6} className="d-flex justify-content-center">
          <div className={styles.imageWrapper}>
            <img src={media.src} alt="Right Section" className="img-fluid" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RightBigImage;
