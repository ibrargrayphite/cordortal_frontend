"use client";

import { usePathname } from 'next/navigation';
import { renderComponent } from '../utils/renderComponent';
import ChatWidget from './ChatWidget';
import styles from '../Layout.module.css';

const LayoutWrapper = ({ children, shared, location, chatBot }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {/* Only show header if not on login page */}
      {!isLoginPage && shared &&
        renderComponent({
          component: shared.header?.name,
          media: location.media,
          src: shared.header.src,
          name: location.name,
          locations: location.data.locations,
          menuItems: shared.header.menuItems,
          button: shared.header.button,
        })
      }
      <main>{children}</main>
      {/* Only show footer if not on login page */}
      {!isLoginPage && (
        <div className={styles.footerContaner}>
          {shared &&
            renderComponent({
              component: shared.footer.name,
              src: shared.footer.src,
              refersrc: shared.footer.refersrc,
              title: location.title,
              footerRights: shared.footer.footerRights,
              data: shared.footer.data,
              media: shared.footer.media,
              noBgColor: shared.footer?.noBgColor,
              footerLogin: shared.footer.footerLogin,
            })
          }
        </div>
      )}
      {chatBot && <ChatWidget />}
    </>
  );
};

export default LayoutWrapper; 