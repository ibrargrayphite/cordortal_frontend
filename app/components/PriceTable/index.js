"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./PriceTable.module.css"; 
import CustomButton from "../CustomButton";
import Link from "next/link";

const PriceTable = ({ Package = false, data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openItemIndex, setOpenItemIndex] = useState(null);
  const navItemRefs = useRef([]);
  const contentRefs = useRef([]);
  const indicatorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const updateIndicatorPosition = () => {
        if (indicatorRef.current && navItemRefs.current[selectedIndex]) {
          const navItem = navItemRefs.current[selectedIndex];
          const navItemRect = navItem.getBoundingClientRect();
          const rightColumn = navItem.closest(`.${styles.tableWrapper}`)?.querySelector(`.${styles.rightColumn}`);
          
          if (rightColumn) {
            const rightColumnRect = rightColumn.getBoundingClientRect();
            const navItemTop = navItemRect.top - rightColumnRect.top;
            const navItemCenter = navItemTop + navItemRect.height / 2;
            
            indicatorRef.current.style.top = `${navItemCenter - 12}px`;
          }
        }
      };

      updateIndicatorPosition();
      window.addEventListener('resize', updateIndicatorPosition);
      
      return () => {
        window.removeEventListener('resize', updateIndicatorPosition);
      };
    }
  }, [selectedIndex, isMobile]);

  useEffect(() => {
    // Update height when content changes or item opens/closes
    if (isMobile) {
      // First, close all items that are not the current openItemIndex
      contentRefs.current.forEach((ref, index) => {
        if (ref && index !== openItemIndex) {
          ref.style.height = '0px';
        }
      });
      
      // Then, if there's an open item, set its height
      if (openItemIndex !== null && contentRefs.current[openItemIndex]) {
        const contentElement = contentRefs.current[openItemIndex];
        const contentWrapper = contentElement.querySelector(`.${styles.contentWrapper}`);
        
        if (contentWrapper) {
          // Temporarily set height to auto to get the actual height
          contentElement.style.height = 'auto';
          const height = contentWrapper.scrollHeight;
          contentElement.style.height = `${height}px`;
        }
      }
    }
  }, [openItemIndex, isMobile]);

  const handleNavItemClick = (index) => {
    if (isMobile) {
      // Toggle accordion on mobile - only one open at a time
      setOpenItemIndex(prev => prev === index ? null : index);
    } else {
      // Change selection on desktop
      setSelectedIndex(index);
    }
  };

  const handleIconClick = (e, index) => {
    e.stopPropagation();
    if (isMobile) {
      // Toggle accordion on mobile - only one open at a time
      setOpenItemIndex(prev => prev === index ? null : index);
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  const selectedItem = data[selectedIndex];

  const renderContent = (item) => {
    if (Package) {
      return (
        <>
          <h2 className={styles.contentHeading}>{item.headline}</h2>
          {item.packagePrice && (
            <p className={styles.contentPricing}>{item.packagePrice}</p>
          )}
          {item.description && (
            <p className={styles.contentDescription}>{item.description}</p>
          )}
          {item.packageDetail && (
            <p className={styles.packageDetail}>{item.packageDetail}</p>
          )}
          {item.src && (
            <div className={styles.buttonWrapper}>
              <Link href={item.src} target="_blank">
                <CustomButton
                  headline="Get Started"
                  className={styles.customButton}
                />
              </Link>
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          {item.services && item.services.length > 0 && (
            <div className={styles.servicesList}>
              {item.services.map((service, i) => (
                <div key={i} className={styles.serviceItem}>
                  <p className={styles.serviceDetail}>
                    <span dangerouslySetInnerHTML={{ __html: service.serviceName }}/>
                    {service.servicePrice && (
                      <>
                        <span dangerouslySetInnerHTML={{ __html: ": " }}/>
                        <span className={styles.servicePricing}>
                          {service.servicePrice}
                        </span>
                      </>
                    )}
                    {service.serviceFor && (
                      <span> {service.serviceFor}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
          {item.src && (
            <div className={styles.buttonWrapper}>
              <Link href={item.src} target="_blank">
                <CustomButton
                  headline="Get Started"
                  className={styles.customButton}
                />
              </Link>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        {/* Left Column - Navigation */}
        <div className={styles.leftColumn}>
          {data.map((item, index) => {
            const isOpen = isMobile ? openItemIndex === index : selectedIndex === index;
            const isActive = !isMobile && selectedIndex === index;
            
            return (
              <div key={index}>
                <div
                  ref={el => navItemRefs.current[index] = el}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={() => handleNavItemClick(index)}
                >
                  {/* Plus/Minus Icon - Mobile Only */}
                  {isMobile && (
                    <span 
                      className={styles.toggleIcon}
                      onClick={(e) => handleIconClick(e, index)}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  )}
                  <span className={styles.navItemText}>{item.headline}</span>
                </div>
                
                {/* Content - Mobile: Accordion, Desktop: Right Column */}
                {isMobile && (
                  <div 
                    ref={el => contentRefs.current[index] = el}
                    className={`${styles.mobileContent} ${isOpen ? styles.mobileContentOpen : ''}`}
                  >
                    <div className={styles.contentWrapper}>
                      {renderContent(item)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column - Content (Desktop Only) */}
        {!isMobile && (
          <div className={styles.rightColumn}>
            {/* Active Indicator - Attached to left wall */}
            <div ref={indicatorRef} className={styles.activeIndicator}></div>
            
            <div key={selectedIndex} className={styles.contentWrapper}>
              {renderContent(selectedItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceTable;