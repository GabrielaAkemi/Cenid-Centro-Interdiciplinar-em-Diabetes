"use client";

import { Activity, Brain, Dumbbell, Apple, Pill, FlaskConical, Calculator } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Consultas() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto p-4 relative">
      <Card className="shadow-lg rounded-lg border border-blue-200 mb-6">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl font-bold text-blue-900">Iniciar Consulta</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Selecione a Especialidade*
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Medicina */}
            <button
              onClick={() => router.push("/consultas/medicina")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <Activity className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Medicina</span>
            </button>

            {/* Psicologia */}
            <button
              onClick={() => router.push("/consultas/psicologia")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <Brain className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Psicologia</span>
            </button>

            {/* Educação Física */}
            <button
              onClick={() => router.push("/consultas/eduFisica")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <Dumbbell className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Educação Física</span>
            </button>

            {/* Nutrição */}
            <button
              onClick={() => router.push("/consultas/nutricao")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <Apple className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Nutrição</span>
            </button>

            {/* Farmácia */}
            <button
              onClick={() => router.push("/consultas/farmacia")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <Pill className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Farmácia</span>
            </button>

            {/* Bioquímica */}
            <button
              onClick={() => router.push("/consultas/bioquimica")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <FlaskConical className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Bioquímica</span>
            </button>

            {/* Antropometria */}
            <button
              onClick={() => router.push("/consultas/antropometria")}
              className="flex flex-col items-center justify-center h-24 border rounded-md py-4 px-2 border-blue-200 hover:border-red-500 hover:border-2 transition-all"
            >
              <Calculator className="h-8 w-8 mb-2 text-red-600" />
              <span className="text-blue-900">Calculadora</span>
            </button>
          </div>
        </CardContent>
      </Card>
            <div className="w-full flex justify-end mt-8">
              <Image
                src="/logoCenid.png"
                alt="LOGOCENID"
                width={200}
                height={200}
                className="opacity-70"
              />
            </div>
    </div>
    
  );
}
