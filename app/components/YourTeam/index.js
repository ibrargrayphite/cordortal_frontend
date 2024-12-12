import { Container, Row, Col } from "react-bootstrap";
import styles from "./YourTeam.module.css";
import defaultMedia from "../../../public/assets/images/solutions/implants.png";
import Image from "next/image";

const YourTeam = ({ teamMembers }) => {
  return (
    <Container className={styles.teamContainer}>
      <Row>
        {teamMembers.map((member) => (
          <Col key={member.id} xs={12} md={4} lg={4}>
            <div className={styles.teamImage}>
              <Image
              width={100} height={100}
                src={member.teamMemberImage && member.teamMemberImage?.startsWith('https') ? member.teamMemberImage : defaultMedia.src}
                className={styles.profileImage}
                alt={`Dental hygienist ${member.teamMemberName} providing patient care`}              
                />
            </div>
            <Container style={{ marginBottom: 20 }}>
              <p className={styles.name}>{member.teamMemberName}</p>
              <h3 className={styles.title}>{member.teamMemberSpeciality}</h3>
            </Container>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default YourTeam;
