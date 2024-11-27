"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./CaseStudyCard.module.css";
import HeadingTopDiscription from "../HeadingTopDiscription";
import CustomButton from "../CustomButton";

const CaseStudyCard = ({ data,headline,description }) => {
    const router = useRouter();

    const handlePrimaryAction = () => {
        router.push("/services");
      };
  return (
    <>
    <HeadingTopDiscription headline={headline} description={description} className={styles.h1Width} />
    <Container>
      {data.map((caseStudy, index) => (
        <div id={caseStudy.slug} key={index} className={`${styles.Card} p-5 mb-5`} style={{ backgroundColor: "#FAF7EF" }}>
          <Row>
            {/* Left Column */}
            <Col md={7} className="d-flex ">
            {/* <video src= */}
            {caseStudy.video && <video
              src={caseStudy.video}
              controls
              // height="100"
              // width="100"
              style={{objectFit: "cover",width: '100%',height:'100%'}}
            >
            </video>}
              {caseStudy.mediaBefore && <img src={caseStudy.mediaBefore?.src} alt="Before" className={styles.mediaImageBefore} />}
              {caseStudy.mediaAfter && <img src={caseStudy.mediaAfter?.src} alt="After" className={styles.mediaImageAfter} />}
            </Col>
            {/* Right Column */}
            <Col md={5}>
            <div style={{marginLeft:"20px"}}>
              <h3 className={styles.heading}>{caseStudy.heading}</h3>
              <ul className="mb-3" style={{ listStyleType: "disc", paddingLeft: "20px"}}>
                {caseStudy.bullets.map((bullet, idx) => (
                  <li key={idx} style={{paddingBottom:"10px"}}>{bullet}</li>
                ))}
              </ul>
              <p className={styles.date}>Updated: {caseStudy.date}</p>
              </div>
            </Col>
          </Row>
        </div>
      ))}
      <Row>
      <Col md={12} className="d-flex justify-center">
      <CustomButton
                headline="View More"
                onClick={handlePrimaryAction}
                className={styles.customButton}
              />
              </Col>
              </Row>
      </Container>
    </>
  );
};

export default CaseStudyCard;
