
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container } from "react-bootstrap";
import "swiper/css";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import styles from "./Carousel.module.css";
import nextIcon from "../../../public/assets/images/slider/next.png";
import previousIcon from "../../../public/assets/images/slider/previous.png";
import { useRouter,usePathname } from "next/navigation";
import CustomButton from "../CustomButton";
import Image from 'next/image';

const Carousel = ({ media }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(2);
  const [data, setData] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setData(media);
    iframeRefs.current = iframeRefs.current.slice(0, data.length);
  }, [data]);

  const iframeRefs = useRef([]);
  const resetIframes = () => {
    iframeRefs.current.forEach((iframe) => {
      iframe.pause();
      iframe.currentTime = 0;
    });
  };

  const next = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
    setActiveSlide((prevActiveSlide) => {
      const nextSlide = (prevActiveSlide + 1) % data.length;
      resetIframes();
      return nextSlide;
    });
  };

  const prev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    setActiveSlide((prevActiveSlide) => {
      const prevSlide = (prevActiveSlide - 1 + data.length) % data.length;
      resetIframes();
      return prevSlide;
    });
  };

  useEffect(() => {
    iframeRefs.current.forEach((iframe, index) => {
      if (iframe) {
        iframe.controls = index === activeIndex;
      }
    });
  }, [activeIndex]);

  const getStyles = (index) => {
    const distance = index - activeIndex;
    if (distance === 0) {
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px)",
        zIndex: 10,
      };
    } else if (Math.abs(distance) === 1) {
      return {
        opacity: 1,
        transform: `translateX(${distance * 240}px) translateZ(-400px)`,
        zIndex: 9,
      };
    } else {
      return {
        opacity: 0,
        transform: `translateX(${distance * 240}px) translateZ(-500px)`,
        zIndex: 8,
      };
    }
  };

  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef?.current) {
      const swiperInstance = swiperRef?.current?.swiper;
      swiperInstance?.on("slideChange", () => {
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
          video.pause();
          video.currentTime = 0;
        });
      });
    }
  }, []);

  useEffect(() => {
    if (swiperInstance) {
      const handleSlideChange = () => {
        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
          video.pause();
          video.currentTime = 0;
        });
      };
      swiperInstance.on("slideChange", handleSlideChange);
      return () => {
        swiperInstance.off("slideChange", handleSlideChange);
      };
    }
  }, [swiperInstance]);

  const handleShowmore = () => {
    router.push("/testimonials");
  };

  return (
    <Container style={{ overflowX: "hidden", overflowY: "hidden" }}>
      <div className={styles.mobileCarousal}>
        <Swiper
          style={{ marginTop: 35 }}
          slidesPerView={1}
          onSwiper={setSwiperInstance}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation
          modules={[Navigation]}
          className="mySwiper"
          id="swip"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index} style={{ textAlign: "center" }}>
              <video
                controls
                autoPlay
                muted
                className={styles.iframe}
              >
                <source src={item?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.desktopCarousal}>
        <div className={styles.slideC}>
          {data.map((item, i) => (
            <React.Fragment key={item.id}>
              <div className={styles.slide} style={{ ...getStyles(i) }}>
                <SliderContent
                  ref={(el) => (iframeRefs.current[i] = el)}
                  controls={i === activeIndex}
                  {...item}
                />
              </div>
              <div className={styles.reflection} style={{ ...getStyles(i) }} />
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "relative" }}>
           <Image
           loading="lazy"
        src={previousIcon}
        alt="Previous button to view earlier testimonials"
        className={styles.prevIcon}
        onClick={prev}
      />
        </div>
        <div style={{ position: "relative" }}>
        <Image
        loading="lazy"
        src={nextIcon}
        alt="Next button to view more testimonials"
        className={styles.nextIcon}
        onClick={next}
      />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        {pathname !== "/testimonials" && (
          <CustomButton headline="Show More" onClick={handleShowmore} />
        )}
      </div>
    </Container>
  );
};

const SliderContent = React.forwardRef(({ controls, ...props }, ref) => (
  <div style={{ cursor: "pointer", marginTop: 645 }}>
    <div onClick={(e) => e.stopPropagation()}>
      <video
        ref={ref}
        controls={controls}
        muted
        style={{ borderRadius: 35 }}
        className={styles.iframe}
      >
        <source src={props?.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
));

export default Carousel;
