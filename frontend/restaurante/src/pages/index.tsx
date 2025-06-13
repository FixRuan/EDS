import { useState } from 'react'
import homeImage from '../assets/loginImage.png'
import logoImage from '../assets/logo.png'
import { Input } from '../components/form/Input'
import { Lock, User } from "phosphor-react";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  function handleLogin(){}

  return (
    <>
      <header>
        <title>Login</title>
      </header>
      <div className="w-full h-screen overflow-auto flex flex-col-reverse md:flex-row">
        <div className="md:w-[53%] h-full p-2 flex flex-col justify-between">
          <div>
            <img src={homeImage} alt="" className='ml-12'/>
          </div>
        </div>
        <div className="md:w-[47%] h-full p-2 bg-[#18191A] flex flex-col items-center">

          <img src={logoImage} alt="" className='mt-8'/>

          <form
            onSubmit={handleLogin}
            method="post"
            className="flex flex-col items-center mt-24 gap-5"
          >
            <Input
              placeholder="Email"
              name="email"
              type="email"
              icon={<User size={19} className="text-[#FBFEFB]" weight="fill" />}
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              icon={<Lock size={19} className="text-[#FBFEFB]" weight="fill" />}
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />

            <button
              className="mt-3 mb-10 w-48 h-14 flex justify-center items-center rounded-md bg-yellow-500 text-xl text-white hover:brightness-90 transition"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
