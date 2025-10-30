"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Activity, AlertCircle, Brain, CalendarIcon, HeartPulse, ClipboardList } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

type PsicologiaFormValues = z.infer<typeof PsicologiaSchema>

const StyledIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
    const iconProps = { className: 'h-5 w-5 text-blue-600' };

    if (React.isValidElement(icon)) {
        return React.cloneElement(icon, iconProps as any);
    }
    return <>{icon}</>;
};

export default function PsicologiaFormRefatorado() {
  const form = useForm<PsicologiaFormValues>({
    resolver: zodResolver(PsicologiaSchema),
    defaultValues: {
      respostasAnsiedade: Array(7).fill(""),
      respostasDepressao: Array(9).fill(""),
      respostasAutocuidado: Array(15).fill(""),
    },
  })

  const onSubmit = (data: PsicologiaFormValues) => {
    console.log("Dados do formulário de Psicologia:", data)
  }

  
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
              checked={form.watch(`${baseName}.${index}` as any) === valor.toString()}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor={`${baseName}-${index}-${valor}`}
              className="text-xs font-normal text-gray-700 cursor-pointer"
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
                checked={form.watch(`${baseName}.${index}` as any) === valor.toString()}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor={`${baseName}-${index}-${valor}`}
                className="text-xs font-normal text-gray-700 cursor-pointer"
              >
                {valor}
              </label>
            </div>
          )
        })}
      </div>
    )
  }


  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Avaliação de Saúde Mental - Psicologia</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Dados do Paciente</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
              <div>
                <label className={labelClass}>Nome do Paciente</label>
                <input
                  type="text"
                  placeholder="Digite o nome completo"
                  {...form.register("nome")}
                  className={inputClass}
                />
                <FormMessage>{form.formState.errors.nome?.message}</FormMessage>
              </div>

              <div>
                <label className={labelClass}>Data da Avaliação</label>
                <div className="relative">
                  <input
                    type="date"
                    {...form.register("dataAvaliacao")}
                    className={inputClass}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                </div>
                <FormMessage>{form.formState.errors.dataAvaliacao?.message}</FormMessage>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center text-blue-800">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <p className="text-sm">
                A seguir, você encontrará questionários para avaliar sintomas de ansiedade (GAD-7) e depressão (PHQ-9). As perguntas se referem ao que você sentiu ou vivenciou <span className="font-semibold">nas últimas duas semanas.</span>
              </p>
            </div>
          </div>

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
                className={`${inputClass} min-h-[150px]`}
              ></textarea>
              <FormMessage>{form.formState.errors.hipoteseDiagnostica?.message}</FormMessage>
            </div>
          </div>

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
                className={`${inputClass} min-h-[150px]`}
              ></textarea>
              <FormMessage>{form.formState.errors.condutaClinica?.message}</FormMessage>
            </div>
          </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105"
              >
                Salvar Avaliação
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}