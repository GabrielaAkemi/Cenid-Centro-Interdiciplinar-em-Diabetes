"use client"

import React, { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Activity, AlertCircle, Brain, CalendarIcon, HeartPulse, ClipboardList } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import PatientBasicInfo, {PatientInfoData} from "./basicInfo/patientBasicInfo";
import { apiFetch } from "@/lib/api"
import StatusToggle, { getStatusContainerClasses } from "../checkConcluido/statusToggle"
import FileInput from "../fileInput/fileInput";
import uploadFiles from "@/lib/fileInputPost";
import ListaAnexos from "../listaAnexos/listaAnexos";

const inputClass = "p-3.5 border border-gray-400 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 w-full bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed";
const labelClass = "text-sm font-medium text-blue-900 mb-1 block";
const sectionTitleClass = "text-2xl font-bold text-blue-900";
const subTitleClass = "text-xl font-semibold text-gray-800";
const sectionContainerClass = "p-6 border-b border-gray-200";
const primaryButtonClass = "w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105 flex items-center justify-center";
const errorClass = "text-sm text-red-500 mt-1";

const FormMessage = ({ children }: { children: React.ReactNode }) => {
  return children ? <p className={errorClass}>{children as string}</p> : null
}
const Separator = ({ className }: { className: string }) => <div className={`h-px ${className}`}></div>


const PsicologiaSchema = z.object({
  nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
  dataAvaliacao: z.string().min(1, "A data da avaliação deve ser selecionada"),
  respostasAnsiedade: z.array(z.string().optional()).length(7),
  respostasDepressao: z.array(z.string().optional()).length(9),
  respostasAutocuidado: z.array(z.string().optional()).length(15),
  hipoteseDiagnostica: z.string().optional(),
  condutaClinica: z.string().optional(),
})

type PsicologiaFormValues = z.infer<typeof PsicologiaSchema>;

const StyledIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
    const iconProps = { className: 'h-5 w-5 text-blue-600' };

    if (React.isValidElement(icon)) {
        return React.cloneElement(icon, iconProps as any);
    }
    return <>{icon}</>;
};

export interface InitialData {
  id: number;
  patient: number;

  // Campos descritivos
  hipoteste_diagnostica_geral?: string | null;
  conduta_clinica?: string | null;

  // GAD-7 (Ansiedade)
  gad1?: number;
  gad2?: number;
  gad3?: number;
  gad4?: number;
  gad5?: number;
  gad6?: number;
  gad7?: number;

  // PHQ-9 (Depressão)
  phq1?: number;
  phq2?: number;
  phq3?: number;
  phq4?: number;
  phq5?: number;
  phq6?: number;
  phq7?: number;
  phq8?: number;
  phq9?: number;

  // SCI-R (Autocuidado)
  scir1?: number;
  scir2?: number;
  scir3?: number;
  scir4?: number;
  scir5?: number;
  scir6?: number;
  scir7?: number;
  scir8?: number;
  scir9?: number;
  scir10?: number;
  scir11?: number;
  scir12?: number;
  scir13?: number;
  scir14?: number;
  scir15?: number;

