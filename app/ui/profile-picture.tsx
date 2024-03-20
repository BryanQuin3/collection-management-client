'use client'
import React, { useState } from 'react';
import Image from 'next/image';

type Params = {
    image_url: string;
    name: string;
    className?: string;
    width?: number;
    height?: number;
};

export default function ProfilePicture({ image_url, name, className, width, height }: Params) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <>
            {!imageError ? (
                <Image
                    src={image_url}
                    className={`rounded-full ${className}`}
                    alt={`${name}'s profile picture`}
                    width={width || 28}
                    height={height || 28}
                    onError={handleImageError}
                />
            ) : (
                <Image
                    src="/default.png"
                    className={`rounded-full ${className}`}
                    alt="Default profile picture"
                    width={28}
                    height={28}
                />
            )}
        </>
    );
};
