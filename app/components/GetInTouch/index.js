
"use client";
import { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./GetInTouch.module.css";
import defaultMedia from "../../../public/assets/images/getBackground.jpeg";

const GetInTouch = ({headline,media}) => {
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia?.src;
  // Form state variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [message, setMessage] = useState("");

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
    setEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (!/^\+?\d*$/.test(value)) {
      return; // Prevent invalid characters
    }
    setPhoneNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const emailError = validateEmail(email);
    const phoneError = validatePhoneNumber(phoneNumber);

    setEmailError(emailError);
    setPhoneError(phoneError);

    if (!emailError && !phoneError) {
      // Success case
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
          toast.success("Form submitted successfully!", {
            position: "top-right",
          });
          // Clear form
          setFirstName("");
          setLastName("");
          setPhoneNumber("");
          setEmail("");
          setMessage("");
        } else {
          toast.error("Error submitting form. Please try again.", {
            position: "top-right",
          });
        }
      } catch (error) {
        toast.error("Error submitting form. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <Container fluid className={styles.getInTouchContainer}>
        <Row className="justify-content-center">
          <Col xs={12} md={8} className={styles.imageCol}>
            <img
              className={styles.backgroundImage}
              src={mediaSource}
              alt="Get Background"
            />
            <div className={styles.formOverlay}>
              <p className={styles.formHeading}>{headline}</p>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Control
                      className={styles.inputText}
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Control
                      className={styles.inputText}
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
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
                  <Form.Group as={Col} md={6}>
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
                </Row>
                <Form.Control
                  className={styles.textArea}
                  as="textarea"
                  placeholder="Type here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ height: "130px" }}
                />
                <div className={styles.buttonContainer}>
                  <button className={styles.button} type="submit">
                    Submit
                  </button>
                </div>
              </Form>
            </div>
          </Col>
          <Col xs={12} md={2}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default GetInTouch;
