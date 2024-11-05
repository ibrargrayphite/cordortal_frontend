import React from 'react';
import { Container } from 'react-bootstrap';
import styles from "./html.module.css"

const HtmlContent = ({ htmlContent }) => {
  return (
    <Container>
    <div className={styles.content} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </Container>
  );
};

export default HtmlContent;
