import Link from 'next/link';
import React from 'react';

// It is a card for showing the course
const Card = ({ imageSrc, title, description }) => {
    // The props are coming from the Home page
    return (
        <Link href={`/chapter/${title}`}>
            <a className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden border-2 block">
                <div className="h-0 pb-80 relative">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-600">{description}</p>
                </div>
            </a>
        </Link>
    );
}

export default Card;
