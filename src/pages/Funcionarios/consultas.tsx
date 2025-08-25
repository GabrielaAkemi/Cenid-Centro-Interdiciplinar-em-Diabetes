"use client"

import { useState } from "react"
import { Activity, Brain, Dumbbell, Apple, Pill, FlaskConical, Calculator } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string | null>(null)

  const selecionarEspecialidade = (especialidade: string) => {
    setEspecialidadeSelecionada(
      especialidade === especialidadeSelecionada ? null : especialidade
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 relative">
      <Card className="shadow-lg rounded-lg border border-blue-200 mb-6">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl font-bold text-blue-900">Iniciar Consulta</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Selecione a Especialidade*</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/** Botões das especialidades */}
            <button
              onClick={() => selecionarEspecialidade("medicina")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "medicina"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <Activity className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Medicina</span>
            </button>
            <button
              onClick={() => selecionarEspecialidade("psicologia")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "psicologia"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <Brain className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Psicologia</span>
            </button>
            <button
              onClick={() => selecionarEspecialidade("educacao-fisica")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "educacao-fisica"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <Dumbbell className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Educação Física</span>
            </button>
            <button
              onClick={() => selecionarEspecialidade("nutricao")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "nutricao"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <Apple className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Nutrição</span>
            </button>
            <button
              onClick={() => selecionarEspecialidade("farmacia")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "farmacia"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <Pill className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Farmácia</span>
            </button>
            <button
              onClick={() => selecionarEspecialidade("bioquimica")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "bioquimica"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <FlaskConical className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Bioquímica</span>
            </button>
            <button
              onClick={() => selecionarEspecialidade("antropometria")}
              className={`flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 transition-all ${
                especialidadeSelecionada === "antropometria"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border-blue-200 hover:border-red-500 hover:border-2"
              }`}
            >
              <Calculator className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Calculadora</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {especialidadeSelecionada && (
        <div className="mt-4 flex justify-center">
        <Button
        className="border border-blue-300 text-blue-700 hover:bg-blue-50"
        onClick={() => setEspecialidadeSelecionada(null)}
        >
        Voltar para seleção de especialidade
        </Button>
        </div>
      )}

      {/* Logo no rodapé */}
      <div className="fixed bottom-4 right-4 z-20">
        <Image
          src="/logoCenid.png"
          alt="LOGOCENID"
          width={200}
          height={200}
          className="opacity-70"
        />
      </div>
    </div>
  )
}