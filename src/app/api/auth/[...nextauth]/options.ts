import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs';


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            // {email: credentials.identifier},
                            {email: credentials.email},
                            {username: credentials.username},
                        ]
                    });

                    if(!user){
                        throw new Error("User not Found!")
                    }
                    if(!user.isVerified){
                        throw new Error("Please Verify  your account!");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user;
                        
                    }else{
                        throw new Error('Incorrect Password');
                    }

                } catch (error: any) {
                    throw new Error(error.message)
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }

            return token;
        },
        async session({ session, token }) {

            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            
            }

            return session;
        },
    },
    pages: {
        signIn:'/sign-in',
    },
    session:{
        strategy: 'jwt'
    },
    secret: process.env.NEXT_AUTH_SECRET,

}
