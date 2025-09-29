"use client";

import {
  Activity,
  Brain,
  Dumbbell,
  Apple,
  Pill,
  FlaskConical,
  Calculator,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Sidebar from "@/components/LayoutSidebar";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

// Importa todos os formulários
import FarmaciaForm from "@/components/Forms/farmacia-forms";
import EdFisicaForm from "@/components/Forms/edFisica-forms";
import AntropometriaForm from "@/components/Forms/antropometria-forms";

export default function Consultas() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const router = useRouter();
    const params = useParams();
    const id = params?.id;
  
    const [paciente, setPaciente] = useState<any>(null);
  
    const fetchPaciente = async () => {
      const data = await apiFetch(`/api/pacientes/${id}/`, true)
      setPaciente(data)
    }
  
    useEffect(() => {
      if (!id) return;
      
      fetchPaciente();
    }, [id])

  // Função para renderizar o formulário correto
  const renderForm = () => {
    switch (selectedForm) {
      case "farmacia":
        return <FarmaciaForm patientData={paciente} />;
      case "edFisica":
        return <EdFisicaForm patientData={paciente} />;
      case "calculadora":
        return <AntropometriaForm patientData={paciente} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto relative">
          {/* Botão no canto superior direito */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.back()}
              className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Paciente
            </button>
          </div>

          {/* Card de Selecionar Especialidade */}
          <Card className="shadow-lg rounded-lg border border-blue-200 mb-6">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl font-bold text-blue-900">
                Iniciar Consulta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">
                Selecione a Especialidade*
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all">
                  <Activity className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Medicina</span>
                </button>

                <button className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all">
                  <Brain className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Psicologia</span>
                </button>

                {/* Educação Física */}
                <button
                  onClick={() => setSelectedForm("edFisica")}
                  className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
                >
                  <Dumbbell className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Educação Física</span>
                </button>

                <button className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all">
                  <Apple className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Nutrição</span>
                </button>

                {/* Farmácia */}
                <button
                  onClick={() => setSelectedForm("farmacia")}
                  className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
                >
                  <Pill className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Farmácia</span>
                </button>

                <button className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all">
                  <FlaskConical className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Bioquímica</span>
                </button>

                {/* Calculadora */}
                <button
                  onClick={() => setSelectedForm("calculadora")}
                  className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
                >
                  <Calculator className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Calculadora</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Formulário exibido abaixo do Card */}
          {selectedForm && <div className="mt-6">{renderForm()}</div>}

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
      </main>
    </div>
  );
}
