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

  // Split data into three columns
  const columns = [[], [], []];
  data.forEach((file, index) => {
    columns[index % 3].push(file);
  });

  return (
    <div className={noBgColor ? styles.noBgColor : styles.solutionsContainer0}>
      <div className="container lg:max-w-[960px] xxl:max-w-[1320px] mx-auto">
        {/* Bootstrap Row replacement */}
        <div className="flex flex-wrap">
          {/* Heading */}
          <div className="w-full">
            <HeadingWithBgImage withoutBgImageHeading={true} headline={headline} />
          </div>

          {/* Columns */}
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="px-1 w-full lg:w-1/3">
              <ul className={styles.noBullets}>
                {column.map((file, index) => (
                  <li key={index} className={styles.listStyle}>
                    <a
                      href={file.url}
                      className={styles.listStyle}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent the default anchor behavior
                        downloadFile(file.url);
                      }}
                    >
                      {file.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadableLinks;
