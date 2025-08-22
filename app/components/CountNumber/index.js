"use client";
import React from "react";
import CountUp from "react-countup";
import styles from "./CountNumber.module.css";

const CountNumber = ({ data }) => {
  return (
    <div className="relative -mt-20 mb-20 z-10 container mx-auto">
      <div className={styles.container}>
        {data.map((item, index) => (
          <div key={item.name} className={styles.card}>
            {index !== 0 && (
            <div
              className="bg-gray-400 mx-auto lg:block hidden"
              style={{ width: "0.10rem", height: "1rem", marginRight: "30px!important" }}
            ></div>
            )}
            <h2 className={`${styles.count} fixed-width`}>
              <CountUp start={0} end={item.count} duration={2.5} />
            </h2>
            <p className={styles.name}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountNumber;
