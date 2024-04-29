'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/Schemas/signInSchema';
import Image from 'next/image';
import googleIcon from '../../../../public/assets/icons8-google.svg';
import githubIcon from '../../../../public/assets/icons8-github.svg';


export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  type SignInFormData = z.infer<typeof signInSchema>

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error){
      if (result.error === 'CredentialsSignin'){
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }
    // If successful authentication, redirect home
    if(result?.url){
      toast({
        title: 'Login Success',
        description: 'User logged in successfully!',
        variant: 'default',
      });
      router.replace('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full' type="submit">Sign In</Button>
          </form>
        </Form>
        <div className='mt-6 flex flex-col justify-center items-center'>
            <p className='px-2 -m-3 bg-white w-8 z-10 text-gray-500'>or</p>
            <Separator/>
        </div>
        <div className='grid md:grid-cols-2 gap-y-3 justify-center items-center md:gap-x-3'>
          <Button 
            type='button' 
            onClick={async() => await signIn('google', {redirect:false})} 
            className='bg-white rounded-lg shadow-md hover:bg-white hover:shadow-xl text-black p-2'
          >
            <div className='flex items-center gap-2'>
              <Image src={googleIcon} alt="Google" width={25} height={25}/>
              <p className='font-normal'>Sign in with Google</p>
            </div>
          </Button>
          <Button 
            type='button' 
            onClick={async() => await signIn('github', {redirect:false})} 
            className='bg-white rounded-lg shadow-md hover:bg-white hover:shadow-xl text-black p-2'
          >
            <div className='flex items-center gap-2'>
              <Image src={githubIcon} alt="Google" width={25} height={25}/>
              <p className='font-normal'>Sign in with GitHub</p>
            </div>
          </Button>
        </div>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}