import React from 'react';
import FontSize from '../../foundation/FontSize';
import styles from './Text.module.scss';

export interface TextProps {
    size?: keyof typeof FontSize;
}

const Text: React.FC<TextProps> = ({ size = FontSize.base, children }) => {
    return (
        <p className={`${styles['text']} ${styles[`text-${size}`]}`}>
            {children}
        </p>
    );
};

export default Text;
