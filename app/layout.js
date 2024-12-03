import { Josefin_Sans, Urbanist } from 'next/font/google';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';
import currentLocation from './data';
import { renderComponent } from './utils/renderComponent';
import { ThemeProvider } from './context/ThemeContext';

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

export default function RootLayout({ children }) {
  const location = currentLocation; // Replace this with dynamic data if required
  const shared = location.shared || {};

  // Determine the active font based on the location's fontFamily
  const activeFont = location.fontFamily === 'josefinSans' ? josefinSans : urbanist;
  // console.log("🚀 ~ RootLayout ~ activeFont:-----------", activeFont)

  return (
    <html lang="en">
      <ThemeProvider>
      <body
          style={{
            '--dynamic-font': activeFont.style.fontFamily, // Set dynamic font variable
            fontFamily: 'var(--dynamic-font, sans-serif)', // Apply the variable directly
          }}
          className={activeFont.className} // Use the Google Fonts class
        >
          {shared &&
            renderComponent({
              component: shared.header.name,
              media: location.media,
              src: shared.header.src,
              name: location.name,
              menuItems: shared.header.menuItems,
              button: shared.header.button,
            })
          }
          <main>{children}</main>
          <div className={styles.footerContaner}>
            {shared &&
              renderComponent({
                component: shared.footer.name,
                src: shared.footer.src,
                refersrc: shared.footer.refersrc,
                title: location.title,
                footerRights: shared.footer.footerRights,
                data: shared.footer.data,
              })
            }
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}
