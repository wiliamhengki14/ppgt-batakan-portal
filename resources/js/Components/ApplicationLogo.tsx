import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo({
    className = '',
    alt = 'Logo PPGT Batakan',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/storage/images.png"
            alt={alt}
            className={`object-contain ${className}`}
            {...props}
        />
    );
}