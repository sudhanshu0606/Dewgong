import mongoose from "mongoose"
import nodemailer from "nodemailer"

import Connect from "@/Connections/localConnect"

import { Users } from "@/Models/Users"
import { NextResponse } from "next/server";

const Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "voltantroyer2@gmail.com",
        pass: "gwyh arfz squh sdlq",
    },
    tls: {
        rejectUnauthorized: false
    }
});


export async function PUT(request: Request) {

    await Connect()

    try {

        const _id = await request.json()
        

        if (!_id || typeof _id !== "string") {
            return NextResponse.json(
                { msg: "Oops! Something Went Wrong.Pls Try Again Later" },
                { status: 400 }
            )

        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json(
                { msg: "Oops! " },
                { status: 422 }
            )

        }

        const User = await Users.findById( _id )
        if (!User) {
            return NextResponse.json(
                { msg: "Please Register First" },
                { status: 404 }
            )

        }

        User.Verified = true
        await User.save()

        const MailOptions = {
            from: "voltantroyer2@gmail.com",
            to: User.Mail,
            subject: "This is regarding Your Verification",
            html: "<h1>You are now Verified<h1/>"
        }

        await Transporter.sendMail(MailOptions)

        return NextResponse.json(
            { msg: "Congratulations! You've been Verified" },
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