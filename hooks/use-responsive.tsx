import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768;

export function useResponsive() {
    const { width, height } = useWindowDimensions();
    const [isMobile, setIsMobile] = useState(width < MOBILE_BREAKPOINT);
    const [isDesktop, setIsDesktop] = useState(width >= MOBILE_BREAKPOINT);

    useEffect(() => {
        const mobile = width < MOBILE_BREAKPOINT;
        setIsMobile(mobile);
        setIsDesktop(!mobile);
    }, [width]);

    return {
        isMobile,
        isDesktop,
        width,
        height,
        breakpoint: MOBILE_BREAKPOINT,
    };
}
