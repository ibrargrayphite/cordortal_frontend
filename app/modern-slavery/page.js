"use client";
import React, { useEffect, useState } from "react";
import styles from "./ModernSlavery.module.css";
import { Col, Container, Row } from "react-bootstrap";
import GetInTouch from "../components/GetInTouch";
import getInTouch from "../../public/assets/images/getBackground.jpeg";
import { usePages } from '../context/PagesContext'; // Import the usePages hook
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../components/ScrollHandler"), { ssr: false });

const ModernSlavery = () => {
  const [isClient, setIsClient] = useState(false);
  const { pages } = usePages();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }


  return (
    <div>
      <Container>
        <ScrollHandler sectionScroll={null} scrollToCenter={true} />
        <p className={styles.heading}>Anti Slavery Policy</p>
        <Row>
          <Col />
          <Col lg={7} sm={12}>
            <p className={styles.text}>
              Here at {pages?.title} we a wide varierty of treatments from private to
              NHS funded. Please see below an approx price of our treatments
              please contact for further infomation and bookings
            </p>
          </Col>
          <Col />
        </Row>
        {/* <div style={{ textAlign: "center", marginTop: 0 }}>
          <button className={styles.button}>Book an Appointment</button>
        </div> */}
        <div className={styles.infoContainer}>
          <p className={styles.title}>1. POLICY STATEMENT</p>
          <p className={styles.description}>
            1.1 Modern slavery is a crime and a violation of fundamental human
            rights. It takes various forms, such as slavery, servitude, forced
            and compulsory labour and human trafficking, all of which have in
            common the deprivation of a person's liberty by another in order to
            exploit them for personal or commercial gain. We are committed to
            acting ethically and with integrity in our business dealings and
            relationships and are committed to preventing modern slavery in our
            own business and to helping prevent modern slavery in our supply
            chains.
          </p>
          <p className={styles.description}>
            1.2    We are also committed to ensuring there is transparency in
            our own business and in our approach to tackling modern slavery.
            Under the Modern Slavery Act 2015, we are legally required to
            disclose the steps we take to tackle modern slavery. We expect the
            same high standards from all of our employees and suppliers.{" "}
          </p>
          <p className={styles.description}>
            1.3    This policy applies to all persons working for us or on our
            behalf in any capacity, including employees at all levels,
            directors, officers, agency workers, suppliers, seconded workers,
            volunteers, and interns. 
          </p>
          <p className={styles.description}>
            1.4    This policy does not form part of any Sabio employee's
            contract of employment and we may amend it at any time.
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <p className={styles.title}>2. RESPONSIBILITY FOR THIS POLICY</p>
          <p className={styles.description}>
            2.1    The board of directors has overall responsibility for
            ensuring this policy complies with our legal and ethical
            obligations, and that all those under our control comply with it.  
          </p>
          <p className={styles.description}>
            2.2    The Legal and People departments have primary and day-to-day
            responsibility for implementing this policy, monitoring its use and
            effectiveness, dealing with any queries about it, and auditing
            internal procedures.
          </p>
          <p className={styles.description}>
            2.3    Management at all levels are responsible for ensuring those
            reporting to them understand and comply with this policy. Guidance
            on the policy can be obtained from the Legal and People teams.
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <p className={styles.title}>3. COMPLIANCE WITH THIS POLICY</p>
          <p className={styles.description}>
            3.1    The prevention, detection and reporting of modern slavery in
            any part of our business or supply chains is the responsibility of
            all those working for us or under our control. You are required to
            avoid any activity that might lead to, or suggest, a breach of this
            policy.
          </p>
          <p className={styles.description}>
            3.2    You must notify your manager (or your main point of contact
            at Sabio, if you are a supplier) as soon as possible if you believe
            or suspect that a breach of this policy has occurred, or may occur
            in the future.
          </p>
          <p className={styles.description}>
            3.3    You are encouraged to raise concerns about any issue or
            suspicion of modern slavery in any parts of our business or supply
            chains or any supplier tier at the earliest possible stage.
          </p>
          <p className={styles.description}>
            3.4    If you believe or suspect a breach of this policy has
            occurred or that it may occur you must notify your manager (or your
            main point of contact at Sabio, if you are a supplier) as soon as
            possible.
          </p>
          <p className={styles.description}>
            3.5    If you are unsure about whether a particular act, the
            treatment of workers more generally, or their working conditions
            within any tier of our supply chain constitute any of the various
            forms of modern slavery, you should raise it with your manager (or
            your main point of contact at Sabio, if you are a supplier).
          </p>
          <p className={styles.description}>
            3.6    We aim to encourage openness and will support anyone who
            raises genuine concerns in good faith under this policy, even if
            they turn out to be mistaken. We are committed to ensuring no one
            suffers any detrimental treatment by Sabio as a result of reporting
            in good faith their suspicion that modern slavery of whatever form
            is or may be taking place in any part of our own business or in any
            of our supply chains. Detrimental treatment includes dismissal,
            disciplinary action, threats or other unfavourable treatment
            connected with raising a concern. If you believe that you have
            suffered any such treatment, you should inform the Chief People
            Officer immediately. If the matter is not remedied, and you are an
            employee, you should raise it formally using our grievance
            procedure.
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <p className={styles.title}>
            4. COMMUNICATION AND AWARENESS OF THIS POLICY
          </p>
          <p className={styles.description}>
            4.1    Guidance on this policy forms part of the induction process
            for all individuals who work for us and will be provided otherwise
            as necessary.
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <p className={styles.title}>5. BREACHES OF THIS POLICY </p>
          <p className={styles.description}>
            5.1    Any employee who breaches this policy will face disciplinary
            action, which could result in dismissal for misconduct or gross
            misconduct.
          </p>
          <p className={styles.description}>
            5.2    We may terminate our relationship with other individuals and
            organisations working for us or on our behalf (including suppliers)
            if they breach this policy.
          </p>
        </div>
      </Container>
      <div className={styles.getTouchContainer}>
        <GetInTouch headline={"Get in touch"} media={getInTouch.src}/>
      </div>
    </div>
  );
};

export default ModernSlavery;
