import React from 'react';
import { Text } from '../text/text';
import styles from './styles.module.css';

const year = new Date().getFullYear();

interface FooterProps {
}

export const Footer: React.FC<FooterProps> = React.memo(() => (
  <footer className={styles.Footer}>
    <Text variation="p">
      Copyright &copy; {year} RJW Renovations
    </Text>
  </footer>
));
