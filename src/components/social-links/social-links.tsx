import React from 'react';
import { SocialLink, SocialTypes } from '../social-link/social-link';
import styles from './styles.module.css';

export interface Links {
  type: keyof SocialTypes
  username: string
  showText?: boolean
}

interface SocialLinkProps {
  links: Links[]
}

export const SocialLinks: React.FC<SocialLinkProps> = React.memo(({ links }) => (
  <div className={styles.SocialLinks}>
    {
      links.map(({ username, type, showText }) => 
        <SocialLink
          key={type}
          type={type}
          username={username} 
          showText={showText} 
        />
      )
    }
  </div>
));
