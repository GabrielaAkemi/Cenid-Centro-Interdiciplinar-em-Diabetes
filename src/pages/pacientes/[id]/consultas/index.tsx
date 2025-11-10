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
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Sidebar from "@/components/LayoutSidebar";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

import FarmaciaForm from "@/components/Forms/farmacia-forms";
import EdFisicaForm from "@/components/Forms/edFisica-forms";
import AntropometriaForm from "@/components/Forms/antropometria-forms";
import BioquimicaForm from "@/components/Forms/bioQuimica-forms";
import MedicinaForm from "@/components/Forms/medicina-forms";
import PsicologiaForm from "@/components/Forms/psicologia-forms";
import NutricaoForm from "@/components/Forms/nutricao-forms";

interface Consulta {
  id: number;
  tipo: string;
  data_consulta: string;
  finalizado?: boolean;
}

export default function Consultas() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [selectedConsulta, setSelectedConsulta] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [paciente, setPaciente] = useState<any>(null);
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  const endpointMap: Record<string, string> = {
    consultacalculadora: "consulta-calculadora",
    consultaedfisica: "consulta-ed-fisica",
    consultafarmacia: "consulta-farmacia",
  };

  const fetchPaciente = async () => {
    const data = await apiFetch(`/api/pacientes/${id}/`, true);
    setPaciente(data);
  };

  const fetchConsultas = async () => {
    if (!id) return;

    const [naoFinalizadas, finalizadas] = await Promise.all([
      apiFetch(
        `/api/pacientes/${id}/historico-consultas/?finalizado=false`,
        true
      ) as Promise<Consulta[]>,
      apiFetch(
        `/api/pacientes/${id}/historico-consultas/?finalizado=true`,
        true
      ) as Promise<Consulta[]>,
    ]);

    setConsultas([...naoFinalizadas, ...finalizadas]);
  };

  useEffect(() => {
    if (!id) return;
    fetchPaciente();
    fetchConsultas();
  }, [id]);

  const getBorderColor = (tipo: string) => {
    const anoAtual = new Date().getFullYear();

    const consulta = consultas.find(
      (c) =>
        c.tipo === tipo && new Date(c.data_consulta).getFullYear() === anoAtual
    );

    if (!consulta) {
      return "border-red-500 hover:border-red-700";
    }

    return consulta.finalizado
      ? "border-green-400 hover:border-green-600"
      : "border-yellow-400 hover:border-yellow-600";
  };

  // 🔹 Lógica de seleção com busca de consulta não finalizada
  const handleSelectForm = async (tipoForm: string) => {
    setSelectedForm(tipoForm);
    setSelectedConsulta(null);

    // procura consulta não finalizada desse tipo
    const consulta = consultas.find(
      (c) => c.tipo === tipoForm && c.finalizado === false
    );

    if (consulta && endpointMap[tipoForm]) {
      try {
        const endpoint = endpointMap[tipoForm];
        const data = await apiFetch(`/api/${endpoint}/${consulta.id}/`, true);
        setSelectedConsulta(data);
      } catch (error) {
        console.error("Erro ao buscar dados da consulta:", error);
      }
    }
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "consultamedicina":
        return <MedicinaForm />;
      case "consultapsicologia":
        return <PsicologiaForm patientData={paciente}/>;
      case "consultaedfisica":
        return (
          <EdFisicaForm patientData={paciente} initialData={selectedConsulta} />
        );
      case "consultanutricao":
        return <NutricaoForm />;
      case "consultafarmacia":
        return (
          <FarmaciaForm patientData={paciente} initialData={selectedConsulta} />
        );
      case "consultabioquimica":
        return <BioquimicaForm patientData={paciente}/>;
      case "consultacalculadora":
        return (
          <AntropometriaForm
            patientData={paciente}
            initialData={selectedConsulta}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex-1 container mx-auto py-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">
              Iniciar Consulta
            </h1>
            <button
              onClick={() => router.back()}
              className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Paciente
            </button>
          </div>

          <Card className="shadow-lg rounded-lg border border-blue-200 mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">
                Selecione a Especialidade*
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button
                  onClick={() => handleSelectForm("consultamedicina")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultamedicina"
                  )} transition-all`}
                >
                  <Activity className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Medicina</span>
                </button>

                <button
                  onClick={() => handleSelectForm("consultapsicologia")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultapsicologia"
                  )} transition-all`}
                >
                  <Brain className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Psicologia</span>
                </button>

                <button
                  onClick={() => handleSelectForm("consultaedfisica")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultaedfisica"
                  )} transition-all`}
                >
                  <Dumbbell className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Educação Física</span>
                </button>

                <button
                  onClick={() => handleSelectForm("consultanutricao")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultanutricao"
                  )} transition-all`}
                >
                  <Apple className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Nutrição</span>
                </button>

                <button
                  onClick={() => handleSelectForm("consultafarmacia")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultafarmacia"
                  )} transition-all`}
                >
                  <Pill className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Farmácia</span>
                </button>

                <button
                  onClick={() => handleSelectForm("consultabioquimica")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultabioquimica"
                  )} transition-all`}
                >
                  <FlaskConical className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Bioquímica</span>
                </button>

                <button
                  onClick={() => handleSelectForm("consultacalculadora")}
                  className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 ${getBorderColor(
                    "consultacalculadora"
                  )} transition-all`}
                >
                  <Calculator className="h-8 w-8 mb-2 text-red-600" />
                  <span className="text-blue-900">Calculadora</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {selectedForm && <div className="mt-6">{renderForm()}</div>}

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
