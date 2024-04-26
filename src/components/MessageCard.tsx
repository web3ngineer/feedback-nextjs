'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger, 
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Delete } from "lucide-react"
import { Message } from "@/model/user.model"
import { useToast } from "./ui/use-toast"
import axios from "axios"

type MessageCardProps ={
    message: Message;
    onMessageDelete: (messageId:string) => void ;
}

function MessageCard({message, onMessageDelete}: MessageCardProps) {

    const {toast} = useToast();

    const handleDeleteConfirm = async() => {

        const response = await axios.delete(`/api/delete-message/${message._id}`)
        toast({
            title:response.data.message,
        })
        onMessageDelete(message._id)
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive"><Delete className="w-4 h-4"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this message 
                      and remove your data from our server.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
    </Card>
  )
}

export default MessageCard