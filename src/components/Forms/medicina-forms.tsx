"use client"

// O 'useRef' é importado para criar referências a elementos DOM ou componentes.
import React, { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
// Mantenha seu import do FileInput
import FileInput from "../fileInput/fileInput";


// --- CLASSES DE ESTILO BASEADAS NO MODELO FARMÁCIA (TEMA AZUL) ---
const inputClass = "p-3.5 border border-gray-400 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 w-full bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed";
const labelClass = "text-sm font-medium text-blue-900 mb-1 block";
const sectionTitleClass = "text-2xl font-bold text-blue-900";
const subTitleClass = "text-xl font-semibold text-gray-800";
const sectionContainerClass = "p-6 border-b border-gray-200";
const primaryButtonClass = "w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105 flex items-center justify-center";
const secondaryButtonClass = "flex items-center text-blue-600 hover:text-blue-800 font-semibold py-2 px-4 rounded-md border border-blue-300 hover:bg-blue-50 transition-colors";
const dangerButtonClass = "flex-shrink-0 bg-red-500 text-white hover:bg-red-600 p-2 rounded-md transition-colors";
const errorClass = "text-sm text-red-500 mt-1";

// Mock de componentes que viriam de outras libs (para tornar o código monolítico e executável)
const FormMessage = ({ children }: { children: React.ReactNode }) => {
  return children ? <p className={errorClass}>{children as string}</p> : null
}

// --- SCHEMA E TIPOS (MANTIDOS E AJUSTADOS) ---

const DoencaSchema = z.object({
  doenca: z.string().optional(),
  medicamento: z.string().optional(),
  dose: z.string().optional(),
})

const MedicinaSchema = z.object({
  nome: z.string().min(1, "O nome do paciente deve ser preenchido"),
  idade: z.string().min(1, "A idade deve ser preenchida"),
  peso: z.string().min(1, "O peso deve ser preenchido"),
  estatura: z.string().min(1, "A estatura deve ser preenchida"),
  diagnostico: z.string().min(1, "O diagnóstico deve ser selecionado"),
  outrasDM: z.string().optional(),
  // Simplificado para string no formato YYYY-MM-DD para usar input type="date"
  dataDiagnostico: z.string().min(1, "A data do diagnóstico deve ser selecionada"),
  tempoDiagnostico: z.string().min(1, "O tempo de diagnóstico deve ser preenchido"),
  classificacaoDiagnostico: z.string().min(1, "A classificação do diagnóstico deve ser selecionada"),
  metodoMonitoramento: z.string().min(1, "O método de monitoramento deve ser selecionado"),
  modeloGlicometro: z.string().optional(),
  controleGlicemico: z.string().min(1, "O estado de controle glicêmico deve ser preenchido"),
  administracaoInsulina: z.string().min(1, "O método de administração de insulina deve ser selecionada"),
  doencas: z.array(DoencaSchema),
  sintomas: z.string().optional(),
  estagioMaturacional: z.string().optional(),
  insulinaBasalNome: z.string().optional(),
  insulinaBasalDose1: z.string().optional(),
  insulinaBasalDose2: z.string().optional(),
  insulinaBolusNome: z.string().optional(),
  // Corrigindo o erro de digitação do nome do campo
  insulinaBolusDose1: z.string().optional(),
  insulinaBolusDose2: z.string().optional(),
  fatorSensibilidadeValor: z.string().optional(),
  fatorSensibilidadeHoraInicio: z.string().optional(),
  fatorSensibilidadeHoraFim: z.string().optional(),
  razaoCarboidratoValor: z.string().optional(),
  razaoCarboidratoHoraInicio: z.string().optional(),
  razaoCarboidratoHoraFim: z.string().optional(),
  outrasPresc: z.string().optional(),
})

type MedicinaFormValues = z.infer<typeof MedicinaSchema>

// --- COMPONENTE PRINCIPAL REFATORADO ---

export default function MedicinaFormRefatorado() {
  // CORREÇÃO: Declarando fileInputRef com useRef
  // Assumindo que o FileInput internamente é um input HTML (HTMLInputElement)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<MedicinaFormValues>({
    resolver: zodResolver(MedicinaSchema),
    defaultValues: {
      doencas: [{ doenca: "", medicamento: "", dose: "" }],
      // Preenchendo campos de Dose Bolus que estavam com erro de digitação
      insulinaBolusDose1: "",
      insulinaBolusDose2: "",
    },
  })

  // Renomeando campos para corrigir o erro de digitação no Schema original
  const insulinaBolusDose1 = form.watch("insulinaBolusDose1")
  const insulinaBolusDose2 = form.watch("insulinaBolusDose2")

  const onSubmit = (data: MedicinaFormValues) => {
    console.log("Dados do formulário de Medicina:", data)
    // Exemplo de como acessar arquivos via ref
    if (fileInputRef.current?.files) {
        console.log("Arquivos anexados:", fileInputRef.current.files)
    }
    // Aqui você integraria a chamada de API/Firebase no padrão do novo projeto.
  }

  const adicionarDoenca = () => {
    const doencasAtuais = form.getValues("doencas")
    form.setValue("doencas", [...doencasAtuais, { doenca: "", medicamento: "", dose: "" }])
  }

  const removerDoenca = (index: number) => {
    const doencasAtuais = form.getValues("doencas")
    if (doencasAtuais.length > 1) {
      form.setValue(
        "doencas",
        doencasAtuais.filter((_, i) => i !== index),
      )
    }
  }

  // Helper para renderizar Radio Groups (simulando a estrutura Shadcn/ui com novo estilo)
  const RadioGroupField = ({ name, label, options, direction = "col" }: { name: keyof MedicinaFormValues, label: string, options: { value: string, label: string }[], direction?: 'col' | 'row' }) => {
    const field = form.control._fields[name]
    const error = form.formState.errors[name]

    return (
      <div>
        <label className={labelClass}>{label}</label>
        <div className={`flex ${direction === 'col' ? 'flex-col space-y-2' : 'flex-wrap gap-x-6 gap-y-2'}`}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                {...form.register(name)}
                value={option.value}
                checked={form.watch(name as any) === option.value}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`${name}-${option.value}`} className="font-normal text-gray-700 cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
        <FormMessage>{error?.message}</FormMessage>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-800">
      <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Avaliação Clínica - Endocrinologia</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Dados do Paciente (Simplificado para input direto, alinhado visualmente) */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Dados do Paciente</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
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

              {/* Idade */}
              <div>
                <label className={labelClass}>Idade</label>
                <input
                  type="number"
                  placeholder="Digite a idade"
                  {...form.register("idade")}
                  className={inputClass}
                />
                <FormMessage>{form.formState.errors.idade?.message}</FormMessage>
              </div>

              {/* Peso */}
              <div>
                <label className={labelClass}>Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Digite o peso"
                  {...form.register("peso")}
                  className={inputClass}
                />
                <FormMessage>{form.formState.errors.peso?.message}</FormMessage>
              </div>

              {/* Estatura */}
              <div>
                <label className={labelClass}>Estatura (metros)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Digite a estatura"
                  {...form.register("estatura")}
                  className={inputClass}
                />
                <FormMessage>{form.formState.errors.estatura?.message}</FormMessage>
              </div>
            </div>
          </div>

          {/* Diagnóstico */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Diagnóstico</h2>
            <div className="mt-6 space-y-6">
              <RadioGroupField
                name="diagnostico"
                label="Diagnóstico"
                options={[
                  { value: "DM1", label: "DM1" },
                  { value: "DM2", label: "DM2" },
                  { value: "DMG", label: "DMG" },
                  { value: "Sem Diagnóstico", label: "Sem Diagnóstico" },
                  { value: "Outras formas de DM", label: "Outras formas de DM" },
                ]}
              />

              {form.watch("diagnostico") === "Outras formas de DM" && (
                <div>
                  <label className={labelClass}>Especifique outras formas de DM</label>
                  <input
                    type="text"
                    placeholder="Especifique"
                    {...form.register("outrasDM")}
                    className={inputClass}
                  />
                  <FormMessage>{form.formState.errors.outrasDM?.message}</FormMessage>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data do Diagnóstico (usando input type="date" para simplificar) */}
                <div>
                  <label className={labelClass}>Data do Diagnóstico</label>
                  <input
                    type="date"
                    {...form.register("dataDiagnostico")}
                    className={inputClass}
                  />
                  <FormMessage>{form.formState.errors.dataDiagnostico?.message}</FormMessage>
                </div>

                {/* Tempo de Diagnóstico */}
                <div>
                  <label className={labelClass}>Tempo de Diagnóstico em Meses</label>
                  <input
                    type="number"
                    placeholder="Digite o tempo em meses"
                    {...form.register("tempoDiagnostico")}
                    className={inputClass}
                  />
                  <FormMessage>{form.formState.errors.tempoDiagnostico?.message}</FormMessage>
                </div>
              </div>

              <RadioGroupField
                name="classificacaoDiagnostico"
                label="Classificação do Tempo de Diagnóstico"
                options={[
                  { value: "Recente até 100 dias", label: "Recente até 100 dias" },
                  { value: "Lua de mel (remissão)", label: "Lua de mel (remissão)" },
                  { value: "Esgotamento de reserva pancreática de insulina", label: "Esgotamento de reserva pancreática de insulina" },
                ]}
              />
            </div>
          </div>

          {/* Monitoramento e Controle */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Monitoramento e Controle</h2>
            <div className="mt-6 space-y-6">
              <RadioGroupField
                name="metodoMonitoramento"
                label="Método de Monitoramento de Glicemia"
                options={[
                  { value: "Glicosimetro", label: "Glicosímetro" },
                  { value: "Sensor Medtronic", label: "Sensor Medtronic" },
                  { value: "Freestyle Libre", label: "Freestyle Libre" },
                ]}
              />

              {form.watch("metodoMonitoramento") === "Glicosimetro" && (
                <div>
                  <label className={labelClass}>Marca/modelo do glicômetro</label>
                  <select
                    {...form.register("modeloGlicometro")}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Selecione o modelo</option>
                    <option value="accu-chek">Accu-Chek</option>
                    <option value="onetouch">OneTouch</option>
                    <option value="contour">Contour</option>
                    <option value="freestyle">FreeStyle</option>
                    <option value="outro">Outro</option>
                  </select>
                  <FormMessage>{form.formState.errors.modeloGlicometro?.message}</FormMessage>
                </div>
              )}

              <div>
                <label className={labelClass}>Estado de Controle Glicêmico</label>
                <input
                  placeholder="Descreva o estado de controle glicêmico"
                  {...form.register("controleGlicemico")}
                  className={inputClass}
                />
                <FormMessage>{form.formState.errors.controleGlicemico?.message}</FormMessage>
              </div>

              <RadioGroupField
                name="administracaoInsulina"
                label="Método de Administração de Insulina"
                options={[
                  { value: "Não faz uso de insulina", label: "Não faz uso de insulina" },
                  { value: "Caneta/seringa (MDI)", label: "Caneta/seringa (MDI)" },
                  { value: "Bomba (SICI)", label: "Bomba (SICI)" },
                ]}
              />
            </div>
          </div>

          {/* Outras morbidades */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Outras Morbidades (doenças)</h2>
            <p className="text-sm text-gray-600 mb-4">Registre quaisquer outras condições médicas e o tratamento associado.</p>

            <div className="space-y-4">
              {form.watch("doencas").map((_, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-blue-100 bg-blue-50 rounded-lg">
                  {/* Doença */}
                  <div>
                    <label className={labelClass}>Doença</label>
                    <input
                      placeholder="Digite a doença"
                      {...form.register(`doencas.${index}.doenca`)}
                      className={inputClass}
                    />
                    <FormMessage>{form.formState.errors.doencas?.[index]?.doenca?.message}</FormMessage>
                  </div>

                  {/* Medicamento */}
                  <div>
                    <label className={labelClass}>Medicamento</label>
                    <input
                      placeholder="Digite o medicamento"
                      {...form.register(`doencas.${index}.medicamento`)}
                      className={inputClass}
                    />
                    <FormMessage>{form.formState.errors.doencas?.[index]?.medicamento?.message}</FormMessage>
                  </div>

                  {/* Dose e Botão de Remover */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>Dose</label>
                    <div className="flex items-start space-x-2">
                      <input
                        placeholder="Digite a dose"
                        {...form.register(`doencas.${index}.dose`)}
                        className={inputClass}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removerDoenca(index)}
                          className={`${dangerButtonClass} h-14 w-14 mt-0.5`}
                          title="Remover Doença"
                        >
                          <Trash2 className="h-5 w-5 mx-auto" />
                        </button>
                      )}
                    </div>
                    <FormMessage>{form.formState.errors.doencas?.[index]?.dose?.message}</FormMessage>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={adicionarDoenca} className={`${secondaryButtonClass} mt-4`}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Outra Morbidade
            </button>
          </div>

          {/* Sintomas e Estágio Maturacional */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Sintomas e Estágio Maturacional</h2>
            <div className="mt-6 space-y-6">
              {/* Sintomas */}
              <div>
                <label className={labelClass}>
                  Queixas do paciente em relação ao estado de saúde e controle do diabetes
                </label>
                <textarea
                  placeholder="Descreva os sintomas"
                  {...form.register("sintomas")}
                  className={`${inputClass} min-h-[100px]`}
                ></textarea>
                <FormMessage>{form.formState.errors.sintomas?.message}</FormMessage>
              </div>

              {/* Estágio maturacional */}
              <RadioGroupField
                name="estagioMaturacional"
                label="Estágio maturacional: Escala de TANNER"
                options={[
                  { value: "Pré-púbere", label: "Pré-púbere" },
                  { value: "Púbere", label: "Púbere" },
                  { value: "Pós-púbere", label: "Pós-púbere" },
                ]}
                direction="row"
              />
            </div>
          </div>

          {/* Administração de insulina atual */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Administração de Insulina Atual</h2>
            <div className="mt-6 space-y-6">
              {/* Insulina Basal */}
              <h3 className={subTitleClass}>Insulina Basal</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-blue-100 bg-blue-50 rounded-lg">
                <div>
                  <label className={labelClass}>Nome</label>
                  <select
                    {...form.register("insulinaBasalNome")}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Selecione</option>
                    <option value="lantus">Lantus</option>
                    <option value="levemir">Levemir</option>
                    <option value="tresiba">Tresiba</option>
                    <option value="toujeo">Toujeo</option>
                    <option value="basaglar">Basaglar</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Dose diária (U/dia)</label>
                  <input placeholder="Digite a dose" {...form.register("insulinaBasalDose1")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dose diária (U/kg/dia)</label>
                  <input placeholder="Digite a dose" {...form.register("insulinaBasalDose2")} className={inputClass} />
                </div>
              </div>

              {/* Insulina Bolus */}
              <h3 className={subTitleClass}>Insulina Bolus</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-blue-100 bg-blue-50 rounded-lg">
                <div>
                  <label className={labelClass}>Nome</label>
                  <select
                    {...form.register("insulinaBolusNome")}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Selecione</option>
                    <option value="novolog">NovoLog</option>
                    <option value="humalog">Humalog</option>
                    <option value="apidra">Apidra</option>
                    <option value="fiasp">Fiasp</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Dose diária (U/dia)</label>
                  <input placeholder="Digite a dose" {...form.register("insulinaBolusDose1")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dose diária (U/kg/dia)</label>
                  <input placeholder="Digite a dose" {...form.register("insulinaBolusDose2")} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Fator de sensibilidade */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>
              Fator de Sensibilidade à Insulina (FS) para BOLUS
            </h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>FS (mg/dl/U)</label>
                <input
                  type="number"
                  placeholder="Digite o valor"
                  {...form.register("fatorSensibilidadeValor")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Hora Início</label>
                <input type="time" {...form.register("fatorSensibilidadeHoraInicio")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hora Fim</label>
                <input type="time" {...form.register("fatorSensibilidadeHoraFim")} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Razão de carboidrato */}
          <div className={sectionContainerClass}>
            <h2 className={sectionTitleClass}>Razão de Carboidrato-Insulina (rCHOi)</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>rCHOi (gramas/U)</label>
                <input
                  type="number"
                  placeholder="Digite o valor"
                  {...form.register("razaoCarboidratoValor")}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Hora Início</label>
                <input type="time" {...form.register("razaoCarboidratoHoraInicio")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hora Fim</label>
                <input type="time" {...form.register("razaoCarboidratoHoraFim")} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Outras prescrições */}
          <div className="p-6">
            <h2 className={sectionTitleClass}>Outras Prescrições Médicas e Conduta Clínica</h2>
            <div className="mt-6">
              <label className={labelClass}>Conduta Clínica</label>
              <textarea
                placeholder="Descrição de conduta clínica e cuidados necessários para o tratamento do diabetes ou outras morbidades"
                {...form.register("outrasPresc")}
                className={`${inputClass} min-h-[150px]`}
              ></textarea>
              <FormMessage>{form.formState.errors.outrasPresc?.message}</FormMessage>
            </div>
          </div>
          
          <div className="p-4 mt-8">
            <h2 className="text-2xl font-bold text-blue-900">Anexo de exames complementares</h2>
            <FileInput
              ref={fileInputRef} // Agora 'fileInputRef' está definido!
              name="anexar"
              multiple
            />
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