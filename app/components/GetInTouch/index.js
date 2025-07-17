"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./GetInTouch.module.css";
import defaultMedia from "../../../public/assets/images/getBackground.jpeg";
import Image from "next/image";
import { Input } from "../ui/input";
import CustomButton from "../CustomButton";
import { Button } from "../ui/button";

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
         `${process.env.NEXT_PUBLIC_BASE_URL}/leads/organization/`,
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
              domain:process.env.NEXT_PUBLIC_DOMAIN
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
    <section className="w-full py-16 px-2">
      <ToastContainer />
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-stretch bg-white/95 rounded-2xl shadow-2xl overflow-hidden border border-border">
          {/* Image Side */}
          <div className="relative w-full md:w-1/2 min-h-[320px] md:min-h-[480px]">
            <Image
              src={mediaSource}
              alt="Get Background"
              fill
              className={`object-cover w-full h-full ${styles.getInTouchImage}`}
              style={{ borderRadius: '0', borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
            />
          </div>
          {/* Form Side */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12" style={{backgroundColor: 'var(--main-accent-color)'}}>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-7">
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-main-accent-dark mb-2">{headline}</h2>
                <p className="text-muted-foreground text-base">We'd love to hear from you. Fill out the form and our team will get back to you soon.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-main-accent-dark">First Name</label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    placeholder="First Name"
                    className="no-border-input"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-main-accent-dark">Last Name</label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    placeholder="Last Name"
                    className="no-border-input"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-main-accent-dark">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder="Email"
                    aria-invalid={!!emailError}
                    className="no-border-input"
                  />
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1 text-main-accent-dark">Phone Number</label>
                  <Input
                    id="phone"
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    placeholder="Phone Number"
                    aria-invalid={!!phoneError}
                    className="no-border-input"
                  />
                  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1 text-main-accent-dark">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  placeholder="Type your message..."
                  className="w-full min-h-[110px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-shadow no-border-textarea"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="getInTouchSubmit"
                  onClick={handleSubmit}
                  className="w-full h-12 text-base font-semibold mt-2 shadow-sm"

                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
