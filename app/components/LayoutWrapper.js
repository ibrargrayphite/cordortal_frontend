"use client";

import { usePathname } from 'next/navigation';
import { renderComponent } from '../utils/renderComponent';
import ChatWidget from './ChatWidget';
import styles from '../Layout.module.css';

const LayoutWrapper = ({ children, shared, location, chatBot }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/login/';
  const isLeadsPage = pathname === '/leads' || pathname === '/leads/';
  const isLeadDetailPage = pathname.startsWith('/leads/detail');
  const isTemplateDetailPage = pathname.startsWith('/templates/detail');
  const isTemplateCreatePage = pathname.startsWith('/templates/create');

  const isAdminPage = isLoginPage || isLeadsPage || isLeadDetailPage || isTemplateDetailPage || isTemplateCreatePage;

  return (
    <>
      {/* Only show header if not on admin pages */}
      {!isAdminPage && shared &&
        renderComponent({
          component: shared.header?.name,
          media: location.media,
          src: shared.header?.src,
          name: location.name,
          locations: location.data?.locations,
          menuItems: shared.header?.menuItems,
          button: shared.header?.button,
        })
      }
      <main>{children}</main>
      {/* Only show footer if not on admin pages */}
      {!isAdminPage && (
        <div className={styles.footerContaner}>
          {shared &&
            renderComponent({
              component: shared.footer?.name,
              src: shared.footer?.src,
              refersrc: shared.footer?.refersrc,
              title: location.title,
              footerRights: shared.footer?.footerRights,
              data: shared.footer?.data,
              media: shared.footer?.media,
              noBgColor: shared.footer?.noBgColor,
              footerLogin: shared.footer?.footerLogin,
            })
          }
        </div>
      )}
      {chatBot && <ChatWidget />}
    </>
  );
};

export default LayoutWrapper; 