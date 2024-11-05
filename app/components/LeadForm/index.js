"use client"; 
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import styles from "./LeadForm.module.css";
import { ToastContainer, toast } from "react-toastify";

const LeadForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (email.includes("..")) {
      return "Email address cannot contain consecutive dots.";
    }
    return "";
  };

  const validatePhoneNumber = (number) => {
    const regex = /^(?:0|\+44)(?:\d\s?){9,10}$/;
    if (!regex.test(number)) {
      return "Please enter a valid UK phone number.";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!/^\+?\d*$/.test(value)) {
      return; // Prevent invalid characters
    }
    setPhoneNumber(value);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const phoneError = validatePhoneNumber(phoneNumber);

    setEmailError(emailError);
    setPhoneError(phoneError);

    if (!emailError && !phoneError) {
      try {
        const response = await fetch(
          "http://micarepoc.grayphite.com/api/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              phone: phoneNumber,
              email: email,
              message: message,
              company_email: "huddsdental@outlook.com",
            }),
          }
        );

        if (response.ok) {
          // Show success toast message
          toast.success("Booking submitted successfully!", {
            position: "top-right",
          });

          // Clear the form fields after successful submission
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
          setEmail("");
          setMessage("");
        } else {
          toast.error("Error submitting booking. Please try again.", {
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error("Error submitting booking. Please try again.", {
          position: "top-center",
        });
      }
    }
  };
  return (
    <div>
      <Container>
        <ToastContainer />
        <Form className={styles.formContainer}>
          <Row>
            <Col lg={6} sm={12} style={{ marginTop: 24 }}>
              <Form.Group>
                <Form.Control
                  className={styles.inputText}
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} style={{ marginTop: 24 }}>
              <Form.Group>
                <Form.Control
                  className={styles.inputText}
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12} style={{ marginTop: 24 }}>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Control
                  className={styles.inputText}
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                  isInvalid={!!emailError}
                />
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} style={{ marginTop: 24 }}>
              <Form.Group as={Col}>
                <Form.Control
                  className={styles.inputText}
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  isInvalid={!!phoneError}
                />
                <Form.Control.Feedback type="invalid">
                  {phoneError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Control
            className={styles.inputText}
            as="textarea"
            placeholder="Type here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ height: "268px", marginTop: 24 }}
          />
          <div style={{ textAlign: "center", marginTop: 41 }}>
            <button className={styles.button} onClick={handleBooking}>
              Submit
            </button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default LeadForm;
