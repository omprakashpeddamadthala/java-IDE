import { useEffect } from 'react';
import redirectsData from '../data/redirects.json';

interface RedirectPageProps {
    redirectKey: string;
}

export function RedirectPage({ redirectKey }: RedirectPageProps) {
    useEffect(() => {
        const redirects = redirectsData as Record<string, string>;
        const targetUrl = redirects[redirectKey];

        if (targetUrl) {
            // Redirect to the target URL
            window.location.href = targetUrl;
        } else {
            console.error(`No redirect URL found for key: ${redirectKey}`);
        }
    }, [redirectKey]);

    return (
        <div className="min-h-screen bg-[#2B2B2B] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6897BB] mx-auto mb-4"></div>
                <p className="text-[#A9B7C6] text-lg">Redirecting...</p>
            </div>
        </div>
    );
}
