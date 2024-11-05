
"use client";
import React, { useState, useEffect } from 'react';
import styles from './Faq.module.css'; 
import { Container, Row, Col, Card } from 'react-bootstrap';

const Faq = ({ data }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  useEffect(() => {
    setOpenIndexes(data.map((_, index) => index));
  }, [data]);

  const toggleAccordion = (index) => {
    setOpenIndexes((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((i) => i !== index); 
      } else {
        return [...prevIndexes, index]; 
      }
    });
  };

  return (
    <Container className={styles.parentAcordin}>
      <Row className="justify-content-center">
        <Col md={12}>
          {data.map((item, index) => (
            <div className={styles.accordionItem} key={index}>
              <Card
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(index)}
              >
                <h2>
                  {item.headline}
                </h2>
                {/* icon wokring fin just commented we dont need to show look like faq */}
                {/* <span className={styles.arrow}>
                  {openIndexes.includes(index) ? '▲' : '▼'}
                </span> */}
              </Card>
              {openIndexes.includes(index) && (
                <div className={styles.accordionContent}>
                  {typeof item.content === 'string' ? (
                    <p>{item.content}</p> // For single string content
                  ) : (
                    <ol>
                      {item.content.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <strong>{subItem.headline}</strong>: {subItem.content}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Faq;
