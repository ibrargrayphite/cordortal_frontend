"use client";

import styles from "./PlanCard.module.css";

const PlanCard = ({ plans }) => {
  // Handle case where plans might be a single object or array
  const plansArray = Array.isArray(plans) ? plans : plans ? [plans] : [];

  return (
    <div className={styles.plansContainer}>
      <div className="container w-full lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
        <div className={styles.cardGrid}>
          {plansArray.map((plan, index) => (
            <div key={plan.id || index} className={styles.cardGap}>
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  {plan.planName && (
                    <h3 className={styles.planName} dangerouslySetInnerHTML={{ __html: plan.planName }} />
                  )}
                  
                  {plan.price && (
                    <p className={styles.price}>{plan.price}</p>
                  )}
                  
                  {plan.headline && (
                    <h4 className={styles.headline} dangerouslySetInnerHTML={{ __html: plan.headline }} />
                  )}
                  
                  {plan.description && (
                    <p className={styles.description} dangerouslySetInnerHTML={{ __html: plan.description }} />
                  )}
                  
                  {plan.content && plan.content.length > 0 && (
                    <ul className={styles.featureList}>
                      {plan.content.map((feature, featureIndex) => (
                        <li key={featureIndex} className={styles.featureItem}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;