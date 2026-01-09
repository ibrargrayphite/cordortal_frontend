import CustomButton from "../CustomButton";
import HeadingWithBgImage from "../HeadingWithBgImage";
import Link from "next/link";

const EmergencyHeadline = ({
  withoutBgImageHeading,
  description,
  headline,
  telephoneNumber,
  anchorTextEnd,
  showAnchorCall,
  AppointmentButtonHeadline,
  centerButton,
  media,
  headlineLarge,
  src,
}) => {
  const handleBooking = () => {
    window.open(`${src}`, "_blank");
  };
  return (
    <div>
      <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
        <HeadingWithBgImage
          withoutBgImageHeading={withoutBgImageHeading}
          media={media}
          description={description}
          headline={headline}
          telephoneNumber={telephoneNumber}
          anchorTextEnd={anchorTextEnd}
          showAnchorCall={showAnchorCall}
          headlineLarge={headlineLarge}
        />
        {AppointmentButtonHeadline && src && (
          <Link href={src} target="_blank">
            <CustomButton
              headline={AppointmentButtonHeadline}
              //  onClick={() => handleBooking(item.src)}
              centerButton={centerButton}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmergencyHeadline;
