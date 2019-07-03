import React from 'react';
import LoadingImage from '../../assets/svgs/loading.svg';
import styles from './styles.module.css';

interface LoadingProps {
}

export const Loading: React.FC<LoadingProps> = React.memo(() => (
  <div className={styles.Loading}>
    <img src={LoadingImage} alt="..." />
  </div>
));