import { NextResponse, type NextRequest } from 'next/server';

export function generateCsp() {
    // generate random nonce converted to base64. Must be different on every HTTP page load
    // const nonce = crypto.randomBytes(16).toString('base64')
    const nonce = crypto.randomUUID();

    const csp = [
        { name: 'default-src', values: ["'none'"] },
        {
            name: 'script-src',
            values: [
                "'report-sample'",
                "'self'",
                `'nonce-${nonce}'`,
                "'strict-dynamic'",
                "https://code.jquery.com/jquery-3.2.1.slim.min.js"
            ],
        },
        {
            name: 'style-src',
            values: ["'report-sample'", "'self'", `'nonce-${nonce}'`],
        },
        {
            name: 'connect-src',
            values: ["'self'", 'https://observatory-demo.vercel.app'],
        },
        { name: 'font-src', values: ["'self'", 'data:'] },
        { name: 'img-src', values: ["'self'", 'https://images.ctfassets.net https://secure-content.meetupstatic.com'] },
        { name: 'worker-src', values: ["'self'"] },
        { name: 'frame-ancestors', values: ["'none'"] },
        { name: 'form-action', values: ["'self'"] },
        { name: 'base-uri', values: ["'self'"] },
    ];

    const cspString = csp
        .map((directive) => {
            return `${directive.name} ${directive.values.join(' ')}`;
        })
        .join('; ');

    return { csp: cspString, nonce };
}

export async function middleware(request: NextRequest) {
    // generate CSP and nonce
    const { csp, nonce } = generateCsp();

    // Clone the request headers
    const requestHeaders = new Headers(request.headers);

    // set nonce request header to read in pages if needed
    requestHeaders.set('x-nonce', nonce);

    // Set the CSP header so that `app-render` can read it and generate tags with the nonce
    requestHeaders.set('content-security-policy', csp);

    // create new response
    const response = NextResponse.next({
        request: {
            // New request headers
            headers: requestHeaders,
        },
    });

    // Also set the CSP so that it is outputted to the browser
    response.headers.set('content-security-policy', csp);
    response.cookies.set("my-cookie", "my-cookie-value", {
        path: "/",
        sameSite: "strict",
        secure: true,
        httpOnly: true,
    });
    return response;
}
