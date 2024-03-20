'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Customer } from '@/app/lib/definitions';

export default function ProfilePicture({ customer }: { customer: Customer }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <>
            {!imageError ? (
                <Image
                    src={customer.image_url}
                    className='rounded-full'
                    alt={`${customer.name}'s profile picture`}
                    width={28}
                    height={28}
                    onError={handleImageError}
                />
            ) : (
                <Image
                    src="/default.png"
                    className='rounded-full'
                    alt="Default profile picture"
                    width={28}
                    height={28}
                />
            )}
        </>
    );
};
