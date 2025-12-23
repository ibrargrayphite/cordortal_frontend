import styles from "./HeadingWithBgImage.module.css";
import defaultMedia from "../../../public/assets/images/home/SOLUTIONS.png";

const HeadingWithBgImage = ({
  headline,
  media,
  withoutBgImageHeading = false,
  description,
  anchorTextEnd,
  telephoneNumber,
  showAnchorCall = false,
  noBgColor = true,
  headlineLarge = false,
}) => {
  const mediaSource = media && media?.startsWith('https') ? media : defaultMedia.src;

  return (
    <>
      {withoutBgImageHeading ? (
        <div className="container w-full xxl:max-w-[1320px] mx-auto">
          <p
            className={
              headlineLarge ? styles.HeadlineLarge : styles.Headline
            }
            dangerouslySetInnerHTML={{ __html: headline }}
          />
          {(description || showAnchorCall || telephoneNumber || anchorTextEnd) && (
            <div className="flex flex-wrap">
              {/* left spacer */}
              {/* <div className="hidden lg:block flex-1" /> */}

              {/* main content */}
              <div className="w-[95%] mx-auto flex items-center justify-center sm:w-[58%] md:w-[60%] lg:w-1/2 xl:w-[40%]">
                <p className={styles.text}>
                  {description}{" "}
                  {showAnchorCall && (
                    <span>
                      <a href={`${telephoneNumber}`}>{anchorTextEnd}</a>
                    </span>
                  )}
                </p>
              </div>

              {/* right spacer */}
              {/* <div className="hidden lg:block flex-1" /> */}
            </div>
          )}
        </div>
      ) : (
        <div className={noBgColor ? styles.noBgColor : styles.bgColor}>
          <div className="container xxl:max-w-[1320px] mx-auto">
            <div
              className={
                `${headlineLarge
                  ? styles.headingContainerLarge
                  : styles.headingContainer} pt-4 md:pt-10 lg:pt-16`
              }
            >
              {/* Background image (if needed in future) */}
              {/* <Image   
                loading="eager"
                priority={true} 
                width={100} 
                height={100} 
                src={mediaSource} 
                alt={headline} 
                className={styles.bgImage}
              /> */}
              <h2
                className={
                  headlineLarge ? styles.overlayText2 : styles.overlayText
                }
                dangerouslySetInnerHTML={{ __html: headline }}
              />
            </div>

            <div className="flex flex-wrap -mx-3">
              {/* left spacer */}
              <div className="hidden lg:block flex-1" />

              {/* main content */}
              <div className="w-[95%] mx-auto flex items-center justify-center sm:w-[58%] md:w-[60%] lg:w-1/2 xl:w-[40%]">
                <p
                  className={
                    description ? styles.textImage : styles.textImageHide
                  }
                >
                  {description}{" "}
                  {showAnchorCall && (
                    <span>
                      <a href={`${telephoneNumber}`}>{anchorTextEnd}</a>
                    </span>
                  )}
                </p>
              </div>

              {/* right spacer */}
              <div className="hidden lg:block flex-1" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeadingWithBgImage;
