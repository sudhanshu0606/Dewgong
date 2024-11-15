import { Users } from "@/Models/Users";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
    const Username = params.params;
    console.log(Username)

    const User = await Users.findById( Username )
    if(!User){
        return NextResponse.json(
            {msg:"no user found"},
            {status:404}
        )
    }
    return NextResponse.json(
        { msg: "Found",User },
        { status: 200 }
    )
}
