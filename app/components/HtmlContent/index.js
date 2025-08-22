import React from 'react';
import styles from "./html.module.css"

const HtmlContent = ({ htmlContent }) => {
  return (
    <div className='mt-5 container mx-auto'>
    <div className={styles.content} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default HtmlContent;
