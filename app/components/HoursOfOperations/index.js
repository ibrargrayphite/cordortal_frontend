import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from "./HoursOfOperation.module.css";

const hoursData = [
  { day: "Monday", time: "8:30 am - 6:00 pm" },
  { day: "Tuesday", time: "8:30 am - 6:00 pm" },
  { day: "Wednesday", time: "8:30 am - 6:00 pm" },
  { day: "Thursday", time: "8:30 am - 4:30 pm" },
  { day: "Friday", time: "8:30 am - 4:30 pm" },
//   { day: "Saturday", time: "Closed" },
//   { day: "Sunday", time: "Closed" },
];

const HoursOfOperation = () => {
  return (
    <Container style={{paddingBottom:25}}>
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
          <strong >Closed for lunch:</strong> 12:30 pm - 1:15 pm
        </Col>
      </Row>
    </Container>
  );
};

export default HoursOfOperation;
