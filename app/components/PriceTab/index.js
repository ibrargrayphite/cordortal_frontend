import styles from "./PriceTab.module.css";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

const PriceTab = ({ data }) => {
  // data should be an array of tab objects: { label, value, services: [{ serviceName, servicePrice, color }] }
  const tabData = data.map(item => ({
    ...item,
    label: item.headline,
    value: item.headline.toLowerCase().replace(/\\s+/g, '-')
  }));
  console.log("🚀 ~ PriceTab ~ tabData:", tabData)

  return (
    <div className={styles.tabsContainer}>
      <Tabs defaultValue={tabData[0]?.value || "routine"}>
        <TabsList className={styles.tabsList}>
          {tabData.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={styles.tabTrigger}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className={styles.tabContent}>
            <div className={styles.servicesGrid}>
              {(tab.services || []).map((service, idx) => (
                <div
                  key={idx}
                  className={styles.serviceRow}
                  // style={{ borderLeftColor: service.color || "#2563eb" }}
                >
                  <div>
                  <p className={styles.serviceName}>{service.serviceName}</p>
                  {service.serviceFor && <p className={"text-xs text-gray-500 mb-0"}>{service.serviceFor}</p>}
                  </div>
                  <span className={styles.servicePrice} >{service.servicePrice}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PriceTab;
