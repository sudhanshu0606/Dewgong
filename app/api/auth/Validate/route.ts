import Connect from "@/Connections/localConnect";
import { NextResponse } from "next/server";
import JWT, { JwtPayload } from "jsonwebtoken";



interface Decoded {
    Username: string;
    Mail: string;
    Avatar: string;
}

export async function POST(request: Request) {
    await Connect();

    try {
        const { Quark } = await request.json();

        if (!Quark) {
            return NextResponse.json(
                { msg: "Token missing" },
                { status: 400 }
            );
        }

        // Decode the token and assert that it is a valid object of type Decoded
        const decoded = JWT.verify(Quark, "GGfUN0CI54ggLtl67xQaBhJMEHcjRRrjrhK4fRjpwnI") as Decoded | string;

        if (typeof decoded === "string") {
            // If the decoded token is a string (which indicates an error in decoding), return an error
            return NextResponse.json(
                { msg: "Invalid token" },
                { status: 401 }
            );
        }



        const User = {
            name: decoded.Username || "Unknown",
            email: decoded.Mail || "No Email Provided",
            avatar: decoded.Avatar || "https://ui.shadcn.com/avatars/shadcn.jpg",
        };

        return NextResponse.json(
            { msg: "ok", Valid: true, User },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { msg: "Internal server error" },
            { status: 500 }
        );
    }
}
