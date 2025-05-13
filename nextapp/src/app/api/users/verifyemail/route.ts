import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";


// database connection
connect();

export async function POST(request: NextRequest){
    try {
        // grab th etoken from req.body
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log(token);

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}}); // gt means greater than
        
        if(!user){
            return NextResponse.json({error: "Invalid token"}, {"status": 400});
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined; // reset this value: use undefined
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}