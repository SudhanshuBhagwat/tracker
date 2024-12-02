export function isIOSStandalone() {
    return (
        typeof window !== undefined && (window.navigator as any).standalone === true
    )
}

export function isInstallPromptAvailable() {
    if (typeof window === "undefined") return false;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || isIOSStandalone();

    return (isIOS || isAndroid) && !isStandalone;
}