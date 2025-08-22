import styles from "./YourTeam.module.css";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const YourTeam = ({ teamMembers }) => {
  return (
    <div className={`container mx-auto ${styles.teamContainer}`}>
      {/* Mimic Bootstrap Row: negative margins for gutters + flex-wrap */}
      <div className="flex flex-wrap">
        {teamMembers.map((member) => (
          <div key={member.id} className="px-3 w-full md:w-1/3 lg:w-1/3">
            <div className={styles.teamImage}>
              <Image
                priority={true}
                width={100}
                height={100}
                src={
                  member.teamMemberImage && member.teamMemberImage?.startsWith("https")
                    ? member.teamMemberImage
                    : defaultMedia.src
                }
                className={styles.profileImage}
                alt={`Dental hygienist ${member.teamMemberName} providing patient care`}
              />
            </div>
            <div className="mb-5" style={{ marginBottom: 20 }}>
              <p className={styles.name}>{member.teamMemberName}</p>
              <h3 className={styles.title}>{member.teamMemberSpeciality}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourTeam;
