import { NextResponse } from "next/server";
import nodemailer from "nodemailer"

import Connect from "@/Connections/localConnect";

import { Users } from "@/Models/Users";
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


export async function POST(request:Request) {

    await Connect()
    
    try {
        
        const { Mail } = await request.json()
    
        if( !Mail ) { 
            return NextResponse.json(
                { msg: "Oops! Something Went Wrong.Pls Try Again Later" },
                { status: 400 }
            )

        }

        const User = await Users.findOne( { Mail : Mail } )
        if( !User ) { 
            return NextResponse.json(
                { msg: "Please Register First" },
                { status: 404 }
            )
            
        }
        
        if( !User.Verified ) { 
            return NextResponse.json(
                { msg: "Please verify first from the link in You'r Mail" },
                { status: 403 }
            )
            
        }

        if( User.Reset_Password_Counter > 5 ) {

            let Mail_Options = { 
                from:"voltantroyer2@gmail.com",
                to:Mail,
                subject:"To Many Changes",
                html:`<h1>You have changed your password too many times</h1>`
            }

            await Transporter.sendMail(Mail_Options)

            return NextResponse.json(
                { msg: "You have Changed Your Password Too Many Times" },
                { status: 418 }
            )
            
            
        }

        const URL = `http://localhost:3000/api/auth/Instate/Change-Your-Password/${User._id}`
    
        let Mail_Options = {
            from : "voltantroyer2@gmail.com",
            to : Mail,
            subject : "This is Regarding your request of changing password",
            html : `<h1>You can reset your password <a href="${URL}">here</a></h1>`,
        };
    
        await Transporter.sendMail(Mail_Options);
            
        User.Reseting_Expires_In = Date.now() + 5*60*1000
        await User.save()
            
        return NextResponse.json(
            { msg: "Reset Your Password from The Link Sent to the mail" },
            { status: 200 }
        )

    
    } catch (error) {

        return NextResponse.json(
            { msg: "error" },
            { status: 500 }
        )
        

    }

}