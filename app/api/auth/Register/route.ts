import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

import Connect from "@/Connections/localConnect";

import { Users } from "@/Models/Users";
import { NextResponse } from "next/server";

const Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: "voltantroyer2@gmail.com",
        pass: "gwyh arfz squh sdlq",
    },
    tls: {
        rejectUnauthorized: false
    }
});


export async function POST(request: Request) {

    await Connect()

    try {

        const { Username, Mail, Password } = await request.json();

        if (!Username || !Mail || !Password) {
            return NextResponse.json(
                { msg: "Oops! Something Went Wrong.Pls Try Again Later" },
                { status: 400 }
            )
        }

        const salt = await bcrypt.genSalt(11);
        const Sesame = await bcrypt.hash(Password, salt);

        const existing_Username = await Users.findOne({ Username: Username });
        const existing_Mail = await Users.findOne({ Mail: Mail });

        if (existing_Username || existing_Mail) {
            return NextResponse.json(
                { msg: "A User With Your Credentials is already Present" },
                { status: 400 }
            )

        }

        const User = await Users.create({
            Username: Username,
            Mail: Mail,
            Password: Sesame,
        })

        if (!User) {
            return NextResponse.json(
                { msg: "Thre Sems To be an Err Registering You.Pls Try Again Later" },
                { status: 400 }
            )
        }

        const URL = `http://localhost:3000/api/auth/Register/Canonize/${User._id}`

        let Mail_Options = {
            from: "voltantroyer2@gmail.com",
            to: Mail,
            subject: "This is Regarding Your Registration Confirmation",
            html: `<h1>Click <a href="${URL}">here</a> to Complete Your Registration</h1>`,
        }

        await Transporter.sendMail(Mail_Options)

        return NextResponse.json(
            {
                msg: `Complete Your Journey with a final touch-Simply Confirm by Clicking the Link Sent to You'r Email,dear ${Username}`,
                User: Username,
                URL: `/Registered/thamku-${Username}`
            },
            { status: 200 }
        )

    } catch (error) {

        console.log(error)
        return NextResponse.json(
            { msg: "error" },
            { status: 500 }
        )

    }

}