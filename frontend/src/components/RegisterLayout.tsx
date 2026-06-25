import React, { type ReactNode } from 'react'
import TextLink from './TextLink'
import ButtonPrimary from './ButtonPrimary'

interface RegisterLayoutProps {
  children: ReactNode
}
const RegisterLayout = ({ children }: RegisterLayoutProps) => {
  return (
    <div id='container' className='w-full min-h-dvh bg-[url(/bg-login.svg)] bg-no-repeat bg-cover flex justify-center items-center'>
      <div id='form-box' className='bg-slate-800 w-2/4 rounded-lg flex flex-col gap-5 items-center py-10 text-slate-300 px-10 my-5'>
        {children}
      </div>
    </div>
  )
}

export default RegisterLayout