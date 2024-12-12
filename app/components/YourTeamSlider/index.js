"use client";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/swiper-bundle.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import styles from "./YourTeamSlider.module.css";
import HeadingTopDiscription from "../HeadingTopDiscription";
import { useTheme } from "../../context/ThemeContext";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const YourTeamSlider = ({ teamMembers = [], headline, description }) => {
  const theme = useTheme();

  if (!teamMembers.length) {
    return (
      <Container className={styles.teamContainer}>
        <HeadingTopDiscription headline={headline} description={description} />
        <p>No team members to display at the moment.</p>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.bgColor,
        paddingTop: "40px",
        paddingBottom: "40px",
        marginTop: 40,
      }}
    >
      <Container>
        <HeadingTopDiscription headline={headline} description={description} />
        <div className={styles.teamContainer}>
          <Swiper
            slidesPerView={4}
            spaceBetween={0}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 0
                // , direction: "vertical" 
              },
              760: {
                slidesPerView: 2,
                spaceBetween: 0,
                direction: "horizontal",
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 0,
                direction: "horizontal",
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 0,
                direction: "horizontal",
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 0,
                direction: "horizontal",
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Navigation]}
            className={styles.swiperContainerTeam}
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.id} className={styles.SlideParent}>
                <div className={styles.teamImage} >
                  <Image 
                  loading="lazy"
                  width={100} height={100}
                    src={member && member.teamMemberImage?.startsWith('https') ? member.teamMemberImage : defaultMedia.src}
                    className={styles.profileImage}
                    alt={
                      member.teamMemberName
                        ? `Portrait of ${member.teamMemberName}, a ${member.teamMemberSpeciality}`
                        : "Team member"
                    }
                  />
                </div>
                <Container style={{  textAlign: "center" }}>
                  <p className={styles.name}>
                    {member.teamMemberName || "N/A"}
                  </p>
                  <h3 className={styles.title}>
                    {member.teamMemberSpeciality || "Speciality not available"}
                  </h3>
                  {/* Social media icons */}
                  <div className={styles.socialIcons}>
                    <a
                      href={member.facebookLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook className={styles.icon} />
                    </a>
                    <a
                      href={member.instagramLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram className={styles.icon} />
                    </a>
                    <a
                      href={member.twitterLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaTwitter className={styles.icon} />
                    </a>
                  </div>
                </Container>
              </SwiperSlide>
            ))}
            {/* Navigation Buttons */}
          </Swiper>
         {teamMembers.length > 4 && 
         <>
         <div
            className={`${styles.navigationButtonNext} swiper-button-next`}
          />
          <div
            className={`${styles.navigationButtonPrev} swiper-button-prev`}
          />
          </>
          }
        </div>
      </Container>
    </div>
  );
};

export default YourTeamSlider;
