import React from 'react';
import styles from './styles.module.css';

interface ImageProps {
  source: string
  alt: string
}

export const Image: React.FC<ImageProps> = React.memo(({ source, alt }) => (
  <div className={styles.ImageContainer}>
    <img src={source} alt={alt} className={styles.Image} />
  </div>
))