import React from 'react';
import styles from "./HoursOfOperation.module.css";

const HoursOfOperation = ({ hoursData = [],lunchTime }) => {

  return (
    <div className="container mx-auto" style={{ paddingBottom: 25 }}>
      <h2 className={styles.heading}>Clinic Hours</h2>
      {hoursData.map(({ day, time }, index) => (
        <div key={index} className="flex flex-wrap py-2">
          <div className='w-1/2 sm:w-1/3'>
            <strong>{day}:</strong>
          </div>
          <div className='w-1/2 sm:w-2/3'>
            {time}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap mt-3">
        <div className={`w-full ${styles.closed}`}>
          <strong>Closed for lunch:</strong> {lunchTime}
        </div>
      </div>
    </div>
  );
};

export default HoursOfOperation;
