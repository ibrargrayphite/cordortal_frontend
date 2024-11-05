import { Container, Row } from "react-bootstrap";

const YourMap = ({ src }) => {
  return (
    <Container fluid>
      <Row style={{ textAlign: "center", marginTop: 50 }}>
        <iframe
          src={src}
          height="500"
          style={{ borderRadius: 5, padding: 0, marginBottom: 40 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="your_map"
        ></iframe>
      </Row>
    </Container>
  );
};

export default YourMap;
