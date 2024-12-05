import React from 'react';
import { Container } from 'react-bootstrap';
import styles from "./html.module.css"

const HtmlContent = ({ htmlContent }) => {
  return (
    <Container className='mt-5'>
    <div className={styles.content} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </Container>
  );
};

export default HtmlContent;
