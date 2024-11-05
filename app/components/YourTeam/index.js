import { Container, Row, Col } from "react-bootstrap";
import styles from "./YourTeam.module.css";

const YourTeam = ({ teamMembers }) => {
  return (
    <Container className={styles.teamContainer}>
      <Row>
        {teamMembers.map((member) => (
          <Col key={member.id} xs={12} md={4} lg={4}>
            <div className={styles.teamImage}>
              <img
                src={member.teamMemberImage.src}
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
