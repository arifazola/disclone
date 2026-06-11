import React, { useState } from 'react'
import ButtonPrimary from '../components/ButtonPrimary'
import TextLink from '../components/TextLink'
import RegisterLayout from '../components/RegisterLayout'
import Input from '../components/Input'
import { useNavigate } from 'react-router'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onEmailChanged = (text: string) => {
        setEmail(text)
    }

    const onPasswordChanged = (text: string) => {
        setPassword(text)
    }

    const onLoginClicked = async () => {
        try{
            setLoading(true)
            const formData = new FormData()

            formData.append("email", email)
            formData.append("password", password)
            const login = await fetch("http://localhost:8080/login", {
                method: "POST",
                credentials: "include",
                body: formData
            })

            if(login.ok){
                navigate("/")
            } 

        } catch(error: any){
            console.log("error login", error)
        } finally {
            setLoading(false)
        }
        
    }
  return (
    <RegisterLayout>
        <span className='font-bold text-2xl'>Welcome back</span>
            <span className=''>We're so excited to see you again</span>

            <Input label='Email or phone number' onInputChanged={onEmailChanged} />

            <Input label='Password' onInputChanged={onPasswordChanged} type='password' />
            <span className='w-full flex'>
                <TextLink text='Forgot your password' url='/forgot-password' />
            </span>
            <ButtonPrimary text='Add Friend' onClick={onLoginClicked} isLoading={loading}/>
            <span className='w-full flex'>Need an account?<TextLink text='Register' url='/register'/></span>
    </RegisterLayout>
  )
}

export default Login