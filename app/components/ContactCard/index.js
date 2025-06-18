import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ContactCard.module.css';
import defaultMedia from "../../../public/assets/images/solutions/implants.png";

export default function ContactCard({ data }) {
  const router = useRouter();

  return (
    <div className={`${styles.footerContactCard}  lg:absolute xs:relative xs:right-0 lg:right-[-150px] lg:mr-[200px] max-lg:m-auto` }>
      <Image
      loading="lazy"
        src={data.media && data.media?.startsWith('https') ? data.media : defaultMedia.src}
        width={100}
        height={100}
        alt="Best Dental Care Nearest To You"
        className={styles.brandLogo}
        onClick={() => router.push('/')}
      />
      <div style={{ marginTop: 30 }} />
      
      {/* Address Section */}
      <div className={styles.address}>
        <div style={{ display: 'flex', gap: 15 }}>
          <div>
            <Image loading="lazy" src={data?.addressMedia} alt={`You can reach us ${data.address}`}  width={100} height={100} className={styles.cardIcons} />
          </div>
          <div style={{ marginTop: 2 }}>
            <p className={styles.contactCardHeading}>Address</p>
            <span className={styles.addressDetails}>{data.address}</span>
          </div>
        </div>
      </div>

      {/* Phone Section */}
      <div className={styles.address}>
        <div style={{ display: 'flex', gap: 15 }}>
          <div>
            <Image loading="lazy" src={data?.phoneMedia} alt={`You can contact us on ${data.phone}`}  width={100} height={100} className={styles.cardIcons} />
          </div>
          <div style={{ marginTop: 2 }}>
            <p className={styles.contactCardHeading}>Phone</p>
            <span className={styles.addressDetails}>{data.phone}</span>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className={styles.address}>
        <div style={{ display: 'flex', gap: 15 }}>
          <div>
            <Image loading="lazy" src={data?.emailMedia} alt={`You can email us at ${data.email}`}  width={100} height={100} className={styles.cardIcons} />
          </div>
          <div style={{ marginTop: 2 }}>
            <p className={styles.contactCardHeading}>Email</p>
            <span className={styles.addressDetails}>{data.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
