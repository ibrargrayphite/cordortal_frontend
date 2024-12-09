import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from "./HoursOfOperation.module.css";

const HoursOfOperation = ({ hoursData = [],lunchTime }) => {

  return (
    <Container style={{ paddingBottom: 25 }}>
      <h2 className={styles.heading}>Clinic Hours</h2>
      {hoursData.map(({ day, time }, index) => (
        <Row key={index} className="py-2">
          <Col xs={6} sm={4}>
            <strong>{day}:</strong>
          </Col>
          <Col xs={6} sm={8}>
            {time}
          </Col>
        </Row>
      ))}
      <Row className="mt-3">
        <Col xs={12} className={styles.closed}>
          <strong>Closed for lunch:</strong> {lunchTime}
        </Col>
      </Row>
    </Container>
  );
};

export default HoursOfOperation;
