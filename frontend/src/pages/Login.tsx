import React, { useState } from 'react'
import ButtonPrimary from '../components/ButtonPrimary'
import TextLink from '../components/TextLink'
import RegisterLayout from '../components/RegisterLayout'
import Input from '../components/Input'
import { useNavigate, useNavigation } from 'react-router'
import Loading from '../components/Loading'
import { BASE_URL } from '../consts/const'
import { useToast } from '../contexts/ToastContext'
import type { ResponseModel } from '../models/responseModel'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { setToastMessage } = useToast()

    const onEmailChanged = (text: string) => {
        setEmail(text)
    }

    const onPasswordChanged = (text: string) => {
        setPassword(text)
    }

    const onLoginClicked = async () => {
        try {
            setLoading(true)
            const formData = new FormData()

            formData.append("email", email)
            formData.append("password", password)
            const login = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                credentials: "include",
                body: formData
            })

            const res = await login.json()

            if (login.ok) {
                setToastMessage("")
                window.localStorage.setItem("userid", res.user.ID)
                navigate("/")
            } else {
                console.log("error res", res)
                throw new Error(JSON.stringify(res))
            }
        } catch (error: any) {
            const err = error as Error
            const parsedError = JSON.parse(err.message) as ResponseModel<any>
            console.log("error login", parsedError)
            setToastMessage(parsedError.Message)
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
            <ButtonPrimary text='Login' onClick={onLoginClicked} isLoading={loading} />
            <span className='w-full flex'>Need an account?<TextLink text='Register' url='/register' /></span>
        </RegisterLayout>
    )
}

export default Login