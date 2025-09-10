"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Heart } from "lucide-react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/"; // sua API Django

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const name = !isLogin ? (form[0] as HTMLInputElement).value : "";
    const email = (form[isLogin ? 0 : 1] as HTMLInputElement).value;
    const password = (form[isLogin ? 1 : 2] as HTMLInputElement).value;

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_URL}api/login/`, {
          username: name,
          password,
          email,
        });
      } else {
        response = await axios.post(`${API_URL}api/register/`, {
          username: name,
          password,
          email,
        });
        setIsLogin(true); // volta para login depois do cadastro
      }
      console.log(response);
      localStorage.setItem("token", response.data.token);
      alert(isLogin ? "Logado com sucesso!" : "Cadastrado com sucesso!");
      router.push("/Funcionarios/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 text-blue-900 relative">
      {/* Logo no canto superior esquerdo */}
      <div className="absolute top-4 left-4">
        <Image
          src="/logoCenid.png"
          alt="LOGOCENID"
          width={250}
          height={300}
        />
      </div>

      {/* Card de Login/Cadastro */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 text-center mb-6">
            {isLogin ? "Login" : "Cadastro"}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Nome completo"
                className="border border-blue-300 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            )}
            <input
              type="email"
              placeholder="E-mail"
              className="border border-blue-300 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="border border-blue-300 rounded-lg px-4 py-3 text-blue-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white py-3 rounded-xl shadow-lg hover:bg-red-600 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Aguarde..."
                : isLogin
                ? "Entrar"
                : "Cadastrar"}
            </button>
          </form>

          <p className="text-center text-blue-700 mt-4">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              type="button"
              onClick={handleToggle}
              className="text-red-600 font-semibold hover:underline"
            >
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>

      {/* Footer fixo */}
      <footer className="bg-blue-700 text-white py-6 w-full mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">
                Centro Interdisciplinar de Diabetes
              </span>
            </div>
            <p className="text-blue-200 text-sm sm:text-base">
              CENID - Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
