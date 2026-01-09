"use client";

import React from 'react';
import styles from "./HoursData.module.css";
import { useLocation } from '../../context/LocationContext';

const HoursData = ({ hoursData: propHoursData, lunchTime: propLunchTime }) => {
  // Get data from location context
  const locationContext = useLocation();
  
  // Use props if provided (backward compatibility), otherwise use context
  const hoursData = propHoursData ?? locationContext?.hoursData ?? [];
  const lunchTime = propLunchTime ?? locationContext?.lunchTime ?? '';
  const specialHours = locationContext?.specialHours ?? [];

  // Check if today has special hours
  const today = new Date().toISOString().split('T')[0];
  const todaySpecial = specialHours.find(sh => sh.date === today);

  // Get current day name
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  return (
    <div className={`${styles.hoursContainer} max-w-5xl mx-2 md:mx-4 lg:mx-auto my-4 md:my-10 lg:my-12`}>
      <div className={styles.headerSection}>
        <div className={styles.iconWrapper}>
          <svg className={styles.clockIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className={styles.heading}>Clinic Hours</h2>
      </div>
      
      {/* Special hours alert for today */}
      {todaySpecial && (
        <div className={styles.specialAlert}>
          <div className={styles.alertIcon}>⚠️</div>
          <div className={styles.alertContent}>
            <strong className={styles.alertLabel}>{todaySpecial.label}:</strong>
            <span className={styles.alertTime}>{todaySpecial.time}</span>
          </div>
        </div>
      )}
      
      <div className={styles.hoursList}>
        {hoursData?.map(({ day, time }, index) => {
          const isToday = day.toLowerCase().includes(currentDay.toLowerCase());
          return (
            <div 
              key={index} 
              className={`${styles.hoursItem}`}
            >
              <div className={styles.dayColumn}>
                <span className={styles.dayName}>{day}</span>
                {/* {isToday && <span className={styles.todayBadge}>Today</span>} */}
              </div>
              <div className={styles.timeColumn}>
                <span className={styles.timeText}>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {lunchTime && (
        <div className={styles.lunchSection}>
          <div className={styles.lunchIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.lunchContent}>
            <span className={styles.lunchLabel}>Closed for lunch:</span>
            <span className={styles.lunchTime}>{lunchTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoursData;