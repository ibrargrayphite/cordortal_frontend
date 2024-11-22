import React from "react";
import componentRegistry from "../components/componentRegistry";

export const renderComponent = (block) => {
  
  const Component = componentRegistry[block.component];
  
  if (!Component) return null; // Return null if the component doesn't exist in the registry

  // Use React.createElement to create the component dynamically
  return React.createElement(Component, {
    media: block.media,
    headline: block.headline,
    description:block.description,
    media2:block.media2,
    // data for services
    services: block.services,
    
    // boolean state for serviceCard and HeadingWithBgImage
    withoutBgImageHeading:block.withoutBgImageHeading,
    noBgColor: block.noBgColor,
    noClickableCard: block.noClickableCard,
    headlineLarge : block.headlineLarge,

    // team compoennt
    teamMembers:block.teamMembers,

    // for userReviews
    userReviews:block.userReviews,
    // for map
    src: block.src,
    // for PriceCard and Downloadablelinks
    data: block.data,
    Package: block.Package,

    // for blog due to structure of blog we need both col different and in dynamic component rendering we need complex logic to create layout
    blogs: block.blogs,
    posts: block.posts,
    showPosts: block.showPosts,

    // for emergency page contact number on description
    telephoneNumber:block.telephoneNumber,
    anchorTextEnd:block.anchorTextEnd,
    showAnchorCall:block.showAnchorCall,

    // need seprate compoent named as HeadlineWithBookingButton stuck in json also for cutombutton on emergency pag get in card center or any alyout center
    centerButton:block.centerButton,
    // onClick:block.onClick,
    AppointmentButtonHeadline:block.AppointmentButtonHeadline,

    // beforafter treatment
    mediaBefore:block.mediaBefore,
    mediaAfter:block.mediaAfter,
    // for html right image or left image component also for blog
    htmlContent:block.htmlContent,
    // header navbar use for about us dropdown
    name:block.name,
    menuItems:block.menuItems,
    button:block.button,
    // href:block.href,
    // footer refer  patient
    refersrc:block.refersrc,
    // in footer underline clinic name
    title:block.title,
    footerRights:block.footerRights


  
  });
};
