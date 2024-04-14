import { Message } from "@/model/user.model";

export interface ApiResponse{
    success: boolean;
    message?: string | null;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
}