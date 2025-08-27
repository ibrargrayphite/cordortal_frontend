"use client"
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./CaseStudyCard.module.css";
import HeadingTopDiscription from "../HeadingTopDiscription";
import CustomButton from "../CustomButton";
import defaultMediaVideo from "../../../public/assets/video/oaklandslandingPageVideo.mp4"
import defaultMediaPic from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const CaseStudyCard = ({ data,headline,description }) => {
    const router = useRouter();

    const handlePrimaryAction = () => {
        router.push("/services");
      };
  return (
    <>
    <HeadingTopDiscription headline={headline} description={description} className={styles.h1Width} />
    <div className="container mx-auto">
      {data.map((caseStudy, index) => (
        <div id={caseStudy.slug} key={index} className={`${styles.Card} lg:p-10 mb-5`} style={{ backgroundColor: "#FAF7EF" }}>
          <div className="flex flex-wrap">
            {/* Left Column */}
            <div className="w-full md:w-7/12 flex">
            {/* <video src= */}
            {caseStudy.video && 
            <video
                src={caseStudy.video && caseStudy.video?.startsWith('https') ? caseStudy.video : defaultMediaVideo}
                controls
                autoPlay
                muted
                playsInline
                loop
              style={{objectFit: "cover",width: '100%',height:'100%'}}
            >
            </video>}
              {caseStudy.mediaBefore && 
                <Image 
                loading="lazy"
                width={100} height={100}
                  src={caseStudy.mediaBefore && caseStudy.mediaBefore?.startsWith('https') ? caseStudy.mediaBefore : defaultMediaPic} alt="Before" className={styles.mediaImageBefore} />
              }
              {caseStudy.mediaAfter && 
                <Image 
                loading="lazy"
                width={100} height={100}
                  src={caseStudy.mediaAfter && caseStudy.mediaAfter?.startsWith('https') ? caseStudy.mediaAfter : defaultMediaPic} alt="After" className={styles.mediaImageAfter} />
              }
            </div>
            {/* Right Column */}
            <div className="w-full md:w-5/12 flex">
            <div style={{marginLeft:"20px"}}>
              <h3 className={`${styles.heading} lg:text-[40px] max-md:text-lg`}>{caseStudy.heading}</h3>
              <ul className="mb-3" style={{ listStyleType: "disc", paddingLeft: "20px"}}>
                {caseStudy.bullets.map((bullet, idx) => (
                  <li key={idx} style={{paddingBottom:"10px"}}>{bullet}</li>
                ))}
              </ul>
              <p className={styles.date}>Updated: {caseStudy.date}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap">
      <div className="w-full flex justify-center">
      <CustomButton
                headline="View More"
                onClick={handlePrimaryAction}
                className={styles.customButton}
              />
              </div>
              </div>
    </div>
    </>
  );
};

export default CaseStudyCard;
