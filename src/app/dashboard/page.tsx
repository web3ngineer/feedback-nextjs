'use client'

import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/user.model';
import React, { useState } from 'react';

function Dashboard() {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  return (
    <div className='flex justify-center items-center min-h-screen text-base md:text-4xl text-teal-500'>
      
    </div>
  )
}

export default Dashboard