"use client";
import React from "react";
import styles from "./BillingCardOffer.module.css";
import { useTheme } from "../../context/ThemeContext";
import CustomButton from "../CustomButton";

const BillingCardOffer = ({ data }) => {
  const theme = useTheme();
  const handlePrimaryAction = () => {
    router.push("/services"); // Use Next.js router for navigation
  };

  return (
    <div class="max-w-6xl max-lg:max-w-xl mx-auto">
      <div class="grid lg:grid-cols-3 items-center mt-12 max-sm:max-w-sm max-sm:mx-auto">
        {data.map((offer, index) => (
          <div
            key={index}
            className={`${index === 1 ? styles.centerCard : index === 0 ? styles.smallCardRight : styles.smallCardLeft}`}
            style={{
              background: index === 1 ? theme.mainAccentDark : "",
            }}
          >
            <h2 class="text-lg font-bold">{offer.name}</h2>
            <h3>{offer.price}</h3>
            <p style={{ color: theme.content }}>{offer.duration}</p>
            <ul>
              {offer.offerPoint.map((point, i) => (
                <li key={i}>
                  {point}
                  {i !== offer.offerPoint.length - 1 && (
                    <hr className="border-t border-gray-300" />
                  )}
                </li>
              ))}
            </ul>
            <div className="flex justify-center">
              <CustomButton
                headline="Get Now"
                onClick={handlePrimaryAction}
                className={index === 1 ? styles.customButtonCenterCard : styles.customButton}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingCardOffer;
