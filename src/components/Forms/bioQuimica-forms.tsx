"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { TestTube } from "lucide-react"
import FileInput from "../fileInput/fileInput"

// --- Schema ---
const medidas = [
  { nome: "Glicemia", unidade: "mg/dL" },
  { nome: "HbA1c", unidade: "%" },
  { nome: "Colesterol total", unidade: "mg/dL" },
  { nome: "Triglicerídeo", unidade: "mg/dL" },
  { nome: "LDL", unidade: "mg/dL" },
  { nome: "HDL", unidade: "mg/dL" },
  { nome: "Peptídeo C", unidade: "" },
  { nome: "Vitamina D", unidade: "" },
  { nome: "Albumina sérica", unidade: "g/dL" },
  { nome: "Albumina Urinária", unidade: "g/dL" },
  { nome: "Creatinina sérica", unidade: "mg/dL" },
  { nome: "Creatinina urinária", unidade: "mg/dL" },
  { nome: "Microalbuminuria", unidade: "" },
  { nome: "Relação Alb/Creat", unidade: "" },
  { nome: "TGO", unidade: "" },
  { nome: "TGP", unidade: "" },
  { nome: "TSH", unidade: "" },
  { nome: "T4L", unidade: "" },
  { nome: "Clearance de creatinina", unidade: "" },
  { nome: "Cortisol", unidade: "µg/dL" },
]

const BioquimicaSchema = z.object({
  dataConsulta: z.string().optional(),
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  idade: z.string().optional(),
  valores: z.array(
    z.object({
      medidaId: z.number(),
      data1: z.string().optional(),
      data2: z.string().optional(),
      data3: z.string().optional(),
      data4: z.string().optional(),
      data5: z.string().optional(),
    })
  ).length(medidas.length),
  datas: z.array(z.string().optional()).length(5),
})

type BioquimicaFormValues = z.infer<typeof BioquimicaSchema>

export default function BioquimicaFormRefatorado() {
  const form = useForm<BioquimicaFormValues>({
    resolver: zodResolver(BioquimicaSchema),
    defaultValues: {
      datas: ["", "", "", "", ""],
      valores: medidas.map((_, index) => ({ medidaId: index, data1: "", data2: "", data3: "", data4: "", data5: "" })),
    },
  })

  const onSubmit = (data: BioquimicaFormValues) => console.log("Dados:", data)

  const inputClass = "p-3.5 border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 w-full transition-colors"
  const labelClass = "text-sm font-medium text-gray-700 mb-1 block"
  const tableInputClass = "w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200"
  const primaryButtonClass = "w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105"

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans p-6 text-gray-800">
      <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 flex items-center justify-center gap-3">
           Avaliação Bioquímica
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-blue-900">
          {/* Dados do paciente */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Dados do Paciente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nome completo</label>
                <input type="text" {...form.register("nomeCompleto")} placeholder="Digite o nome completo" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Idade (anos)</label>
                <input type="number" {...form.register("idade")} placeholder="Digite a idade" className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Data da consulta</label>
              <input type="date" {...form.register("dataConsulta")} className={inputClass} />
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Exames Laboratoriais</h2>
            <div className="overflow-x-auto rounded-md border border-gray-600">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medida</th>
                    {[0,1,2,3,4].map((i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="date" {...form.register(`datas.${i}`)} className={tableInputClass} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medidas.map((medida, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-medium text-gray-900">{medida.nome} {medida.unidade && `(${medida.unidade})`}</td>
                      {[1,2,3,4,5].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <input type="text" placeholder="Valor" {...form.register(`valores.${i}.data${j}` as keyof BioquimicaFormValues)} className={tableInputClass} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 mt-4">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Anexo de exames complementares</h2>
            <FileInput name="anexar" multiple />
          </div>

          <div className="flex justify-center mt-6">
            <button type="submit" className={primaryButtonClass}>Salvar Avaliação</button>
          </div>
        </form>
      </div>
    </div>
  )
}
