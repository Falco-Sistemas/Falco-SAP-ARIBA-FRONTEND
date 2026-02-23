import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SessionContextType {
    sessionId: string | null;
    postUrl: string | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [searchParams] = useSearchParams();

    const [sessionId, setSessionId] = useState<string | null>(
        () => sessionStorage.getItem('sessionId')
    );
    const [postUrl, setPostUrl] = useState<string | null>(
        () => sessionStorage.getItem('postUrl')
    );

    useEffect(() => {
        const sid = searchParams.get('sessionid');
        const purl = searchParams.get('posturl');

        if (sid) {
            setSessionId(sid);
            sessionStorage.setItem('sessionId', sid);
        }
        if (purl) {
            setPostUrl(purl);
            sessionStorage.setItem('postUrl', purl);
        }
    }, [searchParams]);

    return (
        <SessionContext.Provider value={{ sessionId, postUrl }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession(): SessionContextType {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
