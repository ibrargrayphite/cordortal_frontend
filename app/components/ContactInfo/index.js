"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ContactInfo.module.css';
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import locationIcon from "../../../public/assets/images/footer/location.png";
import phoneIcon from "../../../public/assets/images/footer/phone.png";
import emailIcon from "../../../public/assets/images/footer/emailIcon.png";

export default function ContactInfo({ email, phone, address, media, addressMedia, phoneMedia, emailMedia }) {
  console.log('media======>>>>', media, email, phone, address);
  const router = useRouter();

  return (
    <div className={`${styles.footerContactCard} lg:absolute xs:relative xs:right-0 lg:right-[-150px] lg:mr-[200px] max-lg:m-auto` }>
      <Image
      loading="lazy"
        src={media && media?.startsWith('https') ? media : defaultMedia.src}
        width={100}
        height={100}
        alt="Best Dental Care Nearest To You"
        className={styles.brandLogo}
        onClick={() => router.push('/')}
      />
      <div className="mt-2" />
      
      {/* Address Section */}
      <div className={styles.address}>
        <div style={{ display: 'flex', gap: 15 }}>
          <div>
            <Image 
              loading="lazy" 
              src={addressMedia && addressMedia?.startsWith('https') ? addressMedia : locationIcon.src} 
              alt={`You can reach us ${address}`}  
              width={100} 
              height={100} 
              className={styles.cardIcons} 
            />
          </div>
          <div style={{ marginTop: 2 }}>
            <p className={styles.contactCardHeading}>Address</p>
            <span className={styles.addressDetails}>{address}</span>
          </div>
        </div>
      </div>

      {/* Phone Section */}
      <div className={styles.address}>
        <div style={{ display: 'flex', gap: 15 }}>
          <div>
            <Image 
              loading="lazy" 
              src={phoneMedia && phoneMedia?.startsWith('https') ? phoneMedia : phoneIcon.src} 
              alt={`You can contact us on ${phone}`}  
              width={100} 
              height={100} 
              className={styles.cardIcons} 
            />
          </div>
          <div style={{ marginTop: 2 }}>
            <p className={styles.contactCardHeading}>Phone</p>
            <span className={styles.addressDetails}>{phone}</span>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className={styles.address}>
        <div style={{ display: 'flex', gap: 15 }}>
          <div>
            <Image 
              loading="lazy" 
              src={emailMedia && emailMedia?.startsWith('https') ? emailMedia : emailIcon.src} 
              alt={`You can email us at ${email}`}  
              width={100} 
              height={100} 
              className={styles.cardIcons} 
            />
          </div>
          <div style={{ marginTop: 2 }}>
            <p className={styles.contactCardHeading}>Email</p>
            <span className={styles.addressDetails}>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
