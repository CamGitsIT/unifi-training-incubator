import React from 'react';
import ChatwootWidget from '@/components/chat/ChatwootWidget';

export default function Layout({ children, currentPageName }) {
    return (
        <>
            {children}
            <ChatwootWidget />
        </>
    );
}