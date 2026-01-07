"use client";
import { useState } from "react";
import styles from "./DownloadableLinks.module.css";
import HeadingWithBgImage from "../HeadingWithBgImage";

const DownloadableLinks = ({ data, noBgColor, headline }) => {
  const [fileUrl, setFileUrl] = useState(null);

  const downloadFile = (path) => {
    if(path) {
      setFileUrl(path);
      // Trigger the download
      const link = document.createElement("a");
      link.href = path;
      link.setAttribute("download", ""); // Set the attribute for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Split data into three columns (7 links per column)
  const columns = [[], [], []];
  data.forEach((file, index) => {
    columns[index % 3].push(file);
  });

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
        {/* Heading */}
        <div className="w-full">
          <HeadingWithBgImage withoutBgImageHeading={true} headline={headline} />
        </div>

        {/* Grid Container */}
        <div className={styles.gridContainer}>
          {columns.map((column, colIndex) => (
            <div key={colIndex} className={styles.gridColumn}>
              {column.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  className={styles.linkItem}
                  onClick={(e) => {
                    e.preventDefault();
                    downloadFile(file.url);
                  }}
                >
                  {file.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadableLinks;