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
  CalendarDays,
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

// 🔹 Formulários placeholders para as outras especialidades
const PlaceholderForm = ({ title }: { title: string }) => (
  <div className="p-6 border rounded-lg bg-gray-50 shadow-inner">
    <p className="text-gray-600 text-center">
      O formulário de <strong>{title}</strong> ainda não foi implementado.
    </p>
  </div>
);

export default function Consultas() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [histories, setHistories] = useState<any[]>([]);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [paciente, setPaciente] = useState<any>(null);

  const fetchPaciente = async () => {
    const data = await apiFetch(`/api/pacientes/${id}/`, true);
    setPaciente(data);
  };

  useEffect(() => {
    if (!id) return;
    fetchPaciente();
  }, [id]);

  // Simulação de históricos
  const fetchHistories = async (especialidade: string) => {
    const mock = [
      { id: 1, data: "22/09/2025", especialidade },
      { id: 2, data: "23/09/2025", especialidade },
      { id: 3, data: "01/10/2025", especialidade },
    ];
    setHistories(mock);
  };

  const handleSelectEspecialidade = (especialidade: string) => {
    setSelectedForm(especialidade);
    setSelectedHistory(null);
    fetchHistories(especialidade);
  };

  const renderForm = () => {
    switch (selectedForm) {
      case "medicina":
        return <PlaceholderForm title="Medicina" />;
      case "psicologia":
        return <PlaceholderForm title="Psicologia" />;
      case "edFisica":
        return <EdFisicaForm patientData={paciente} />;
      case "nutricao":
        return <PlaceholderForm title="Nutrição" />;
      case "farmacia":
        return <FarmaciaForm patientData={paciente} />;
      case "bioquimica":
        return <PlaceholderForm title="Bioquímica" />;
      case "calculadora":
        return <AntropometriaForm patientData={paciente} />;
      default:
        return null;
    }
  };

  const especialidades = [
    { key: "medicina", label: "Medicina", icon: Activity },
    { key: "psicologia", label: "Psicologia", icon: Brain },
    { key: "edFisica", label: "Educação Física", icon: Dumbbell },
    { key: "nutricao", label: "Nutrição", icon: Apple },
    { key: "farmacia", label: "Farmácia", icon: Pill },
    { key: "bioquimica", label: "Bioquímica", icon: FlaskConical },
    { key: "calculadora", label: "Calculadora", icon: Calculator },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
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

          {/* Card de especialidades */}
          <Card className="shadow-lg rounded-lg border border-blue-200 mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">
                Selecione a Especialidade*
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {especialidades.map((esp) => {
                  const Icon = esp.icon;
                  return (
                    <button
                      key={esp.key}
                      onClick={() => handleSelectEspecialidade(esp.key)}
                      className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                        selectedForm === esp.key
                          ? "border-red-500 border-2 bg-red-50"
                          : "border-blue-200 hover:border-red-500 hover:bg-blue-50"
                      }`}
                    >
                      <Icon className="h-8 w-8 mb-2 text-red-600" />
                      <span className="text-blue-900 font-medium">
                        {esp.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lista de históricos */}
          {selectedForm && !selectedHistory && (
            <Card className="shadow-md border border-blue-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Histórico de{" "}
                  {especialidades.find((e) => e.key === selectedForm)?.label}
                </h3>

                {histories.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {histories.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => setSelectedHistory(h.data)}
                        className="group text-left flex items-center justify-between px-4 py-3 border rounded-md transition-all hover:bg-blue-50 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-blue-600 group-hover:text-red-600" />
                          <span className="text-blue-900 font-medium">
                            Consulta do dia {h.data}
                          </span>
                        </div>
                        <span className="text-sm text-blue-700 opacity-70 group-hover:opacity-100">
                          Ver formulário →
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Nenhum histórico encontrado.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Formulário do histórico selecionado */}
          {selectedHistory && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-800">
                  Formulário -{" "}
                  {
                    especialidades.find((e) => e.key === selectedForm)?.label
                  }{" "}
                  ({selectedHistory})
                </h3>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="text-sm text-blue-700 underline hover:text-blue-900"
                >
                  ← Voltar aos históricos
                </button>
              </div>
              {renderForm()}
            </div>
          )}

          {/* Logo fixa */}
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
