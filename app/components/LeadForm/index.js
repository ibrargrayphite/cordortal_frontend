"use client"; 
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <form onSubmit={handleBooking} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              className={`w-full ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              required
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`w-full ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              required
            />
            {phoneError && (
              <p className="text-sm text-red-600 mt-1">{phoneError}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium text-gray-700">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            type="submit"
            variant="customButton"
            size="lg"
            className="px-8 py-3 min-w-[120px]"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
