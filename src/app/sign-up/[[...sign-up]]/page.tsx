import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return ( 
      <div className='w-full flex items-center justify-center min-h-screen '>
        <SignUp />
      </div>
    )
}