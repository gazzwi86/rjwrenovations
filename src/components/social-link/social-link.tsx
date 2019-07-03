import React from 'react';
import { capitalise } from '../../utils';
import { Text } from '../text/text';
import Facebook from '../../assets/svgs/facebook.svg';
import Twitter from '../../assets/svgs/twitter.svg';
import Instagram from '../../assets/svgs/instagram.svg';
import Pinterst from '../../assets/svgs/pinterest.svg';
import styles from './styles.module.css';

interface SocialType {
  img: string
  link: string
}

export interface SocialTypes {
  facebook: SocialType
  twitter: SocialType
  instagram: SocialType
  pinterest: SocialType
}

type AllowedMediaCompanies = keyof SocialTypes

const socialTypes: SocialTypes = {
  facebook: {
    img: Facebook,
    link: 'https://www.facebook.com/',
  },
  twitter: {
    img: Twitter,
    link: 'https://www.twitter.com/',
  },
  instagram: {
    img: Instagram,
    link: 'https://www.instagram.com/',
  },
  pinterest: {
    img: Pinterst,
    link: 'https://www.pinterest.com/',
  },
}

interface SocialLinkProps {
  type: AllowedMediaCompanies
  username: string
  showText?: boolean
}

export const SocialLink: React.FC<SocialLinkProps> = React.memo(({ type, username, showText = false }) => {
  const company = capitalise(type);
  const theType = socialTypes[type];

  return (
    <a href={`${theType.link}${username}`} className={styles.SocialLinkContainer} target="_blank" rel="noopener noreferrer">
      <img src={theType.img} alt={`Find us on ${company}`} className={styles.SocialLinkImage} />
      {showText && <Text className={styles.SocialLinkText} variation="h5">{company}</Text>}
    </a>
  )
});