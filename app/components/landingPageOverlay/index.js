"use client";
import { Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import CustomButton from "../CustomButton";
import { useTheme } from "../../context/ThemeContext";
import { usePages } from '../../context/PagesContext'; // Import the usePages hook
import defaultMedia from "../../../public/assets/images/solutions/implants.png";



import styles from "./landingPageOverlay.module.css";

const landingPageOverlay = ({ description , media, headline,headlineLarge,title}) => {
  const theme = useTheme();
  const { pages } = usePages();
  const router = useRouter();

  const handlePrimaryAction = () => {
    router.push("/services");
  };

  const handleSecondaryAction = (src) => {
    window.open(src, "_blank");
  };
  
  return (
    <div
      style={{
        background: theme.mainAccentDark,
        height: "100vh", 
      }}
    >
      <Container className="p-0 d-flex align-items-center" style={{ height: "100%" }}>
        <div className="flex w-100 justify-content-between">
          {/* Left Section */}
          <div className="w-1/2 p-4 d-flex flex-column justify-content-center">
            <div >
              <h1 className={styles.headingTextPrimary}>{headline}
              <span className={styles.bold}>{headlineLarge}</span>
              </h1>
              <h2 className={styles.headingTextPrimary} >{title}</h2>
            </div>
            <p className={styles.descriptionContent}>{description}</p>
            <div className="d-flex">
            <CustomButton
              headline="Book Now"
              onClick={handlePrimaryAction}
              className={styles.customButtonFirst}
            />
            <CustomButton
              headline="Get Started"
              onClick={() => handleSecondaryAction(src)}
              className={styles.customButton}
            />
            </div>
          </div>

          {/* Right Section (Image Cards) */}
          <div className="w-1/2 d-flex ">
            <div className="overflow-hidden rounded-md mr-4 w-full">
              <img
                className="w-full h-70 object-cover rounded-md"
                src={media && media[0].url?.startsWith('https') ? media[0].url : defaultMedia.src}
                alt={`${pages.name} equipment for advanced treatments`}
              />
            </div>
            <div className=" rounded-md mr-4 w-full">
              <img
                className="w-full h-100 object-cover rounded-md"
                src={media && media[1].url?.startsWith('https') ? media[1].url : defaultMedia.src}
                alt={`${pages.name} professionals providing exceptional care`}

              />
            </div>
            <div className=" rounded-md mr-4 w-full d-flex items-end">
              <img
                className="w-full h-70 object-cover rounded-md"
                src={media && media[2].url?.startsWith('https') ? media[2].url : defaultMedia.src}
                alt={`${pages.name} High-quality dental cleaning tools for effective oral care`}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default landingPageOverlay;
