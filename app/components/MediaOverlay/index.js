"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import styles from "./MediaOverlay.module.css";
import defaultMedia from "../../../public/assets/video/oaklandslandingPageVideo.mp4"
import defaultMedia2 from "../../../public/assets/images/home/oaklandsSkelton.png"
import Image from "next/image";

const MediaOverlay = ({ media, media2,mediaType, headline, description, style, src, htmlContent }) => {
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


  useEffect(() => {
    if (mediaSource) {
      // Only attempt autoplay after the video has loaded
      setLoading(false); // Video has finished loading
    }
  }, [loading]); // Trigger when 'loading' changes to false

  return (
    <div className="w-full">
      <div className="grid grid-cols-1">
        <div className="col-span-1 px-0">
          <div
            className={styles.mediaOverlayContainer}
            style={{
              ...style,
              backgroundImage: loading ? `url(${mediaSource2})` : "none", // Show the image while loading
              // height: loading || mediaError ? "700px" : "auto",
            }}
          >
            {/* Always visible overlay */}
            <div className={styles.redOverlay}></div>
            {mediaType === "video" ? (
              <video
                id="media-element"
                className={styles.media}
                autoPlay
                muted
                playsInline
                loop
                style={{ display: loading ? "none" : "block" }}
                loading="lazy"
              >
                <source src={mediaSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
            )}

            {/* Overlay Content */}
            <div className={styles.overlayContent}>
              <h1 className={styles.headingTextPrimary}>{headline}</h1>
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
