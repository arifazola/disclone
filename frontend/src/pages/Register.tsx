import React, { useState } from 'react'
import RegisterLayout from '../components/RegisterLayout'
import ButtonPrimary from '../components/ButtonPrimary'
import TextLink from '../components/TextLink'
import Input from '../components/Input'

const Register = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onRegister = async () => {
        try {
            setLoading(true)
            const formData = new FormData()

            formData.append("email", email)
            formData.append("username", username)
            formData.append("password", password)
            const register = await fetch("http://192.168.1.11:8080/account", {
                method: "POST",
                credentials: "include",
                body: formData
            })

            const res = await register.json()

            console.log("login result", res)
        } catch (error: any) {

        } finally {
            setLoading(false)
        }
    }
    return (
        <RegisterLayout>
            <span className='font-bold text-2xl'>Welcome back</span>
            <span className=''>We're so excited to see you again</span>

            <Input label='Email' onInputChanged={setEmail} />

            <Input label='Username' onInputChanged={setUsername} />

            <Input label='Password' type='password' onInputChanged={setPassword} />

            <span className='w-full flex'>
                <TextLink text='Forgot your password' url='/forgot-password' />
            </span>
            <ButtonPrimary text='Add Friend' onClick={onRegister} isLoading={loading} />
            <span className='w-full flex'>Have an account?<TextLink text='Login' url='/login' /></span>
        </RegisterLayout>
    )
}

export default Register