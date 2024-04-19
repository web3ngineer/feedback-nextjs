import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string,

    }
    interface Token{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string,

    }
    interface Session{
        user:{
            _id?: string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            username?: string,
        } & DefaultSession['user']   // Inherit the default session properties.
    }
    // another way is written below 
    // interface JWT{
    //     _id?: string,
    //     isVerified?: boolean,
    //     isAcceptingMessages?: boolean,
    //     username?: string,
    // }  
}

declare module 'next-auth/jwt' {
    interface JWT{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string,
    }
}