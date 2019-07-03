import React from 'react';
import { Loading } from '../../components/loading/loading'
import { SocialLinks, Links } from '../../components/social-links/social-links'
import { Text } from '../../components/text/text'
import { Footer } from '../../components/footer/footer'
import Logo from '../../assets/images/logo.jpg'
import styles from './styles.module.css';

const Image: React.LazyExoticComponent<any> = React.lazy(() => import('../../components/image/image').then((({ Image }) => ({ default: Image }))))

const socialLinks: Links[] = [
  {
    type: 'facebook',
    username: 'RJW-Renovations-383658162260729',
    showText: false,
  },
  {
    type: 'twitter',
    username: 'RenovationsRjw',
    showText: false,
  },
  {
    type: 'instagram',
    username: 'rjwrenovations',
    showText: false,
  },
];

interface AppProps {
}

export const App: React.FC<AppProps> = () => (
  <div className={styles.App}>
    <header>
      <h1 className={styles.Logo}>
        <React.Suspense fallback={<Loading />}>
          <Image source={Logo} alt="RJW Renovations" />
        </React.Suspense>
      </h1>
    </header>

    <main>
      <Text variation="h2" className={styles.SubHeading}>
        Repairs, renovations and rental property maintenance
      </Text>

      <SocialLinks links={socialLinks} />
    </main>

    <Footer />
  </div>
);