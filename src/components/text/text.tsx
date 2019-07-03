import React from 'react';
import styles from './styles.module.css';

type TextTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'bold' | 'italic' | 'span'

interface TextProps {
  variation: TextTypes
  className?: string
  children: React.ReactNode
}

export const Text: React.FC<TextProps> = React.memo(({ variation, className, children }) =>
  React.createElement(variation, { className: `${styles.Text} ${className}` }, children)
)