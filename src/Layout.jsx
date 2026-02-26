import React from 'react';
import AIChat from '@/components/chat/AIChat';

export default function Layout({ children, currentPageName }) {
    return (
        <>
            {children}
            <AIChat />
        </>
    );
}