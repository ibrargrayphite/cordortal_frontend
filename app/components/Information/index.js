"use client";

import styles from "./Information.module.css";

const Information = ({ headline, heading, description, content }) => {
  return (
    <div className={styles.informationContainer}>
      <div className={`${styles.informationCard} container w-full lg:max-w-[960px] xxl:max-w-[1320px] mx-auto`}>
        {headline && (
          <h2 className={styles.headline} dangerouslySetInnerHTML={{ __html: headline }} />
        )}
        
        {heading && (
          <h3 className={styles.heading} dangerouslySetInnerHTML={{ __html: heading }} />
        )}
        
        {content && content.length > 0 && (
          <ul className={styles.contentList}>
            {content.map((item, index) => (
              <li key={index} className={styles.contentItem}>
                {item}
              </li>
            ))}
          </ul>
        )}
        
        {description && (
          <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
    </div>
  );
};

export default Information;