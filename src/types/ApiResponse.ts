import { Message } from "@/model/user.model";

export interface ApiResponse{
    success: boolean;
    message?: string | null;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>;
}