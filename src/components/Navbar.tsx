'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import Image from 'next/image'
import Logo from '../../public/android-chrome-512x512.png'

const Navbar = () => {
    const { data:session } = useSession()
    const user = session?.user as User

  return (
    <nav className='p-2 md:p-3 shadow-md w-full fixed bg-white z-10'>
        <div className='container mx-auto flex flex-col gap-2 md:flex-row justify-between items-center'>
            <a href="/">
                <div className='flex'>
                        <Image src={Logo} alt="Logo" width={45} height={45}/>
                        <p className='flex justify-center items-center p-2 text-xl tracking-tight text-purple-800 font-serif font-bold'>Lukka Chhuppi</p>
                </div>
            </a>
            {
                session ? (
                    <>
                        <span className='mr-4'> Welcome, {user.username || user.email}</span>
                        <Link href={'/'}>
                            <Button onClick={() => signOut()} className='w-full md:w-auto'>Logout</Button>
                        </Link>
                    </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button className='w-full md:w-auto'>SignIn</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar