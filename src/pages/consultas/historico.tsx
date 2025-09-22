"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Stethoscope } from "lucide-react";
import Image from "next/image";
import LayoutSidebar from "@/components/LayoutSidebar"; // Importando a Sidebar

// Exemplo de histórico de consultas
const consultas = [
  {
    data: "2025-08-01",
    profissional: "Dra. Maria Silva",
    tipo: "Avaliação Geral",
    diagnostico: "Diabetes Tipo 1",
  },
  {
    data: "2025-08-15",
    profissional: "Dr. João Pereira",
    tipo: "Acompanhamento",
    diagnostico: "Diabetes Tipo 1",
  },
];

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return "Data inválida";
  }
};

const Historico = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <LayoutSidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 container mx-auto py-8 relative">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">
            Histórico de Consultas
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Paciente
          </button>
        </div>

        {/* Lista de consultas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultas.length > 0 ? (
            consultas.map((consulta, index) => (
              <Card
                key={index}
                className="bg-white border border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-900 font-semibold text-lg">
                    {consulta.tipo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center text-blue-900">
                    <Calendar className="mr-2 h-5 w-5" />
                    {formatDate(consulta.data)}
                  </p>
                  <p className="flex items-center text-blue-900">
                    <Stethoscope className="mr-2 h-5 w-5" />
                    {consulta.profissional}
                  </p>
                  <p className="text-blue-700 font-medium">
                    Diagnóstico: {consulta.diagnostico}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-blue-900">Nenhuma consulta registrada.</p>
          )}
        </div>

        {/* Logo fixa no canto inferior direito */}
        <div className="fixed bottom-4 right-4 z-50">
          <Image
            src="/logoCenid.png"
            alt="LOGOCENID"
            width={150}
            height={200}
            className="opacity-70"
          />
        </div>
      </div>
    </div>
  );
};

export default Historico;
