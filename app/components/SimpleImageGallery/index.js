import styles from "./SimpleImageGallery.module.css";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const SimpleImageGallery = ({ media, noBgColor = true }) => {
  return (

    <div className={`w-full ${noBgColor ? styles.noBgColor : styles.bgColor}`}>
      <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
        <div className="flex flex-wrap justify-center">
          {media &&
            media.map((service, index) => (
              <div key={index} className="w-full sm:w-1/3 px-2">
                <Image
                  loading="lazy"
                  width={100} height={100}
                  src={service.image && service.image?.startsWith('https') ? service.image : defaultMedia.src}
                  style={{ width: "100%", height: "auto" }}
                  alt="Dental services image gallery featuring happy patients"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleImageGallery;
