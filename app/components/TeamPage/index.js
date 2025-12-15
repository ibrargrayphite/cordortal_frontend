"use client";

import styles from "./Team.module.css";
import { renderComponent } from "../../utils/renderComponent";
import { usePages } from '../../context/PagesContext';
import { useLocation } from '../../context/LocationContext';
import YourTeam from '../YourTeam';
import dynamic from 'next/dynamic';
const ScrollHandler = dynamic(() => import("../ScrollHandler"), { ssr: false });

const TeamPage = () => {
  const { pages } = usePages();
  const { 
    team: locationTeam, 
    locationShortName,
    hasMultipleLocations,
  } = useLocation();

  const filterByPage = (pages, pageName) => {
    if (!Array.isArray(pages)) {
      return [];
    }

    return pages
      .filter((page) => page.pageName === pageName)
      .map((page) => ({
        ...page,
        content: page.content || [],
      }));
  };

  const pageName = "team";
  const filtered = filterByPage(pages.pages, pageName);

  // Check if we have location-specific team data
  const hasLocationTeam = locationTeam && locationTeam.length > 0;

  return (
    <div className={styles.marginCustom}>
      <ScrollHandler sectionScroll={null} scrollToCenter={false} />
      
      {/* If we have location-specific team, show it */}
      {hasLocationTeam ? (
        <div className={styles.locationTeamSection}>
          {/* Team header with location name */}
          <div className={styles.teamHeader}>
            <div className="container mx-auto">
              <h1 className={styles.pageTitle}>
                {hasMultipleLocations 
                  ? `Meet Our Team at ${locationShortName}`
                  : 'Meet Our Team'
                }
              </h1>
              {hasMultipleLocations && (
                <p className={styles.locationSubtitle}>
                  Our dedicated professionals at the {locationShortName} location
                </p>
              )}
            </div>
          </div>

          {/* Location-specific team grid */}
          <div className={styles.teamGrid}>
            <YourTeam 
              teamMembers={locationTeam.map((member) => ({
                id: member.id,
                teamMemberName: member.name,
                teamMemberSpeciality: member.role,
                teamMemberImage: member.image || "",
              }))}
            />
          </div>
        </div>
      ) : (
        /* Fall back to CMS pages content (org-level team) */
        <>
          {filtered.length > 0 ? (
            filtered.map((page, pageIndex) => (
              <div key={pageIndex}>
                {page.content.map((block, blockIndex) => (
                  <div key={blockIndex} id={block.scroll}>
                    {renderComponent(block)}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="container mx-auto py-20 text-center">
              <p>No team information available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamPage;