  // Metadados e Status
  consulta_finalizada?: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

export default function PsicologiaFormRefatorado({
  patientData,
  initialData,
  somenteLeitura,
  attachments
}: {
  patientData: PatientInfoData,
  initialData?: InitialData,
  somenteLeitura?: boolean,
  attachments?: any;
}) {
    console.log(initialData);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('formulario');
  const [formKey, setFormKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<"andamento" | "concluida">("andamento");

  // Estado local para dados do paciente (cabeçalho)
  const [formData, setFormData] = useState({
    patientInfo: patientData,
  });

  // Hook Form para o questionário
  const form = useForm<PsicologiaFormValues>({
    resolver: zodResolver(PsicologiaSchema as any),
    defaultValues: {
      nome: patientData.nome || "",
      dataAvaliacao: format(new Date(), "yyyy-MM-dd"),
      respostasAnsiedade: Array(7).fill(""),
      respostasDepressao: Array(9).fill(""),
      respostasAutocuidado: Array(15).fill(""),
      hipoteseDiagnostica: "",
      condutaClinica: "",
    },
  });

  // 1. Efeito para carregar dados iniciais e popular o form
  useEffect(() => {
    // Atualiza info do paciente
    if (patientData) {
        const patient: PatientInfoData = {
          id: patientData.id || initialData?.patient || 0,
          nome: patientData.nome || "",
          idade: patientData.idade || "",
          sexo: patientData.sexo || "",
          peso: patientData.peso?.toString() || initialData?.peso || "",
          estatura: patientData.estatura?.toString() || initialData?.estatura || "",
          data_nascimento: patientData.data_nascimento || "",
          dataAvaliacao: initialData?.dataConsulta || patientData.dataAvaliacao || new Date().toISOString().split("T")[0],
        };

        setFormData((prev) => ({ ...prev, patientInfo: patient }));
    }

    // Se tiver initialData, popula os campos do React Hook Form e o Status
    if (initialData) {
      setStatus(initialData.consulta_finalizada ? "concluida" : "andamento");

      const mappedValues = {
        nome: patientData.nome || "",
        dataAvaliacao: initialData.dataConsulta || format(new Date(), "yyyy-MM-dd"),
        hipoteseDiagnostica: initialData.hipoteste_diagnostica_geral || "",
        condutaClinica: initialData.conduta_clinica || "",

        // Mapeia GAD-7 (gad1...gad7) para array de strings
        respostasAnsiedade: [
          initialData.gad1, initialData.gad2, initialData.gad3, initialData.gad4,
          initialData.gad5, initialData.gad6, initialData.gad7
        ].map((v) => v !== undefined && v !== null ? String(v) : ""),

        // Mapeia PHQ-9 (phq1...phq9) para array de strings
        respostasDepressao: [
          initialData.phq1, initialData.phq2, initialData.phq3, initialData.phq4,
          initialData.phq5, initialData.phq6, initialData.phq7, initialData.phq8,
          initialData.phq9
        ].map((v) => v !== undefined && v !== null ? String(v) : ""),

        // Mapeia SCI-R (scir1...scir15) para array de strings
        respostasAutocuidado: [
            initialData.scir1, initialData.scir2, initialData.scir3, initialData.scir4,
            initialData.scir5, initialData.scir6, initialData.scir7, initialData.scir8,
            initialData.scir9, initialData.scir10, initialData.scir11, initialData.scir12,
            initialData.scir13, initialData.scir14, initialData.scir15
        ].map((v) => v !== undefined && v !== null ? String(v) : ""),
      };

      // Reseta o form com os valores mapeados
      form.reset(mappedValues);
    }
  }, [patientData, initialData, form]);


  const handleChangePatientInfo = (section: any, data: any) => {
    setFormData((prevData) => ({ ...prevData, [section]: data }))
  }

  const handleSubmit = async (data: PsicologiaFormValues) => {
    try {
        const payload = {
            patient: patientData.id,
            // Importante: enviar a data de avaliação atualizada
            dataConsulta: formData.patientInfo?.dataAvaliacao || data.dataAvaliacao,
            hipoteste_diagnostica_geral: data.hipoteseDiagnostica || "",
            conduta_clinica: data.condutaClinica || "",

            // GAD-7
            gad1: Number(data.respostasAnsiedade[0] || 0),
            gad2: Number(data.respostasAnsiedade[1] || 0),
            gad3: Number(data.respostasAnsiedade[2] || 0),
            gad4: Number(data.respostasAnsiedade[3] || 0),
            gad5: Number(data.respostasAnsiedade[4] || 0),
            gad6: Number(data.respostasAnsiedade[5] || 0),
            gad7: Number(data.respostasAnsiedade[6] || 0),

            // PHQ-9
            phq1: Number(data.respostasDepressao[0] || 0),
            phq2: Number(data.respostasDepressao[1] || 0),
            phq3: Number(data.respostasDepressao[2] || 0),
            phq4: Number(data.respostasDepressao[3] || 0),
            phq5: Number(data.respostasDepressao[4] || 0),
            phq6: Number(data.respostasDepressao[5] || 0),
            phq7: Number(data.respostasDepressao[6] || 0),
            phq8: Number(data.respostasDepressao[7] || 0),
            phq9: Number(data.respostasDepressao[8] || 0),

            // SCI-R
            scir1: Number(data.respostasAutocuidado[0] || 0),
            scir2: Number(data.respostasAutocuidado[1] || 0),
            scir3: Number(data.respostasAutocuidado[2] || 0),
            scir4: Number(data.respostasAutocuidado[3] || 0),
            scir5: Number(data.respostasAutocuidado[4] || 0),
            scir6: Number(data.respostasAutocuidado[5] || 0),
            scir7: Number(data.respostasAutocuidado[6] || 0),
            scir8: Number(data.respostasAutocuidado[7] || 0),
            scir9: Number(data.respostasAutocuidado[8] || 0),
            scir10: Number(data.respostasAutocuidado[9] || 0),
            scir11: Number(data.respostasAutocuidado[10] || 0),
            scir12: Number(data.respostasAutocuidado[11] || 0),
            scir13: Number(data.respostasAutocuidado[12] || 0),
            scir14: Number(data.respostasAutocuidado[13] || 0),
            scir15: Number(data.respostasAutocuidado[14] || 0),

            consulta_finalizada: status == "concluida",
          };

          const isEdit = !!initialData?.id;
          const url = isEdit
            ? `/api/consulta-psicologia/${initialData.id}/`
            : "/api/consulta-psicologia/";
          const method = isEdit ? "PUT" : "POST";

          const objCriado: any = await apiFetch(url, true, {
            method: method,
            body: JSON.stringify(payload),
          });

          // Upload de arquivos se houver
          let input = fileInputRef.current;
          if(input && input.files && input.files.length > 0) {
            // Assumindo que a função uploadFiles existe no seu contexto
            await uploadFiles(Array.from(input.files), 'consultapsicologia', objCriado.id);
          }

          setMessage("Formulário salvo com sucesso!");
          setShowModal(true);
          setCurrentPage("consultas");

          // Se for criação, força reset para evitar duplicidade ou limpa form
          if (!isEdit) {
              setFormKey(prev => prev + 1);
              form.reset();
          }

    } catch (error: any) {
        console.error(error);
        setMessage("Erro ao salvar: " + error.message);
        setShowModal(true);
    }
  }

  // Funções de Cálculo (Mantidas iguais)
  const calcularScore = (respostas: (string | undefined)[]) => {
    return respostas
      .map((resposta) => Number.parseInt(resposta || "0"))
      .reduce((total, valor) => total + valor, 0)
  }
  const calcularScoreAnsiedade = (respostas: (string | undefined)[]) => calcularScore(respostas)
  const classificarAnsiedade = (score: number) => {
    if (score < 5) return "Ansiedade Mínima"
    if (score < 10) return "Ansiedade Leve"
    if (score < 15) return "Ansiedade Moderada"
    return "Ansiedade Grave"
  }
  const calcularScoreDepressao = (respostas: (string | undefined)[]) => calcularScore(respostas)
  const classificarDepressao = (score: number) => {
    if (score < 5) return "Ausente"
    if (score < 10) return "Depressão Leve"
    if (score < 15) return "Depressão Moderada"
    if (score < 20) return "Depressão Moderadamente Severa"
    return "Depressão Severa"
  }
  const calcularScoreAutocuidado = (respostas: (string | undefined)[]) => calcularScore(respostas)
  const classificarAutocuidado = (score: number) => {
    const percentual = (score / 75) * 100
    if (percentual < 50) return "Inadequado"
    if (percentual < 70) return "Regular"
    if (percentual < 85) return "Bom"
    return "Excelente"
  }

  // Componentes Visuais
  interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: React.ReactNode
    className?: string
  }
  const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
    <div className={`bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500 ${className}`}>
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <StyledIcon icon={icon} />
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold text-blue-900">{value}</div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  )

  // Opções dos Radios - Adicionado 'disabled' para somente leitura
  const renderQuizOptions = (baseName: keyof PsicologiaFormValues, index: number, maxScore: number) => {
    return (
      <div className="flex space-x-4">
        {[...Array(maxScore + 1).keys()].map((valor) => (
          <div key={valor} className="flex flex-col items-center space-y-1">
            <input
              type="radio"
              id={`${baseName}-${index}-${valor}`}
              {...form.register(`${baseName}.${index}` as any)}
              value={valor.toString()}
              // 2. Disabled se somenteLeitura for true
              disabled={somenteLeitura}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200"
            />
            <label
              htmlFor={`${baseName}-${index}-${valor}`}
              className={`text-xs font-normal cursor-pointer ${somenteLeitura ? 'text-gray-400' : 'text-gray-700'}`}
            >
              {valor}
            </label>
          </div>
        ))}
      </div>
    )
  }

  const renderAutocuidadoOptions = (baseName: keyof PsicologiaFormValues, index: number, maxScore: number) => {
    return (
      <div className="flex space-x-3">
        {[...Array(maxScore).keys()].map((value) => {
          const valor = value + 1
          return (
            <div key={valor} className="flex flex-col items-center space-y-1">
              <input
                type="radio"
                id={`${baseName}-${index}-${valor}`}
                {...form.register(`${baseName}.${index}` as any)}
                value={valor.toString()}
                disabled={somenteLeitura}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200"
              />
              <label
                htmlFor={`${baseName}-${index}-${valor}`}
                className={`text-xs font-normal cursor-pointer ${somenteLeitura ? 'text-gray-400' : 'text-gray-700'}`}
              >
                {valor}
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  // Listas de Perguntas
  const questoesAnsiedade = [
    "Sentir-se nervoso/a, ansioso/a ou muito tenso/a.",
    "Não ser capaz de impedir ou de controlar as preocupações.",
    "Preocupar-se muito com diversas coisas.",
    "Dificuldade para relaxar.",
    "Ficar tão agitado/a que se torna difícil permanecer parado.",
    "Ficar facilmente aborrecido/a ou irritado/a.",
    "Sentir medo como se algo horrível fosse acontecer",
  ]

  const questoesDepressao = [
    "Pouco interesse ou pouco prazer em fazer as coisas",
    "Se sentir “para baixo”, deprimido/a ou sem perspectiva",
    "Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume",
    "Se sentir cansado/a ou com pouca energia",
    "Falta de apetite ou comendo demais",
    "Se sentir mal consigo mesmo/a — ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo/a",
    "Dificuldade para se concentrar nas coisas, como ler ou ver assitir televisão",
    "Lentidão para se movimentar ou falar, a ponto das outras pessoas perceberem? Ou o oposto – estar tão agitado/a ou irrequieto/a que você fica andando de um lado para o outro muito mais do que de costume",
    "Pensar em se ferir de alguma maneira ou que seria melhor estar morto/a",
  ]

  const questoesAutocuidado = [
    "Verifica a glicose no sangue com monitor (glicosímetro ou CGM)",
    "Anota os resultados de glicose no sangue quando verifica com o monitor",
    "Verifica cetonas no sangue ou na urina quando o nível de glicose está alto",
    "Usa a dose correta de insulina ou dos remédios para diabetes",
    "Usa a insulina ou os remédios para diabetes na hora certa",
    "Come as porções corretas de comida",
    "Come as refeições e lanches na hora certa",
    "Anota o que come, principalmente os carboidratos",
    "Lê os rótulos dos alimentos",
    "Carrega carboidrato para, em caso de emergência, tratar a glicose baixa no sangue",
    "Quando a glicose no sangue está baixa, trata somente com a quantidade de carboidratos recomendada",
    "Comparece às consultas marcadas",
    "Carrega algum tipo de identificação que comprove o diabetes (por exemplo: cartão, pulseira, colar)",
    "Faz exercícios físico",
    "Você modifica a dose de insulina baseado nos valores da glicose, comida e/ou exercícios",
  ]

  // Classes de estilo
  const sectionContainerClass = "p-6 border-b border-gray-200"
  const sectionTitleClass = "text-xl font-bold text-blue-900"
  const subTitleClass = "text-lg font-semibold text-blue-900"
  const inputClass = `p-3.5 border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 w-full ${somenteLeitura ? 'bg-gray-100 cursor-not-allowed text-gray-600' : ''}`
  const labelClass = "text-sm font-medium text-gray-700 mb-1 block"

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <div className={`max-w-4xl mx-auto w-full p-8 rounded-lg shadow-xl border-2 transition-colors duration-300 ${getStatusContainerClasses(status)}`}>
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Avaliação de Saúde Mental - Psicologia</h1>

        <StatusToggle
          value={status}
          onChange={setStatus}
          somenteLeitura={somenteLeitura}
          nomeAvaliacao="Psicologia"
        />

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg text-center shadow-2xl">
                  <p className="text-xl font-bold text-blue-900">{message}</p>
                  <button
                      onClick={() => setShowModal(false)}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                      Fechar
                  </button>
              </div>
          </div>
        )}

        <form key={formKey} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

          <PatientBasicInfo
            patientData={formData.patientInfo}
            initialData={initialData} // Passando initialData para o componente info também
            onChange={(data) => handleChangePatientInfo("patientInfo", data)}
            somenteLeitura={somenteLeitura}
          />

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center text-blue-800">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p className="text-sm">
                A seguir, você encontrará questionários para avaliar sintomas de ansiedade (GAD-7) e depressão (PHQ-9). As perguntas se referem ao que você sentiu ou vivenciou <span className="font-semibold">nas últimas duas semanas.</span>
              </p>
            </div>
          </div>

          {/* GAD-7 SECTION */}
          <div className={sectionContainerClass}>
            <h2 className={`${sectionTitleClass} flex items-center gap-2 mb-4`}>
              <HeartPulse className="h-6 w-6" /> Avaliação da Ansiedade (GAD-7)
              <span className="text-sm text-red-500 font-normal ml-auto">» Aplicar a partir dos 6 anos</span>
            </h2>
            <Separator className="bg-blue-200" />
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300 mt-6">
              <p className="text-sm text-gray-700">
                Responda como o paciente se sente considerando a escala de 0 a 3:
                <br /><span className="font-semibold">0 ─ nenhuma vez; 1 ─ Vários dias; 2 ─ Mais da metade dos dias; 3 ─ Todos os dias.</span>
              </p>
            </div>
            <div className="space-y-4 mt-6">
              {questoesAnsiedade.map((questao, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border-b border-blue-100 items-center">
                  <div>
                    <label className="text-sm font-medium text-blue-900">
                      {index + 1}. {questao}
                    </label>
                    <FormMessage>{form.formState.errors.respostasAnsiedade?.[index]?.message}</FormMessage>
                  </div>
                  <div className="flex justify-end">
                    {renderQuizOptions("respostasAnsiedade", index, 3)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GAD-7 RESULTS */}
          <div className={sectionContainerClass}>
            <h2 className={subTitleClass}>Resultados da Avaliação de Ansiedade (GAD-7)</h2>
            <Separator className="bg-blue-200" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Score de Ansiedade"
                value={calcularScoreAnsiedade(form.watch("respostasAnsiedade"))}
                description="Pontuação total na escala GAD-7"
                icon={<AlertCircle />}
              />
              <StatCard
                title="Classificação"
                value={classificarAnsiedade(calcularScoreAnsiedade(form.watch("respostasAnsiedade")))}
                description="Nível de ansiedade baseado na pontuação"
                icon={<Activity />}
              />
            </div>
          </div>

          {/* PHQ-9 SECTION */}
          <div className={sectionContainerClass}>
            <h2 className={`${sectionTitleClass} flex items-center gap-2 mb-4`}>
              <Brain className="h-6 w-6" /> Avaliação da Depressão (PHQ-9)
              <span className="text-sm text-red-500 font-normal ml-auto">» Aplicar a partir dos 12 anos</span>
            </h2>
            <Separator className="bg-blue-200" />
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300 mt-6">
              <p className="text-sm text-gray-700">
                Responda como o paciente se sente considerando a escala de 0 a 3:
                <br /><span className="font-semibold">0 ─ nenhuma vez; 1 ─ Vários dias; 2 ─ Mais da metade dos dias; 3 ─ Todos os dias.</span>
              </p>
            </div>
            <div className="space-y-4 mt-6">
              {questoesDepressao.map((questao, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border-b border-blue-100 items-center">
                  <div>
                    <label className="text-sm font-medium text-blue-900">
                      {index + 1}. {questao}
                    </label>
                    <FormMessage>{form.formState.errors.respostasDepressao?.[index]?.message}</FormMessage>
                  </div>
                  <div className="flex justify-end">
                    {renderQuizOptions("respostasDepressao", index, 3)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHQ-9 RESULTS */}
          <div className={sectionContainerClass}>
            <h2 className={subTitleClass}>Resultados da Avaliação de Depressão (PHQ-9)</h2>
            <Separator className="bg-blue-200" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Score de Depressão"
                value={calcularScoreDepressao(form.watch("respostasDepressao"))}
                icon={<HeartPulse />}
                description="Pontuação total na escala PHQ-9"
              />
              <StatCard
                title="Classificação"
                value={classificarDepressao(calcularScoreDepressao(form.watch("respostasDepressao")))}
                icon={<Brain />}
                description="Nível de depressão baseado na pontuação"
              />
            </div>
          </div>

          {/* SCI-R SECTION */}
          <div className={sectionContainerClass}>
            <h2 className={`${sectionTitleClass} flex items-center gap-2 mb-4`}>
              <ClipboardList className="h-6 w-6" /> Inventário de Autocuidado em Diabetes (SCI-R)
            </h2>
            <Separator className="bg-blue-200" />
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300 mt-6">
              <p className="text-sm text-gray-700">
                Responda com que frequência o paciente realiza cada uma das atividades de autocuidado listadas, considerando a escala de 1 a 5:
                <br /><span className="font-semibold">1 ─ nunca; 2 ─ raramente; 3 ─ as vezes; 4 ─ geralmente; 5 ─ sempre.</span>
              </p>
            </div>
            <div className="space-y-4 mt-6">
              {questoesAutocuidado.map((questao, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border-b border-blue-100 items-center">
                  <div>
                    <label className="text-sm font-medium text-blue-900">
                      {index + 1}. {questao}
                    </label>
                    <FormMessage>{form.formState.errors.respostasAutocuidado?.[index]?.message}</FormMessage>
                  </div>
                  <div className="flex justify-end">
                    {renderAutocuidadoOptions("respostasAutocuidado", index, 5)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SCI-R RESULTS */}
          <div className={sectionContainerClass}>
            <h2 className={subTitleClass}>Resultados do Inventário de Autocuidado</h2>
            <Separator className="bg-blue-200" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Pontuação Total"
                value={calcularScoreAutocuidado(form.watch("respostasAutocuidado"))}
                description="Pontuação total no inventário de autocuidado (máximo 75)"
                icon={<ClipboardList />}
              />
              <StatCard
                title="Classificação"
                value={classificarAutocuidado(calcularScoreAutocuidado(form.watch("respostasAutocuidado")))}
                description="Nível de autocuidado baseado na pontuação"
                icon={<Activity />}
              />
            </div>
          </div>

          {/* HIPOTESE DIAGNOSTICA */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>HIPÓTESE DIAGNÓSTICA GERAL</h2>
            <Separator className="bg-blue-200" />
            <div className="mt-6">
              <label className={labelClass}>
                Apresentação da avaliação clínica em conjunto com a análise dos resultados dos questionários.
              </label>
              <textarea
                placeholder="Apresentação..."
                {...form.register("hipoteseDiagnostica")}
                readOnly={somenteLeitura}
                className={`${inputClass} min-h-[150px]`}
              ></textarea>
              <FormMessage>{form.formState.errors.hipoteseDiagnostica?.message}</FormMessage>
            </div>
          </div>

          {/* CONDUTA CLINICA */}
          <div className="p-6">
            <h2 className={sectionTitleClass}>CONDUTA CLÍNICA</h2>
            <Separator className="bg-blue-200" />
            <div className="mt-6">
              <label className={labelClass}>
                Descrição da conduta clínica e cuidados necessários para o tratamento.
              </label>
              <textarea
                placeholder="Descreva..."
                {...form.register("condutaClinica")}
                readOnly={somenteLeitura}
                className={`${inputClass} min-h-[150px]`}
              ></textarea>
              <FormMessage>{form.formState.errors.condutaClinica?.message}</FormMessage>
            </div>
          </div>

          {/* 3. ANEXOS */}
          <div className="p-6 mt-4 border-t border-gray-200">
            <h2 className={sectionTitleClass}>Anexo de exames complementares</h2>
            {somenteLeitura ? (
                <ListaAnexos attachments={attachments} />
            ) : (
                <div className="mt-4">
                     <FileInput
                        ref={fileInputRef}
                        name="anexar"
                        multiple
                    />
                </div>
            )}
          </div>

            {/* BOTAO SALVAR */}
            {!somenteLeitura && (
                <div className="flex justify-center pb-8">
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105"
                    >
                        Salvar Avaliação
                    </button>
                </div>
            )}
        </form>
      </div>
    </div>
  )
}
