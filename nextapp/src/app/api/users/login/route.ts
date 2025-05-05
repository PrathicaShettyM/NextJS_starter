import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        // check if the user exists
        const user = await User.findOne({email}); // since its a db call await it
        if(!user){
            return NextResponse.json({error: "User doesn't exist"}, {status: 400});
        }
        
       // check if the password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400});
        }

        // create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        // create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"}); // this takes time so have an await here

        // send this token to user cookie
        const response = NextResponse.json({
            message: "Login successful!!",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error: any){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}