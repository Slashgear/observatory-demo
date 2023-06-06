import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    res.cookies.set("my-cookie", "my-cookie-value", {
        path: "/",
    });
    return res;
}