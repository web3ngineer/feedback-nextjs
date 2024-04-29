import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
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
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    });
                    // console.log('user', user)
                    if(!user){
                        throw new Error("User not Found!")
                    }
                    if(!user.isVerified){
                        throw new Error("Please Verify your account! or signup again");
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
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID  as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        })
    ],
    callbacks:{
        async signIn({credentials, email, account, user, profile}):Promise<any>{
            // console.log(credentials) // when login with credentials
            // console.log(email) // when login with email

            // when login with authProvider
            // console.log(account)
            // console.log(user)
            // console.log(profile)
           if(account?.provider === 'github' || account?.provider === 'google'){
                await dbConnect();
                try {
                    const existingUser = await UserModel.findOne({ email: user.email?.toString()});
                    if(existingUser && !existingUser.isVerified){
                        console.log('existingUser Verification')

                        existingUser.isVerified=true;
                        const updatedUser = await existingUser.save();
                        console.log("updatedUsed",updatedUser)
                        if(user){
                            user._id = updatedUser._id?.toString();
                            user.isVerified = updatedUser.isVerified;
                            user.username = updatedUser.username;
                            user.isAcceptingMessage = updatedUser.isAcceptingMessage;
                        }

                        return true;  

                    }else if(existingUser && existingUser.isVerified){
                        console.log('existingUser Verified')
                        if(user){
                            user._id = existingUser._id?.toString();
                            user.isVerified = existingUser.isVerified;
                            user.username = existingUser.username;
                            user.isAcceptingMessage = existingUser.isAcceptingMessage;
                        }
                        return true;  

                    }else {
                        const password = Math.random().toString(36).substr(2, 12);
                        const username = user.email?.toString().split("@")[0]; 
                        const hashedPassword = await bcrypt.hash(password, 10); 
                        const newUser = await UserModel.create({
                            email:user.email?.toString(),
                            username,
                            isVerified: true,
                            password:hashedPassword
                        });
                        // console.log('newUser', newUser)
                        if(user){
                            user.id = newUser._id?.toString();
                            user.isVerified = newUser.isVerified;
                            user.username = newUser.username;
                            user.isAcceptingMessage = newUser.isAcceptingMessage;
                        }
                        return true;  
                    }
                } catch (error:any) {
                    console.log("error in auth-provider", error);
                    throw new Error(error.message);
                }
            }
            if(account?.provider === 'credentials'){
                return true
            }
        },
        async jwt({ token, user}) {
            // console.log("User:",user)
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            // console.log("Token:",token)
            return token;
        },
        async session({ session, token }){
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        },
    },
    session:{
        strategy: 'jwt'
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn:'/sign-in',
    },
}
