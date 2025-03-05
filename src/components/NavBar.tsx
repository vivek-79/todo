
"use client"

import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavBar = () => {

       const path = usePathname()
        console.log(path)
  return (
    <nav className="w-full max-w-2xl mx-auto flex justify-between bg-[#ffffff]/40 backdrop-blur-md py-1 px-4 rounded-full items-center">
        <Link href="/" className="bg-gradient-to-b from-[#f588f9] via-[#9561e9] to-[#fff] text-transparent bg-clip-text text-2xl font-bold ">Todo</Link>

        <div className="flex gap-2 text-sm items-center">
              <Link className={`nav ${path == "/new-todo" ? 'after:h-[4px]' :'after:h-[0px]'}`} href="/new-todo">New</Link>
              <Link className={`nav ${path == "/" ? 'after:h-[4px]' : 'after:h-[0px]'}`} href="/">Pending</Link>
              <Link className={`nav ${path == "/completed" ? 'after:h-[4px]' : 'after:h-[0px]'}`} href="/completed">Completed</Link>
        </div>
        <SignedIn>
            <UserButton/>
        </SignedIn>
    </nav>
  )
}

export default NavBar