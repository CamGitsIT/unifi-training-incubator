import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone === true;
        
        if (isInstalled) {
            return;
        }

        // Check if already dismissed
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissed) {
            return;
        }

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        if (iOS) {
            // Show iOS instructions after 3 seconds
            setTimeout(() => setShowPrompt(true), 3000);
        } else {
            // Handle Android/Desktop PWA install
            const handleBeforeInstallPrompt = (e) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setTimeout(() => setShowPrompt(true), 3000);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 w-[90%] max-w-md"
            >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-6 relative">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="bg-white/20 rounded-full p-3">
                            <Smartphone className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">
                                {isIOS ? 'Add to Home Screen' : 'Install OverISP Chat'}
                            </h3>
                            
                            {isIOS ? (
                                <div className="text-sm text-blue-50 space-y-2">
                                    <p>Get instant access to our chat support:</p>
                                    <ol className="list-decimal list-inside space-y-1">
                                        <li>Tap the Share button <span className="inline-block">📤</span></li>
                                        <li>Select "Add to Home Screen"</li>
                                        <li>Tap "Add" in the top right</li>
                                    </ol>
                                </div>
                            ) : (
                                <div className="text-sm text-blue-50 mb-4">
                                    <p>Install our app for instant chat access - works offline and launches like a native app!</p>
                                </div>
                            )}

                            {!isIOS && deferredPrompt && (
                                <Button
                                    onClick={handleInstall}
                                    className="bg-white text-blue-600 hover:bg-blue-50 mt-3 w-full"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Install Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}