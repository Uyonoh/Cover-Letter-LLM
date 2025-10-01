import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { access_token } = req.body;
        res.setHeader("Set-cookie", cookie.serialize("sb-access-token", access_token, {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        }));
        return res.status(200).end();
    }

    if (req.method === "DELETE") {
        res.setHeader("Set-Cookie", cookie.serialize("sb-access-token", "", {
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_ENV === "production",
            maxAge: -1,
            path: "/",
        }));res.status(200).end();
        return 
    }

    res.setHeader("Allow",["POST", "DELETE"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
}