import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

import { NextResponse } from "next/server";

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
import mongoose from "mongoose";


export async function PUT(request:Request) {

    await Connect();
    
    try {
        
        const { Password , _id } = await request.json()
        
        if( !Password || !_id ) { 
            return NextResponse.json(
                { msg: "Oops! Something Went Wrong.Pls Try Again Later" },
                { status: 400 }
            )
            
        }

        if( !mongoose.Types.ObjectId.isValid(_id) ) { 
            return NextResponse.json(
                { msg: "wow" },
                { status: 400 }
            )
            
        }

        const User = await Users.findById( _id  )
        if( !User ) { 
            return NextResponse.json(
                { msg: "Please Register First" },
                { status: 404 }
            )
            
        }
        
        if( User.Reseting_Expires_In < Date.now() ) { 
            return NextResponse.json(
                { msg: "Your Given Time To Reset The Password is Over.Try Again Later" },
                { status: 410 }
            )
            
        }

        const Password_Match = await bcrypt.compare( Password , User.Password )
        if( Password_Match ) { 
            return NextResponse.json(
                { msg: "Choose a diffrent Password.The Current and New Password Looks the Same" },
                { status: 400 }
            )
            
        }
            
        const Salt = await bcrypt.genSalt(11)
        const Sesame = await bcrypt.hash( Password , Salt )
            
        User.Password = Sesame;
        User.Reset_Password_Counter = User.Reset_Password_Counter + 1
        User.Reseting_Expires_In = null
        await User.save()
    
        const Mail_Options = {
            from : "voltantroyer2@gmail.com",
            to : User.Mail,
            subject : "Password has Changed",
            html : `<h1>Congratulations! You have Succesfully Changed Your Password at ${Date.now}<h1/>`
        }
            
        await Transporter.sendMail(Mail_Options)
            
        return NextResponse.json(
            { msg: "Your Password is Succesfully Updat" },
            { status: 200 }
        )
       

    } catch (error) {

        return NextResponse.json(
            { msg: "error" },
            { status: 500 }
        )
        

    }
    
}