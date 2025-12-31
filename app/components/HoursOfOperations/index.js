"use client";

import React from 'react';
import styles from "./HoursOfOperation.module.css";
import { useLocation } from '../../context/LocationContext';

const HoursOfOperation = ({ hoursData: propHoursData, lunchTime: propLunchTime }) => {
  // Get data from location context
  const locationContext = useLocation();
  
  // Use props if provided (backward compatibility), otherwise use context
  const hoursData = propHoursData ?? locationContext?.hoursData ?? [];
  const lunchTime = propLunchTime ?? locationContext?.lunchTime ?? '';
  const specialHours = locationContext?.specialHours ?? [];

  // Check if today has special hours
  const today = new Date().toISOString().split('T')[0];
  const todaySpecial = specialHours.find(sh => sh.date === today);

  return (
    <div className="container mx-auto pb-4">
      <h2 className={styles.heading}>Clinic Hours</h2>
      
      {/* Special hours alert for today */}
      {todaySpecial && (
        <div className={styles.specialAlert}>
          <strong>⚠️ {todaySpecial.label}:</strong> {todaySpecial.time}
        </div>
      )}
      
      {hoursData?.map(({ day, time }, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:flex-wrap py-2">
          <div className='w-full sm:w-1/3 mb-1 sm:mb-0'>
            <strong>{day}:</strong>
          </div>
          <div className='w-full sm:w-2/3 break-words sm:whitespace-nowrap'>
            {time}
          </div>
        </div>
      ))}
      {lunchTime && (
        <div className="flex flex-wrap mt-3 mx-6">
          <div className={`bg-main-accent text-white rounded-full py-2 px-4 ${styles.closed}`}>
            <strong>Closed for lunch:</strong> {lunchTime}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoursOfOperation;
