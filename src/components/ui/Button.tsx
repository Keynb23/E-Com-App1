import React, { type ReactNode } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './button/button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'small' | 'icon';
    children?: ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'default',
    size = 'default',
    children,
    className,
    ...props
}) => {

    const combinedClasses = `button button-${variant} button-${size} ${className}`;

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
