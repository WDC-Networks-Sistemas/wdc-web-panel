import React from 'react';
import './globals.css';
import { Providers } from '@/providers';


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}