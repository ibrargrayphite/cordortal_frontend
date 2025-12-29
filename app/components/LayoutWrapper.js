"use client";

import { usePathname } from 'next/navigation';
import { renderComponent } from '../utils/renderComponent';
import ChatWidget from './ChatWidget';
import AddressBar from './AddressBar';
import styles from '../Layout.module.css';

const LayoutWrapper = ({ children, shared, location, chatBot, thirdPartyChatWidget, thirdPartyChatScript }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/login/';
  const isLeadsPage = pathname === '/leads' || pathname === '/leads/';
  const isConsentPage = pathname === '/consent-form/get' || pathname === '/consent-form/get/';
  const isIntegrationsPage = pathname === '/integrations' || pathname === '/integrations/';
  const isConsentFormPage = pathname === '/consent-form' || pathname === '/consent-form/';
  const isConsentFormsPage = pathname === '/consent-forms' || pathname === '/consent-forms/';
  const isAdminConsentFormsPage = pathname === '/admin/consent-forms' || pathname === '/admin/consent-forms/';

  const isLeadDetailPage = pathname.startsWith('/leads/detail');
  const isTemplatesPage = pathname === '/templates' || pathname === '/templates/';
  const isTemplateDetailPage = pathname.startsWith('/templates/detail');
  const isTemplateCreatePage = pathname.startsWith('/templates/create');

  const isAdminPage = isLoginPage || isLeadsPage || isLeadDetailPage || isTemplatesPage || isTemplateDetailPage || isTemplateCreatePage || isConsentPage || isIntegrationsPage || isConsentFormPage || isConsentFormsPage || isAdminConsentFormsPage;

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
      {!isAdminPage && <AddressBar />}
      <main className={`${isAdminPage ? "" : "mt-[96px] sm:mt-[96px] md:mt-[12px] lg:mt-[115px] xl:mt-[130px]"}`}>{children}</main>
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
      {!isAdminPage && chatBot && <ChatWidget />}
      {!isAdminPage && thirdPartyChatWidget && thirdPartyChatScript && (
        <script
          dangerouslySetInnerHTML={{
            __html: thirdPartyChatScript
          }}
        />
      )}
    </>
  );
};

export default LayoutWrapper; 