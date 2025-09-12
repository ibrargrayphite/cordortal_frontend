import { Josefin_Sans, Urbanist } from 'next/font/google';
import './globals.css';
import styles from './Layout.module.css';
import { renderComponent } from './utils/renderComponent';
import { ThemeProvider } from './context/ThemeContext';
import { PagesProvider } from './context/PagesContext';
import { fetchPagesData } from './utils/fetchPagesData';
import localFont from 'next/font/local';
import ChatWidget from './components/ChatWidget';
import LayoutWrapper from './components/LayoutWrapper';
import ToastWrapper from './components/ToastWrapper';


const balgin = localFont({
  src: [{ path: '../public/assets/fonts/balgin-regular.otf', weight: '400', style: 'normal' }],
  display: 'swap',
  variable: '--font-balgin',
});
const touvlo = localFont({
  src: [{ path: '../public/assets/fonts/touvlo-regular.otf', weight: '400', style: 'normal' }],
  display: 'swap',
  variable: '--font-touvlo',
});
// Load the fonts
const josefinSans = Josefin_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefin-sans',
});

const urbanist = Urbanist({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
});

export default async function RootLayout({ children }) {
  // Fetch data server-side
  const pagesData = await fetchPagesData();
  console.log("PAGES DATA IN LAYOUT:", pagesData);
  const location = pagesData || {};
  const shared = location.shared || {};
  const chatBot = pagesData?.data?.chatBot || false;
  // need to add in organization data as for oaklands "chatBot": false,

  // Determine the active font based on the location's fontFamily
  const activeFont = location.fontFamily === 'josefinSans' ? josefinSans : location.fontFamily === 'urbanist'?  urbanist: touvlo;
  const secondaryFont =
    location.font_family_heading && location.font_family_heading.trim() !== ''
      ? location.font_family_heading === 'josefinSans'
        ? josefinSans
        : location.font_family_heading === 'urbanist'
        ? urbanist
        : balgin
      : activeFont;
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <PagesProvider pagesData={pagesData}>
        <ThemeProvider>
          <body
            style={{
              '--dynamic-font': activeFont.style.fontFamily,
              fontFamily: 'var(--dynamic-font, sans-serif)',
            }}
            className={activeFont.className}
          >
            <style>
              {`
                ul,li, p, span, div {
                  font-family: ${activeFont.style.fontFamily}, sans-serif !important;
                }
              `}
              {`
                h1, h2, h3, h4, h5 {
                  font-family: ${secondaryFont.style.fontFamily}, sans-serif !important;
                }
              `}
            </style>
            <ToastWrapper>
              <LayoutWrapper 
                shared={shared}
                location={location}
                chatBot={chatBot}
              >
                {children}
              </LayoutWrapper>
            </ToastWrapper>
          </body>
        </ThemeProvider>
      </PagesProvider>
    </html>
  );
}
