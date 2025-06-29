/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import homeImage from '../assets/loginImage.png'
import logoImage from '../assets/logo.png'
import { Input } from '../components/form/Input'
import { Lock, User } from "phosphor-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event: any) {
     event.preventDefault();

    if (!login || !senha) {
      alert('Preencha login e senha');
      return;
    }

     try {
        const response = await axios.post('http://localhost:3000/login', {
          login,
          senha
        });

        const { token, funcionario } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(funcionario));

        if (funcionario.funcao === 'administrador') {
            navigate('/dashboard');
        } else if (funcionario.funcao === 'caixa') {
            navigate('/caixa/dashboard');
        } else if (funcionario.funcao === 'garcom') {
            navigate('/garcom/dashboard');
        } else {
            alert('Função não reconhecida.');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Login ou senha inválidos.');
    }
  }

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
              placeholder="Login"
              name="email"
              icon={<User size={19} className="text-[#FBFEFB]" weight="fill" />}
              value={login}
              onChange={(evt) => setLogin(evt.target.value)}
            />
            <Input
              placeholder="Senha"
              name="password"
              type="password"
              icon={<Lock size={19} className="text-[#FBFEFB]" weight="fill" />}
              value={senha}
              onChange={(evt) => setSenha(evt.target.value)}
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
