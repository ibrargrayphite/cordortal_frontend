import { Button } from "../ui/button";
import styles from "./CustomButton.module.css";


const CustomButton = ({
  headline,
  onClick,
  className,
  style,
  centerButton = false,
  icon
}) => {
  return (
    <>
      {centerButton ? (
        <div style={{ textAlign: "center", marginTop: 10, marginBottom: 20 }}>
          <Button
            variant="customButton"
            className={`${styles.customButton} ${className} bg-main-accent-dark`}
            onClick={onClick}
            style={style}
          >
            {headline}
          </Button>
        </div>
      ) : (
        <Button
          variant="customButton"
          className={`${styles.customButton} ${className} bg-main-accent-dark`}
          onClick={onClick}
          style={style}
        >
          {headline}
          {icon && <span className={styles.buttonIcon}>{icon}</span>}
        </Button>
      )}
    </>
  );
};

export default CustomButton;
