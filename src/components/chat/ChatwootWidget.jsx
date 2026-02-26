import { useEffect } from 'react';

export default function ChatwootWidget() {
    useEffect(() => {
        // Chatwoot SDK setup
        window.chatwootSettings = {
            hideMessageBubble: false,
            position: 'right',
            locale: 'en',
            type: 'expanded_bubble',
        };

        // Load Chatwoot script
        const script = document.createElement('script');
        script.src = `${import.meta.env.VITE_CHATWOOT_BASE_URL || 'https://app.chatwoot.com'}/packs/js/sdk.js`;
        script.defer = true;
        script.async = true;
        
        script.onload = () => {
            window.chatwootSDK.run({
                websiteToken: import.meta.env.VITE_CHATWOOT_WEBSITE_TOKEN,
                baseUrl: import.meta.env.VITE_CHATWOOT_BASE_URL || 'https://app.chatwoot.com',
            });
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup
            if (window.$chatwoot) {
                window.$chatwoot.reset();
            }
            document.body.removeChild(script);
        };
    }, []);

    return null;
}