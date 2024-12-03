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
          <button
            className={`${styles.customButton} ${className}`} // Merge custom and additional styles
            onClick={onClick}
            style={style}
          >
            {headline}
          </button>
        </div>
      ) : (
        <button
          className={`${styles.customButton} ${className}`} // Merge custom and additional styles
          onClick={onClick}
          style={style}
        >
          {headline}
          {icon && <span className={styles.buttonIcon}>{icon}</span>} {/* Render icon if provided */}
        </button>
      )}
    </>
  );
};

export default CustomButton;
