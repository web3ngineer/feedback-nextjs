'use client'
import {MessageCard} from '@/components/MessageCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/user.model';
import { acceptMessageSchema } from '@/Schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, {AxiosError} from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DeleteUser } from './DeleteUser';

function Dashboard() {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const {data:session} = useSession()

  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form;

  const acceptMessage = watch('acceptMessage')

  const fetchAcceptMessage = useCallback(async ()=>{
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue("acceptMessage", response.data.isAcceptingMessage)
    } catch (error:any) {
      console.error("Failed to fetch message settings", error)
      const AxiosError = error as AxiosError<ApiResponse>
      let errorMessage = AxiosError?.response?.data?.message || "failed to fetch message settings"
      toast({
        title:"Error",
        description: errorMessage,
        variant:"destructive"
      })
      
    } finally{
      setIsSwitchLoading(false)
    }
  },[setValue,toast])

  const fetchMessages = useCallback( async (refresh:boolean = false)=> {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get('/api/get-messages')
      // console.log(response)
      setMessages(response.data.messages || []);
      if(refresh){
        toast({
          title:'Messages refreshed',
        })
      }
    } catch (error:any) {
      console.error("Failed to fetch messages", error)
      const AxiosError = error as AxiosError<ApiResponse>
      let errorMessage = AxiosError?.response?.data?.message || "failed to fetch messages"
      toast({
        description: errorMessage,
        variant:"destructive"
      }) 
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading, setMessages, toast])

  useEffect( ()=>{
    if (!session || !session.user){
      return ;
    }
    fetchMessages()
    fetchAcceptMessage()
  },[session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async ()=> {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-message',{acceptMessage:!acceptMessage})
      setValue('acceptMessage', !acceptMessage)
      toast({
        title: response.data.message?.toString(),
        variant:'default'
      })
    } catch (error) {
      console.error("Failed to change message setting", error)
      const AxiosError = error as AxiosError<ApiResponse>
      let errorMessage = AxiosError?.response?.data?.message || "failed to change message setting"
      toast({
        title:"Error",
        description: errorMessage,
        variant:"destructive"
      }) 
    }
  }

  const handleDeleteUserConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-user`);
      if(response.data.success){
        toast({
          title: response.data.message?.toString(),
        });
        signOut();
      }
    } catch (error:any) {
      toast({
        title: 'Error',
        description:error.response?.data.message ?? 'Failed to delete User',
        variant: 'destructive',
      });
    } 
  };

  if(!session || !session.user){
    return(
      <div className='container'>
        <SkeletonLoader/>
      </div>
    )
  }
  // console.log(session.user)
  const { username } = session.user as User;
  
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="pt-40 md:pt-28 sm:mx-4 lg:mx-8 xl:mx-auto bg-white w-full max-w-6xl">
      <div className='flex flex-col gap-2 mb-4 sm:justify-between sm:flex-row'>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <DeleteUser handleDeleteUser={handleDeleteUserConfirm} />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;