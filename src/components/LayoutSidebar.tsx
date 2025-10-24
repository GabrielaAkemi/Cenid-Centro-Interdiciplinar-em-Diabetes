"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { PieChart, UserPlus, ClipboardPlus } from "lucide-react"; // Troquei o ícone

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-blue-700">
        CENID
      </div>

      <nav className="flex-1 mt-6 flex flex-col">
        <button
          className={`flex items-center gap-2 px-6 py-3 w-full text-left hover:bg-blue-700 ${
            pathname === "/Funcionarios/dashboard" ? "bg-blue-900 font-semibold" : ""
          }`}
          onClick={() => router.push("/Funcionarios/dashboard")}
        >
          <PieChart className="w-4 h-4" /> Dashboard
        </button>

        {/* Botão para cadastro de pacientes com novo ícone */}
        <button
          className={`flex items-center gap-2 px-6 py-3 w-full text-left hover:bg-blue-700 ${
            pathname === "/Funcionarios/cadastrarPacientes" ? "bg-blue-900 font-semibold" : ""
          }`}
          onClick={() => router.push("/Funcionarios/cadastrarPacientes")}
        >
          <ClipboardPlus className="w-4 h-4" /> Cadastrar Paciente
        </button>



        <button
          className={`flex items-center gap-2 px-6 py-3 w-full text-left hover:bg-blue-700 ${
            pathname === "/Funcionarios/pacientesCadastrados" ? "bg-blue-900 font-semibold" : ""
          }`}
          onClick={() => router.push("/Funcionarios/pacientesCadastrados")}
        >
          <UserPlus className="w-4 h-4" /> Pacientes
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
