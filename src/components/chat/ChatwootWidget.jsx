import { useEffect } from 'react';

export default function ChatwootWidget() {
    useEffect(() => {
        const BASE_URL = "https://doorqueens-u63843.vm.elestio.app";
        
        // Chatwoot SDK setup
        window.chatwootSettings = {
            hideMessageBubble: false,
            position: 'right',
            locale: 'en',
            type: 'expanded_bubble',
        };

        // Load Chatwoot script
        const script = document.createElement('script');
        script.src = `${BASE_URL}/packs/js/sdk.js`;
        script.async = true;
        
        script.onload = () => {
            window.chatwootSDK.run({
                websiteToken: 'nStCKWqqtdYoHEJJc3Dg9uwS',
                baseUrl: BASE_URL,
            });
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup
            if (window.$chatwoot) {
                window.$chatwoot.reset();
            }
            if (script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return null;
}