"use client";
import { useState, useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/swiper-bundle.css";
import {
  FaChevronRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import styles from "./ReviewSlider.module.css";
import HeadingTopDiscription from "../HeadingTopDiscription";
import invertedComma from "../../../public/assets/images/straightSmile/invertedComma.png";
import { useTheme } from "../../context/ThemeContext";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const ReviewSlider = ({ userReviews = [], headline, description }) => {
  const theme = useTheme();
  const swiperRef = useRef(null);
  const [isDisabled, setIsDisabled] = useState(false);

  if (!userReviews.length) {
    return (
      <Container className={styles.ReviewContainer}>
        <HeadingTopDiscription headline={headline} description={description} />
        <p>No user review to display at the moment.</p>
      </Container>
    );
  }

  // Define the background colors for each slide
  const colors = ["#EEF1F9", "#FAF7EF", "#F0F8F9"];

  const handleSlideChange = (swiper) => {
    setIsDisabled(swiper.isEnd || swiper.isBeginning); // Disable buttons when at the beginning or end
  };

  useEffect(() => {
    const swiper = swiperRef.current.swiper;
    swiper.on("slideChange", handleSlideChange);

    swiper.update()
    return () => {
      swiper.off("slideChange", handleSlideChange);
    };
  }, []);

  return (
    <div
      style={{
        paddingBottom: "40px",
      }}
    >
      {/* <Container> */}
      {/* <div className="max-md:container"> */}
        <HeadingTopDiscription headline={headline} description={description} />
        <div className={styles.ReviewContainer}>
          <Swiper
            ref={swiperRef}
            // slidesPerView={3.6} // Show 3 full slides and part of the next
            centeredSlides={true} // Center the active slide
            initialSlide={0} // Set the default active slide to the 4th (index starts at 0)
            loop={true} // Enable infinite loop
            observer={true}
            observeParents={true}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 10 }, // On smaller screens
              500: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1300: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            navigation={{
              nextEl: ".swiper-button-next-review",
              prevEl: ".swiper-button-prev-review",
            }}
            modules={[Navigation]}
            className={styles.swiperContainer}
          >
            {userReviews.map((item, index) => {
              const backgroundColor = colors[index % colors.length];

              return (
                <SwiperSlide key={item.id} className={styles.SlideParent}>
                  <Container
                    style={{
                      marginBottom: 20,
                      textAlign: "center",
                      backgroundColor: backgroundColor,
                      padding: 15,
                      borderRadius: 15,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      minHeight: "320px",
                    }}
                  >
                    <Image
                    width={100} height={100}
                      className={styles.commaSvg}
                      style={{ maxWidth: "23px" }}
                      src={invertedComma.src}
                      alt="Big Left"
                    />
                    <p className={`"pt-2 ${styles.description}`}>
                      {item.description.split(" ").slice(0, 20).join(" ")}
                      {item.description.split(" ").length > 20 && "..."}
                    </p>
                    <hr className="border-t border-gray-300" />
                    <div className={styles.reviewerParent}>
                      <div className={styles.reviewerDetail}>
                        <div style={{ display: "flex" }}>
                          <Image
                          width={100} height={100}
                            src={item && item.reviewerImage?.startsWith('https') ? item.reviewerImage : defaultMedia.src}
                            alt="reviewwer"
                            className="w-12 h-12 rounded-full border-2 border-white bg-black"
                          />
                          <div style={{ textAlign: "left", marginLeft: "10px" }}>
                            <h6 className={styles.name}>{item.reviewerName}</h6>
                            <p className={styles.desigination}>{item.desigination}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.readMore}>
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
                          <p> Read More</p>{" "}
                          <FaChevronRight style={{ marginLeft: 10, marginTop: 5 }} />
                        </div>
                      </a>
                    </div>
                  </Container>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {userReviews.length > 4  && (
            <div
              style={{
                // textAlign: "center",
                // display: "flex",
                // justifyContent: "center",
                marginTop: 20,
              }}
              className={`${styles.ReviewNavigation} ReviewSlider`}
            >
              <div
                className={`${styles.navigationButtonPrev} swiper-button-prev-review`}
                style={{
                  // pointerEvents: isDisabled ? "none" : "auto", // Disable prev button if at the start
                }}
              />
              <div
                className={`${styles.navigationButtonNext} swiper-button-next-review`}
                style={{
                  // pointerEvents: isDisabled ? "none" : "auto", // Disable next button if at the end
                }}
              />
            </div>
          )}
        </div>
      {/* </div> */}
      {/* </Container> */}
    </div>
  );
};

export default ReviewSlider;
