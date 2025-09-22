import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Heart } from "lucide-react";

const HomePage: React.FC = () => {
  const router = useRouter();

  const navigate = (path: string) => router.push(path);

  return (
    <div className="relative min-h-screen bg-blue-50 text-blue-900 flex flex-col">
      <div className="absolute top-4 left-4">
        <Image
          src="/logoCenid.png"
          alt="LOGOCENID"
          width={250}
          height={300}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 text-center">
          Bem-vindo ao <span className="text-red-600">CENID</span>
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium mt-2 text-blue-700 text-center">
          Centro Interdisciplinar de Diabetes
        </h2>

        <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
          <button
            className="bg-red-500 text-white px-10 py-5 rounded-xl shadow-lg hover:bg-red-600 transition-all font-semibold text-lg"
            onClick={() => navigate("/Funcionarios/login")}
          >
            Login / Cadastro
          </button>
        </div>
      </div>

      <footer className="bg-blue-700 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Centro Interdisciplinar de Diabetes</span>
            </div>
            <p className="text-blue-200 mb-1">CENID - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
