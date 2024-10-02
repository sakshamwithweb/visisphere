import Link from 'next/link';
import React from 'react'

const Card = ({ imageSrc, title, description }) => {
    return (
        <div className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden border-2">
            <div className="h-0 pb-80 relative">
                <img
                    src={imageSrc}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                    <Link href={`/chapter/${title}`}>{title}</Link>
                </h2>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
}

export default Card