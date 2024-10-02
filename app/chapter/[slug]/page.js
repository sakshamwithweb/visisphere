"use client"
import dynamic from 'next/dynamic';

const Page = ({ params }) => {
    const DynamicComponent = dynamic(() => import(`@/components/Chapters/${params.slug}`), {
        ssr: false
    });

    return (
        <div>
            <DynamicComponent />
        </div>
    );
}

export default Page;
