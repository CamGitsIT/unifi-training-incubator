import React from 'react';
import AIChat from '@/components/chat/AIChat';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function Layout({ children, currentPageName }) {
    return (
        <>
            {children}
            <PWAInstallPrompt />
            <AIChat />
        </>
    );
}