"use client";

import Sidebar from "@/components/LayoutSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import {
  Activity,
  Apple,
  ArrowLeft,
  Brain,
  Calculator,
  CalendarDays,
  Dumbbell,
  FlaskConical,
  Pill,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AntropometriaForm from "@/components/Forms/antropometria-forms";
import EdFisicaForm from "@/components/Forms/edFisica-forms";
import FarmaciaForm from "@/components/Forms/farmacia-forms";

// 🔹 Interface para tipar o item do histórico
interface HistoryItem {
  id: number;
  data: string;
  especialidade: string;
  consulta_finalizada: boolean; // Campo de status
}

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
  const [selectedHistoryData, setSelectedHistoryData] = useState<any | null>(
    null,
  );
  const [histories, setHistories] = useState<HistoryItem[]>([]); // Usa a interface
  const [paciente, setPaciente] = useState<any>(null);

  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const fetchPaciente = async () => {
    const data = await apiFetch(`/api/pacientes/${id}/`, true);
    setPaciente(data);
  };

  useEffect(() => {
    if (!id) return;
    fetchPaciente();
  }, [id]);

  const fetchConsultaDetalhes = async (
    especialidade: string,
    idConsulta: number,
  ) => {
    try {
      const endpointMap: Record<string, string> = {
        consultacalculadora: "consulta-calculadora",
        consultaedfisica: "consulta-ed-fisica",
        consultafarmacia: "consulta-farmacia",
      };

      const endpoint = endpointMap[especialidade];
      if (!endpoint) {
        console.error("Especialidade sem endpoint configurado:", especialidade);
        return;
      }

      const data: any = await apiFetch(`/api/${endpoint}/${idConsulta}/`, true);

      const anexos: any = await apiFetch(
        `/api/anexos/?content_type=${especialidade}&object_id=${idConsulta}`,
        true
      );

      setSelectedHistoryData({
        ...data,
        anexos,
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
    }
  };

  const fetchHistories = async (especialidade: string) => {
    const data: any = await apiFetch(
      `/api/pacientes/${id}/historico-consultas?tipo=${especialidade}`,
      true,
    );

    // Mapeia os dados da API para a interface HistoryItem
    const cleanData: HistoryItem[] = data.map((consulta: any) => {
      

      return {
        id: consulta.id,
        data: consulta.data_consulta
          ? new Date(consulta.data_consulta).toLocaleDateString("pt-BR")
          : "N/A",
        especialidade,
        consulta_finalizada: consulta.consulta_finalizada, // Salva o status
      };
    });

    setHistories(cleanData);
  };

  const handleSelectEspecialidade = (especialidade: string) => {
    setSelectedForm(especialidade);
    setSelectedHistory(null);
    setSelectedHistoryData(null);
    setHistories([]);
    fetchHistories(especialidade);
  };

  const renderForm = () => {
    if (
      (selectedForm === "consultafarmacia" ||
        selectedForm === "consultaedfisica" ||
        selectedForm === "consultacalculadora") &&
      !selectedHistoryData
    ) {
      return; // Aguarda os dados serem carregados
    }
    switch (selectedForm) {
      case "consultamedicina":
        return <PlaceholderForm title="Medicina" />;
      case "consultapsicologia":
        return <PlaceholderForm title="Psicologia" />;
      case "consultaedfisica":
        return <EdFisicaForm patientData={paciente} initialData={selectedHistoryData} somenteLeitura={true} attachments={selectedHistoryData?.anexos || []}/>;
      case "consultanutricao":
        return <PlaceholderForm title="Nutrição" />;
      case "consultafarmacia":
        return <FarmaciaForm patientData={paciente} initialData={selectedHistoryData} somenteLeitura={true} attachments={selectedHistoryData?.anexos || []}/>;
      case "consultabioquimica":
        return <PlaceholderForm title="Bioquímica" />;
      case "consultacalculadora":
        return <AntropometriaForm patientData={paciente} initialData={selectedHistoryData} somenteLeitura={true} attachments={selectedHistoryData?.anexos || []}/>;
      default:
        return null;
    }
  };

  const especialidades = [
    { key: "consultamedicina", label: "Medicina", icon: Activity },
    { key: "consultapsicologia", label: "Psicologia", icon: Brain },
    { key: "consultaedfisica", label: "Educação Física", icon: Dumbbell },
    { key: "consultanutricao", label: "Nutrição", icon: Apple },
    { key: "consultafarmacia", label: "Farmácia", icon: Pill },
    { key: "consultabioquimica", label: "Bioquímica", icon: FlaskConical },
    { key: "consultacalculadora", label: "Calculadora", icon: Calculator },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="flex-1 container mx-auto py-8 relative">
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

          {selectedForm && !selectedHistory && (
            <Card className="shadow-md border border-blue-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Histórico de{" "}
                  {especialidades.find((e) => e.key === selectedForm)?.label}
                </h3>

                {histories.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {histories.map((h: HistoryItem) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          setSelectedHistory(h.data);
                          fetchConsultaDetalhes(selectedForm!, h.id);
                        }}
                        className="group text-left flex items-center justify-between px-4 py-3 border rounded-md transition-all hover:bg-blue-50 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-5 w-5 text-blue-600 group-hover:text-red-600" />
                          <span className="text-blue-900 font-medium">
                            Consulta do dia {h.data}
                          </span>

                          {/* --- BADGES DE STATUS --- */}
                          {h.consulta_finalizada ? (
                            <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              Finalizada
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                              Em Andamento
                            </span>
                          )}
                          {/* --- FIM DOS BADGES --- */}
                          
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