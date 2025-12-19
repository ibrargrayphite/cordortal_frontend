"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import styles from "./MediaOverlay.module.css";
import defaultMedia from "../../../public/assets/video/oaklandslandingPageVideo.mp4"
import defaultMedia2 from "../../../public/assets/images/home/oaklandsSkelton.png"
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/swiper-bundle.css";
import { Autoplay, EffectFade } from "swiper/modules";

const MediaOverlay = ({ media, media2,mediaType, headline, description, style, src, htmlContent, movedTo, slider_images }) => {
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia;
  const mediaSource2 = media2 && media2?.startsWith('https') ? media2 : defaultMedia2;
  const [loading, setLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);

  const router = useRouter();

  

  const handlePrimaryAction = () => {
    router.push("/services");
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };

  // Handle video ready to play
  const handleVideoCanPlay = () => {
    setLoading(false);
  };

  // Handle video error
  const handleVideoError = () => {
    setMediaError(true);
    setLoading(false);
  };

  // For slider, set loading to false once swiper is initialized
  const handleSliderInit = () => {
    setLoading(false);
  };

  const currentDomain = process.env.NEXT_PUBLIC_DOMAIN;
  const shouldBeLink = currentDomain?.includes('bailiffbridgedental') && movedTo;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1">
        <div className="col-span-1 px-0">
            <div
              className={styles.mediaOverlayContainer}
              style={{
                ...style,
                // Keep background image visible when loading OR when mediaType is not video/slider
                backgroundImage: (loading || (mediaType !== "video" && mediaType !== "slider")) 
                  ? `url(${mediaSource2})` 
                  : "none",
                // height: loading || mediaError ? "700px" : "auto",
              }}
            >
            {/* Always visible overlay */}
            <div className={styles.redOverlay}></div>
            {console.log('mediaType===>', mediaType, media2)}
            {mediaType === "video" ? (
  <video
    id="media-element"
    className={styles.media}
    autoPlay
    muted
    playsInline
    loop
    style={{ display: loading ? "none" : "block" }}
    onCanPlay={handleVideoCanPlay}
    onError={handleVideoError}
  >
    <source src={mediaSource} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
            ) : mediaType === "slider" ? (
              slider_images && Array.isArray(slider_images) && slider_images.length > 0 ? (
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  speed={1000}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  className={styles.swiper}
                  onSwiper={handleSliderInit}
                >
                  {slider_images.map((imageUrl, index) => {
                    const imageSrc =
                      imageUrl && imageUrl.startsWith("https") ? imageUrl : mediaSource2;

                    return (
                      <SwiperSlide key={index}>
                        <Image
                          priority={index === 0}
                          width={100}
                          height={100}
                          src={imageSrc}
                          alt={`media ${index + 1}`}
                          className={styles.media}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <Image
                  priority={true}
                  width={100}
                  height={100}
                  id="media-element"
                  src={media2}
                  alt="media"
                  className={styles.media}
                  style={{ display: loading ? "none" : "block" }}
                />
              )
            ) : mediaType === "image" ? (
              // Handle explicit image type
              <Image
                priority={true}
                width={100}
                height={100}
                id="media-element"
                src={mediaSource2}
                alt="media"
                className={styles.media}
                onLoad={() => setLoading(false)}
              />
            ) : null}
            {/* When mediaType is undefined/null, the background image from CSS will show */}


            {/* Overlay Content */}
            <div className={styles.overlayContent}>
              {shouldBeLink ? 
                <h1 className={styles.headingTextPrimary}>
                  <a 
                    href={movedTo} 
                    target="_self" 
                    rel="noopener noreferrer"
                    className={styles.headingLink}
                  >
                    {headline}
                  </a>
                </h1> : 
                <h1 className={styles.headingTextPrimary}>
                  {headline}
                </h1>}
              {/* <h1 className={styles.headingTextSecondary}>
              Live Better
              </h1> */}
              <p className={styles.descriptionContent}>{description}</p>
              <CustomButton
                headline="View Treatments"
                onClick={handlePrimaryAction}
                className={styles.customButtonFirst}
              />
              <CustomButton
                headline="Book an Appointment"
                onClick={() => handleSecondaryAction(src)}
                className={styles.customButton}
              />
              <div
                className={styles.comingSoonText}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaOverlay;
