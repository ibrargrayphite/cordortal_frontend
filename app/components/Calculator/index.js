"use client";
import { useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import styles from "./Calculator.module.css";

const FinanceCalculator = ({ noBgColor }) => {
  const [amount, setAmount] = useState(1000);
  const [error, setError] = useState("");
  const [selectedMonths, setSelectedMonths] = useState(3);
  let credit = 0;
  if (amount >= 250 && amount <= 30000) {
    credit = amount / selectedMonths;
  } else {
    credit = 0;
  }
  const handleAmount = (e) => {
    const value = e.target.value.trim();

    // Regular expression to check if input contains only numbers
    if (!/^\d*$/.test(value)) {
      return; // Do not update the state if it contains non-numeric characters
    }

    // Prevent input if it starts with "0" and is not "0"
    if (value === "0" || (value.length > 1 && value[0] === "0")) {
      return; // Do not update the state
    }

    setAmount(value); // Update the amount if it passes all checks

    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      setError("Please enter a valid number");
    } else if (numericValue < 250 || numericValue > 30000) {
      setError("Please enter an amount between £250 and £30,000");
    } else {
      setError("");
    }
  };

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={8}>
            <h1 className={styles.heading2}>Finance calculator</h1>
            <p className={styles.text}>Enter the amount you wish to finance*</p>
            <Row>
              <Col lg={3} />
              <Col lg={6}>
                <Form style={{ marginTop: 40 }}>
                  <Form.Group controlId="financeAmount">
                    <Form.Control
                      className={styles.inputText}
                      value={amount > 1000000 ? 0 : amount}
                      onChange={handleAmount}
                      type="text"
                      placeholder="Enter Amount"
                    />
                  </Form.Group>
                  {error && (
                    <p style={{ color: "red" }} className="mt-2">
                      {error}
                    </p>
                  )}
                </Form>
              </Col>
              <Col lg={3} />
            </Row>
            <p className={styles.text}>Select the number of monthly payments</p>
            <Row>
              <Col lg={3} />
              <Col lg={6}>
                <div
                  className="d-flex justify-content-center mt-4 mb-4"
                  style={{ background: "F5F5F5" }}
                >
                  {[3, 6, 10, 12].map((month) => (
                    <button
                      key={month}
                      className={
                        selectedMonths === month
                          ? styles.buttonActive
                          : styles.button
                      }
                      onClick={() => setSelectedMonths(month)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </Col>
              <Col lg={3} />
            </Row>
            <Card className={styles.calculationCard}>
              <Card.Body className="text-center mt-4">
                <Card.Title className={styles.perMonth}>
                  £{credit.toFixed(2)} Per Month
                </Card.Title>
                <Row style={{ marginTop: 40 }}>
                  <Col>
                    <Card.Text>
                      <strong className={styles.cardTitle}>
                        INTEREST (APR)
                      </strong>
                      <br />
                      <p className={styles.cardValue}>0.0% (0.0%)</p>
                      <p style={{ color: "#0A1721", fontSize: 12 }}>Fixed</p>
                    </Card.Text>
                  </Col>
                  <Col>
                    <Card.Text>
                      <strong className={styles.cardTitle}>
                        COST OF CREDIT
                      </strong>
                      <br />
                      <p className={styles.cardValue}>£0.00</p>
                    </Card.Text>
                  </Col>
                  <Col>
                    <Card.Text>
                      <strong className={styles.cardTitle}>
                        TOTAL TO PAY BACK
                      </strong>
                      <br />
                      <p className={styles.cardValue}>
                        £{amount >= 250 && amount <= 30000 ? amount : 0}
                      </p>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FinanceCalculator;
