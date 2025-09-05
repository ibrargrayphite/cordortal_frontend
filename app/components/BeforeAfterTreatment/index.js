"use client";
import React from 'react';
import styles from './BeforeAfterTreatment.module.css';
import Image from "next/image";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

const BeforeAfterTreatment = ({ mediaBefore, mediaAfter, noBgColor }) => {
  const mediaSourceBefore = mediaBefore && mediaBefore?.startsWith('https') ? mediaBefore : defaultMedia.src;
  const mediaSourceAfter = mediaAfter && mediaAfter?.startsWith('https') ? mediaAfter : defaultMedia.src;

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <div className={`container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto ${styles.beforeAfterContainer}`}>
        <div className="flex flex-wrap justify-center">
          <div className={`px-3 w-full md:w-1/3 ${styles.imageContainer}`}>
            <div className={styles.imageWrapper}>
              <Image loading="lazy" src={mediaSourceBefore} width={100} height={100} alt="Before treatment image highlighting teeth discoloration and gaps" className={styles.imgFluid} />
              <div className={styles.overlayText}>Before</div>
            </div>
          </div>

          {/* After Image */}
          <div className={`px-3 w-full md:w-1/3 ${styles.imageContainer}`}>
            <div className={styles.imageWrapper}>
              <Image loading="lazy" src={mediaSourceAfter} width={100} height={100} alt="After treatment image showcasing whiter teeth and closed gaps" className={styles.imgFluid} />
              <div className={styles.overlayText}>After</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterTreatment;
