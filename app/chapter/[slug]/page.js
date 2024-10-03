"use client"
import dynamic from 'next/dynamic';
// Here using dynamic I am rediracting course components in /chapter/[courseName] sccording to the course name
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
