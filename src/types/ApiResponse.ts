import { Message, User } from "@/model/user.model";

export interface ApiResponse{
    success: boolean;
    message?: string | null;
    isAcceptingMessage?: boolean;
    data?:User;
    messages?: Array<Message>;
}