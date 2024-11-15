import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import Connect from "@/Connections/localConnect";

import { Users } from "@/Models/Users";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "GGfUN0CI54ggLtl67xQaBhJMEHcjRRrjrhK4fRjpwnI"

export async function POST(request: Request) {

    await Connect()

    try {

        const { Mail, Password } = await request.json()

        if (!Mail || !Password) {
            return NextResponse.json(
                { msg: "Oops! Something Went Wrong.Pls Try Again Later" },
                { status: 400 }
            )
        }

        const Existing_User = await Users.findOne({ Mail: Mail })
        if (!Existing_User) {
            return NextResponse.json(
                { msg: "Please register first" },
                { status: 404 }
            )
        }

        if (!Existing_User.Verified) {
            return NextResponse.json(
                { msg: "Please Verify first from the link in You'r Mail" },
                { status: 403 }
            )

        }

        const Password_Match = await bcrypt.compare(Password, Existing_User.Password)
        if (!Password_Match) {
            return NextResponse.json(
                { msg: "Please Check the Credentials" },
                { status: 401 }
            )

        }

        const Quark = jwt.sign({
            UserId: Existing_User._id,
            Username: Existing_User.Username,
            Mail: Existing_User.Mail,
            Phone_Number: Existing_User.Phone_Number
        }, JWT_SECRET, {
            algorithm: "HS512",
            expiresIn: "24h"
        });

        return NextResponse.json(
            { msg: `Ohh its You ${Existing_User.Username}`, Quark },
            { status: 200 },
        )

    } catch (error) {

        return NextResponse.json(
            { msg: "error" },
            { status: 500 }
        )

    }

}