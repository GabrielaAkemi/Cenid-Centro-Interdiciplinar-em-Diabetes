"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import PatientBasicInfo, {PatientInfoData} from "./basicInfo/patientBasicInfo";
import { apiFetch } from "@/lib/api";
import FileInput from "../fileInput/fileInput";
import uploadFiles from "@/lib/fileInputPost";

const inputClass = "p-3.5 border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 w-full bg-white text-gray-800";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";
const sectionTitleClass = "text-2xl font-bold text-blue-900";
const sectionContainerClass = "p-6 border-b border-gray-200";
const tableInputClass = "w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200";
const subTitleClass = "text-xl font-semibold text-gray-800";

interface PosologiaData {
  posologia: string
  frequencia: string
  dose: string
  horario: string
  emJejum: string
}

interface MedicationData {
  medicamento: string
  principioAtivo: string
  comPrescricaoMedica: string
  dataInicio: string
  dataTermino: string
  finalidade: string
  posologias: PosologiaData[]
}

interface MedicationCardProps {
  medicationData: MedicationData
  onDataChange: (data: MedicationData) => void
  onRemove?: () => void
  showRemoveButton?: boolean
  somenteLeitura?: boolean
}


interface BaasisData {
  p1: string
  p2: string
  p3: string
  p4: string
}

interface BaasisCSIIData extends BaasisData {
  p5: string
  p6: string
}

interface BaasisProps {
  value?: BaasisData
  onChange: (data: BaasisData) => void
  somenteLeitura?: boolean
}

interface BaasisCSIIProps {
    value?: BaasisCSIIData
    onChange: (data: BaasisCSIIData) => void
    somenteLeitura?: boolean
}

interface InsulinAdherenceData {
  method?: string
  questionnaire?: BaasisData | BaasisCSIIData
}

interface InsulinAdherenceProps {
  value: InsulinAdherenceData
  onChange: (data: InsulinAdherenceData) => void
  somenteLeitura?: boolean
}

interface ComplementaryMedicationsProps {
  onChange: (data: Record<string, MedicationData>) => void
  initialMedications?: Record<string, MedicationData>
  somenteLeitura?: boolean;
}

interface OtherMedicationsProps {
  onChange: (data: MedicationData[]) => void
  initialMedications?: MedicationData[]
  somenteLeitura?: boolean
}

interface FormData {
  patientInfo: PatientInfoData
  insulinAdherence: InsulinAdherenceData
  complementaryMedications: Record<string, MedicationData>
  otherMedications: MedicationData[]
}

interface MedicationCategory {
  title: string
  key: string
  isParent?: boolean
  parent?: string
}

interface Question {
  key: string
  label: string
  options: string[]
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medicationData,
  onDataChange,
  onRemove,
  showRemoveButton,
  somenteLeitura
}) => {
  const handleFieldChange = (field: keyof MedicationData, value: string) => {
    onDataChange({ ...medicationData, [field]: value })
  }

  const handlePosologiaChange = (posIndex: number, field: keyof PosologiaData, value: string) => {
    const newPosologias = [...medicationData.posologias]
    newPosologias[posIndex] = { ...newPosologias[posIndex], [field]: value }
    onDataChange({ ...medicationData, posologias: newPosologias })
  }

  const addPosologiaRow = () => {
    const newPosologias = [
      ...medicationData.posologias,
      { posologia: "", frequencia: "", dose: "", horario: "", emJejum: "" },
    ]
    onDataChange({ ...medicationData, posologias: newPosologias })
  }

  const removePosologiaRow = (posIndex: number) => {
    if (medicationData.posologias.length <= 1) return
    const newPosologias = medicationData.posologias.filter((_, index) => index !== posIndex)
    onDataChange({ ...medicationData, posologias: newPosologias })
  }

  const calculateTempoDeUso = useCallback(() => {
    if (medicationData.dataInicio && medicationData.dataTermino) {
      const start = new Date(medicationData.dataInicio)
      const end = new Date(medicationData.dataTermino)
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return `${diffDays} dias`
      }
    }
    return ""
  }, [medicationData.dataInicio, medicationData.dataTermino])

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Medicamento (nome comercial):</label>
          <input
            type="text"
            value={medicationData.medicamento}
            onChange={(e) => handleFieldChange("medicamento", e.target.value)}
            className={inputClass}
            readOnly={somenteLeitura}
          />
        </div>
        <div>
          <label className={labelClass}>Princípio ativo:</label>
          <input
            type="text"
            value={medicationData.principioAtivo}
            onChange={(e) => handleFieldChange("principioAtivo", e.target.value)}
            className={inputClass}
            readOnly={somenteLeitura}
          />
        </div>
        <div>
          <label className={labelClass}>Com prescrição médica?</label>
            <select
            value={medicationData.comPrescricaoMedica}
            onChange={(e) => {
                if (!somenteLeitura) {
                handleFieldChange("comPrescricaoMedica", e.target.value);
                }
            }}
            className={inputClass}
            disabled={somenteLeitura} 
            >
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            </select>

        </div>
        <div>
          <label className={labelClass}>Data início:</label>
          <input
            type="date"
            value={medicationData.dataInicio}
            onChange={(e) => handleFieldChange("dataInicio", e.target.value)}
            className={inputClass}
            disabled={somenteLeitura} 
          />
        </div>
        <div>
          <label className={labelClass}>Data término ou atual:</label>
          <input
            type="date"
            value={medicationData.dataTermino}
            onChange={(e) => handleFieldChange("dataTermino", e.target.value)}
            className={inputClass}
            readOnly={somenteLeitura}

          />
        </div>
        <div>
          <label className={labelClass}>Tempo de uso:</label>
          <input type="text" value={calculateTempoDeUso()} className={`${inputClass} bg-gray-100 cursor-not-allowed`} readOnly={somenteLeitura}/>
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className={labelClass}>Finalidade do uso:</label>
          <input
            type="text"
            value={medicationData.finalidade}
            onChange={(e) => handleFieldChange("finalidade", e.target.value)}
            className={inputClass}
            readOnly={somenteLeitura}

          />
        </div>
      </div>

      <div className="mt-4">
        <h5 className="font-semibold text-gray-700 mb-2">Posologia</h5>
        <div className="overflow-x-auto rounded-md border border-gray-600">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posologia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Em jejum?</th>
                <th className="px-6 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicationData.posologias.map((pos, i) => (
                <tr key={i}>
                  <td className="p-2"><input type="text" value={pos.posologia} onChange={(e) => handlePosologiaChange(i, "posologia", e.target.value)} className={tableInputClass} readOnly={somenteLeitura}
/></td>
                  <td className="p-2"><input type="text" value={pos.frequencia} onChange={(e) => handlePosologiaChange(i, "frequencia", e.target.value)} className={tableInputClass} readOnly={somenteLeitura}
/></td>
                  <td className="p-2"><input type="text" value={pos.dose} onChange={(e) => handlePosologiaChange(i, "dose", e.target.value)} className={tableInputClass} readOnly={somenteLeitura}
 /></td>
                  <td className="p-2"><input type="text" value={pos.horario} onChange={(e) => handlePosologiaChange(i, "horario", e.target.value)} className={tableInputClass} readOnly={somenteLeitura} /></td>
                  <td className="p-2">
                    <select
                      value={pos.emJejum}
                      onChange={(e) => handlePosologiaChange(i, "emJejum", e.target.value)}
                      className={tableInputClass}
                      disabled={somenteLeitura} 
                    >
                      <option value="">Selecione</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    {medicationData.posologias.length > 1 && (
                      <button type="button" onClick={() => removePosologiaRow(i)} className="text-red-500 hover:text-red-700 text-2xl font-bold">&times;</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addPosologiaRow} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-3">+ Adicionar Linha de Posologia</button>
      </div>

      {showRemoveButton && (
        <div className="flex justify-end mt-4">
          <button type="button" onClick={onRemove} className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors">Remover Medicamento</button>
        </div>
      )}
    </div>
  )
}

const BAASIS: React.FC<BaasisProps> = ({ onChange, value,  somenteLeitura }) => {
  const [data, setData] = useState<BaasisData>({ p1: "", p2: "", p3: "", p4: "" });

  useEffect(() => {
    if (value) setData(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (somenteLeitura) return;
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };

  const questions: Question[] = [
    { key: "p1", label: "P1. Esqueceu insulina na última semana?", options: ["Nunca", "1-2x", "3-4x", "5+"] },
    { key: "p2", label: "P2. Reduziu/pulou doses sem orientação?", options: ["Sim", "Não"] },
    { key: "p3", label: "P3. Aplicou fora do horário?", options: ["Sim", "Não"] },
    { key: "p4", label: "P4. Dias sem insulina no último mês?", options: ["0", "1-2", "3-5", ">5"] },
  ];

  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-6 space-y-4">
      <h4 className="text-xl font-semibold text-blue-800">BAASIS para pacientes com MDI</h4>
      <p className="text-sm text-gray-600">
        Objetivo: Avaliar especificamente a adesão à insulina em pacientes com DM1 e uso de MDI.
      </p>
      {questions.map((q) => (
        <div key={q.key}>
          <label className={labelClass}>{q.label}</label>
          <select
            name={q.key}
            value={data[q.key as keyof BaasisData]}
            onChange={handleChange}
            className={`${inputClass} ${somenteLeitura ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
            disabled={somenteLeitura}
            tabIndex={somenteLeitura ? -1 : 0}
          >
            <option value="">Selecione</option>
            {q.options.map((opt, index) => (
              <option key={index} value={index}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
      <p className="pt-2 text-sm text-blue-800 font-medium">
        CLASSIFICAÇÃO: Não aderente se: ≥1 falha (P1), "Sim" (P2/P3), ou ≥3 dias sem (P4).
      </p>
    </div>
  );
};

const BAASIS_CSII: React.FC<BaasisCSIIProps> = ({ onChange, value, somenteLeitura }) => {
  const [data, setData] = useState<BaasisCSIIData>({ p1: "", p2: "", p3: "", p4: "", p5: "", p6: "" })

  useEffect(() => {
    if (value) setData(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (somenteLeitura) return 
    const { name, value } = e.target
    const newData = { ...data, [name]: value }
    setData(newData)
    onChange(newData)
  }

  const questions: Question[] = [
    { key: "p1", label: "P1. Omissão de bolus na última semana:", options: ["Nunca", "1-2x", "3-4x", "5+"] },
    { key: "p2", label: "P2. Redução não autorizada de bolus:", options: ["Sim", "Não"] },
    { key: "p3", label: "P3. Dias sem basal por falha na bomba:", options: ["0", "1-2", "3-5", ">5"] },
    { key: "p4", label: "P4. Bomba desconectada >1h:", options: ["Nenhuma", "1-2x", "3-4x", "5+"] },
    { key: "p5", label: "P5. Troca de cateter atrasada:", options: ["Nenhuma", "1-2x", "3-4x", "5+"] },
    { key: "p6", label: "P6. Ignorar alarmes:", options: ["Frequentemente", "Às vezes", "Raramente", "Nunca"] },
  ]

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200 mt-6 space-y-4">
      <h4 className="text-xl font-semibold text-green-800">BAASIS-CSII para usuários de bomba de insulina (SICI)</h4>
      <p className="text-sm text-gray-600">
        Objetivo: Avaliar comportamentos de não adesão específicos de usuários de CSII.
      </p>
      {questions.map((q) => (
        <div key={q.key}>
          <label className={labelClass}>{q.label}</label>
          <select
            name={q.key}
            value={String(data[q.key as keyof BaasisCSIIData] ?? "")}
            onChange={handleChange}
            className={`${inputClass} ${somenteLeitura ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
            disabled={somenteLeitura}
            tabIndex={somenteLeitura ? -1 : 0}
          >
            <option value="">Selecione</option>
            {q.options.map((opt, index) => (
              <option key={index} value={String(index)}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
      <p className="pt-2 text-sm text-green-800 font-medium">
        CLASSIFICAÇÃO: Não aderente se: ≥1 falha (P1,4,5), "Sim" (P2), ≥3 dias (P3), ou "Frequentemente/Às vezes" (P6).
      </p>
    </div>
  )
}

const InsulinAdherence: React.FC<InsulinAdherenceProps> = ({ value, onChange, somenteLeitura }) => {
  const [method, setMethod] = useState<string>(value.method || "")

  useEffect(() => {
    setMethod(value.method || "")
  }, [value.method])

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = e.target.value
    setMethod(newMethod)
    onChange({ method: newMethod, questionnaire: {} as BaasisData })
  }
  const handleQuestionnaireChange = (data: BaasisData | BaasisCSIIData) => {
    onChange({ method, questionnaire: data })
  }

  return (
    <div className={sectionContainerClass}>
      <h2 className={sectionTitleClass}>Adesão ao tratamento com insulina</h2>
      <div className="mt-6 max-w-sm">
        <label className={labelClass}>Método de administração de insulina:</label>
        <select
            value={method}
            onChange={(e) => {
                if (!somenteLeitura) {
                handleMethodChange(e)
                }
            }}
            className={`${inputClass} ${somenteLeitura ? "pointer-events-none bg-gray-100 text-gray-500" : ""}`}
            disabled={!!somenteLeitura} 
            >
            <option value="">Selecione</option>
            <option value="SICI">SICI</option>
            <option value="MDI">MDI</option>
        </select>


      </div>
          {method === "MDI" && (
            <BAASIS
              value={value.questionnaire as BaasisData}
              onChange={handleQuestionnaireChange}
              somenteLeitura={somenteLeitura}
            />
          )}
          {method === "SICI" && (
            <BAASIS_CSII
              value={value.questionnaire as BaasisCSIIData}
              onChange={handleQuestionnaireChange}
              somenteLeitura={somenteLeitura} 
            />
)}    </div>
  )
}

const medicationCategories: MedicationCategory[] = [
  { title: "Hipoglicemiante Oral", key: "hipoglicemianteOral" },
  { title: "Inibidores da Dipeptidil Peptidase-4 (DPP-4i - Gliptinas)", key: "dpp4i" },
  { title: "Inibidores do SGLT-2 (SGLT-2i)", key: "sglt2i" },
  { title: "Combinações Fixas (SGLT-2i + DPP-4i)", key: "combinacoesFixas" },
  { title: "Agonistas do Receptor de GLP-1 (GLP-1 RA)", key: "glp1ra" },
  { title: "Imunobiológicos", key: "imunobiologicos" },
  { title: "Anti-hipertensivos", key: "antihipertensivos" },
  { title: "Estatinas", key: "estatinas" },
  { title: "Antiagregante plaquetário", key: "antiagregantePlaquetario" },
  { title: "Tratamento para tireoide", key: "tratamentoTireoide" },
  { title: "Antidepressivos", key: "antidepressivos" },
  { title: "Vitaminas", key: "vitaminas", isParent: true },
  { title: "Vitamina D (1)", key: "vitaminaD1", parent: "vitaminas" },
  { title: "Vitamina D (2)", key: "vitaminaD2", parent: "vitaminas" },
]

const createInitialMedState = (): MedicationData => ({
  medicamento: "", principioAtivo: "", comPrescricaoMedica: "", dataInicio: "", dataTermino: "", finalidade: "",
  posologias: [{ posologia: "", frequencia: "", dose: "", horario: "", emJejum: "" }],
})

const ComplementaryMedications: React.FC<ComplementaryMedicationsProps> = ({ onChange, initialMedications, somenteLeitura}) => {
  const [meds, setMeds] = useState<Record<string, MedicationData>>(initialMedications || {})
  useEffect(() => {
    if (initialMedications) setMeds(initialMedications)
  }, [initialMedications])

  const handleToggle = (key: string) => {
    setMeds(prevMeds => {
      const newMeds = { ...prevMeds }
      if (newMeds[key]) {
        delete newMeds[key]
      } else {
        newMeds[key] = createInitialMedState()
      }
      onChange(newMeds)
      return newMeds
    })
  }
  const handleDataChange = (key: string, data: MedicationData) => {
    setMeds(prevMeds => {
      const newMeds = { ...prevMeds, [key]: data }
      onChange(newMeds)
      return newMeds
    })
  }

  return (
    <div className={sectionContainerClass}>
        <h2 className={sectionTitleClass}>Tratamento Medicamentoso Complementar</h2>
        <div className="space-y-6 mt-6">
            {medicationCategories.filter(cat => !cat.parent).map(cat => (
                <div key={cat.key} className="bg-gray-50 p-6 rounded-lg border">
                    <div className="flex justify-between items-center">
                        <h4 className={subTitleClass}>{cat.title}</h4>
                        {!cat.isParent && (
                            <label className="flex items-center cursor-pointer">
                                <span className="mr-3 text-sm font-medium text-gray-900">Em uso?</span>
                                <div className="relative">
                                    <input type="checkbox" checked={!!meds[cat.key]} onChange={() => handleToggle(cat.key)} className="sr-only peer" readOnly={somenteLeitura}/>
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                        )}
                    </div>
                    {meds[cat.key] && !cat.isParent && <MedicationCard medicationData={meds[cat.key]} onDataChange={(data) => handleDataChange(cat.key, data)} somenteLeitura={somenteLeitura} />}
                      {cat.isParent && (
                        <div className="pl-4 mt-4 space-y-4">
                          {medicationCategories.filter(subCat => subCat.parent === cat.key).map(subCat => (
                            <div key={subCat.key} className="bg-white p-4 rounded-lg border">
                              <div className="flex justify-between items-center">
                                <h5 className="font-semibold text-gray-900">{subCat.title}</h5>
                                <label className="flex items-center cursor-pointer">
                                  <span className="mr-3 text-sm font-medium text-gray-900">Em uso?</span>
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={!!meds[subCat.key]}
                                      onChange={() => handleToggle(subCat.key)}
                                      className="sr-only peer"
                                      disabled={somenteLeitura}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </div>
                                </label>
                              </div>
                                {meds[subCat.key] && (
                                  <MedicationCard
                                    medicationData={meds[subCat.key]}
                                    onDataChange={(data) => handleDataChange(subCat.key, data)}
                                    somenteLeitura={somenteLeitura}
                                  />
                                )}                            
                              </div>
                          ))}
                        </div>
                      )}
                </div>
            ))}
        </div>
    </div>
  )
}

const OtherMedications: React.FC<OtherMedicationsProps> = ({ onChange, initialMedications }) => {
  const [meds, setMeds] = useState<MedicationData[]>(initialMedications || [])

  useEffect(() => {
    if (initialMedications) setMeds(initialMedications)
  }, [initialMedications])

  const addMedication = () => {
    const newMeds = [...meds, createInitialMedState()]
    setMeds(newMeds)
    onChange(newMeds)
  }
  const removeMedication = (index: number) => {
    const newMeds = meds.filter((_, i) => i !== index)
    setMeds(newMeds)
    onChange(newMeds)
  }
  const handleMedicationChange = (index: number, data: MedicationData) => {
    const newMeds = [...meds]
    newMeds[index] = data
    setMeds(newMeds)
    onChange(newMeds)
  }

  return (
    <div className="p-6">
      <h2 className={sectionTitleClass}>Outros Medicamentos</h2>
      <div className="space-y-6 mt-6">
        {meds.map((med, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-lg border">
            <MedicationCard medicationData={med} onDataChange={(data) => handleMedicationChange(idx, data)} onRemove={() => removeMedication(idx)} showRemoveButton={true} />
          </div>
        ))}
        <button type="button" onClick={addMedication} className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors">+ Adicionar Outro Medicamento</button>
      </div>
    </div>
  )
}

interface Instrucao { 
  id: number; 
  posologia: string; 
  frequencia: string; 
  dose: string; 
  horario: string; 
  jejum: boolean; 
  tratamento: number; 
} 

interface TratamentoMedicamento { 
  id: number; 
  nome: string; 
  nome_comercial: string;
  principio_ativo: string; 
  prescricao: boolean; 
  finalidade: string; 
  data_inicio: string; 
  data_termino: string; 
  instrucoes: Instrucao[]; 
}

interface AppProps {
  patientData?: PatientInfoData;
  initialData?: any;
  somenteLeitura?: boolean;
}

const App: React.FC<AppProps> = ({ patientData, initialData, somenteLeitura }) => {
	const [message, setMessage] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [currentPage, setCurrentPage] = useState('formulario');
	const [formKey, setFormKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  
	const [formData, setFormData] = useState<FormData>({
		patientInfo: {},
		insulinAdherence: {
			method: "",
			questionnaire: undefined,
		},
		complementaryMedications: {},
		otherMedications: [],
	});

  useEffect(() => {
    let patient: PatientInfoData = {
      id: patientData?.id || initialData?.patient || 0,
      nome: patientData?.nome || "",
      idade: patientData?.idade || "",
      sexo: patientData?.sexo || "",
      peso: (patientData?.peso ?? initialData?.peso ?? "").toString(),
      estatura: (patientData?.estatura ?? initialData?.estatura ?? "").toString(),
      data_nascimento: patientData?.data_nascimento || "",
      dataAvaliacao: initialData?.data_consulta || new Date().toISOString().split("T")[0],
    };

    if (initialData) {
      patient.peso = (initialData?.peso ?? "").toString();
      patient.estatura = (initialData?.estatura ?? "").toString();

      let questionnaire: BaasisData | BaasisCSIIData | undefined = undefined;

      if (initialData.metodo_insulina === "MDI" && initialData.adesao_mdi) {
        const m = initialData.adesao_mdi;
        questionnaire = {
          p1: String(m.esqueceu_insulina),
          p2: m.reducao_doses ? "1" : "0",
          p3: m.aplicou_fora_horario ? "1" : "0",
          p4: String(m.dias_sem_insulina)
        };
      } else if (initialData.metodo_insulina === "SICI" && initialData.adesao_sici) {
        const s = initialData.adesao_sici;
        questionnaire = {
          p1: String(s.omissao_bolus),
          p2: s.reducao ? "1" : "0",
          p3: String(s.dias_falha_bomba),
          p4: String(s.bomba_desconectada),
          p5: String(s.troca_cateter),
          p6: String(s.ignorar_alarmes),
        };
      }

      const complementaryMedications: Record<string, MedicationData> = {};
      const otherMedications: MedicationData[] = [];

      initialData.tratamento_medicamentos.forEach((med: TratamentoMedicamento) => {
        const medData: MedicationData = {
          medicamento: med.nome,
          principioAtivo: med.principio_ativo,
          comPrescricaoMedica: med.prescricao ? "Sim" : "Não",
          dataInicio: med.data_inicio,
          dataTermino: med.data_termino,
          finalidade: med.finalidade,
          posologias: med.instrucoes.map(i => ({
            id: i.id,
            posologia: i.posologia,
            frequencia: i.frequencia,
            dose: i.dose,
            horario: i.horario,
            emJejum: i.jejum ? "Sim" : "Não",
          })),
        };

        const category = medicationCategories.find(c => c.title === med.nome);
        if (category) {
          complementaryMedications[category.key] = medData;
        } else {
          otherMedications.push(medData);
        }
      });



      setFormData(prev => ({
        ...prev,
        patientInfo: patient,
        nomeCompleto: patient.nome,
        sexo: patient.sexo,
        idade: patient.idade,
          insulinAdherence: {
          method: initialData.metodo_insulina || "",
          questionnaire
        },
        complementaryMedications: complementaryMedications,
        otherMedications: otherMedications,
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        patientInfo: patient,
        insulinAdherence: { method: "", questionnaire: undefined },
        complementaryMedications: {},
        otherMedications: []
      }));
      return;
    }
  }, [initialData, patientData]);

	const handleChange = (section: keyof FormData, data: any) => {
		setFormData((prevData) => ({ ...prevData, [section]: data }))
	}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.patientInfo?.dataAvaliacao) {
        setMessage('A Data da Avaliação é obrigatória.');
        setShowModal(true);
        return;
    }

    const complementaryMeds = Object.entries(formData.complementaryMedications).map(([catKey, med]) => {
        const categoria = medicationCategories.find(c => c.key === catKey)?.title || "Outro";
        return {
            nome: categoria,
            nome_comercial: med.medicamento,
            principio_ativo: med.principioAtivo,
            prescricao: med.comPrescricaoMedica === "Sim",
            finalidade: med.finalidade,
            data_inicio: med.dataInicio,
            data_termino: med.dataTermino,
            instrucoes: med.posologias.map((p) => ({
                posologia: p.posologia,
                frequencia: p.frequencia,
                dose: p.dose,
                horario: p.horario,
                jejum: p.emJejum === "Sim",
            })),
        };
    });

    
    const otherMeds = formData.otherMedications.map(med => ({
        nome: med.medicamento,
        nome_comercial: med.medicamento,
        principio_ativo: med.principioAtivo,
        prescricao: med.comPrescricaoMedica === "Sim",
        finalidade: med.finalidade,
        data_inicio: med.dataInicio,
        data_termino: med.dataTermino,
        instrucoes: med.posologias.map((p) => ({
            posologia: p.posologia,
            frequencia: p.frequencia,
            dose: p.dose,
            horario: p.horario,
            jejum: p.emJejum === "Sim",
        })),
    }));

    const payload: any = {
        patient: formData.patientInfo?.id,
				peso: parseFloat(formData.patientInfo.peso || "0"),
        estatura: parseFloat(formData.patientInfo.estatura || "0"),
        data_consulta: formData.patientInfo.dataAvaliacao,
        tratamento_medicamentos: [...complementaryMeds, ...otherMeds],
        metodo_insulina: formData.insulinAdherence.method
    };


    if (formData.insulinAdherence.method === "SICI" && formData.insulinAdherence.questionnaire) {
			const q = formData.insulinAdherence.questionnaire as BaasisCSIIData;
			payload.adesao_sici = {
					omissao_bolus: Number(q.p1),
					reducao: q.p2 === "1", 
					dias_falha_bomba: Number(q.p3),
					bomba_desconectada: Number(q.p4),
					troca_cateter: Number(q.p5),
					ignorar_alarmes: Number(q.p6),
			}
		} else if (formData.insulinAdherence.method === "MDI" && formData.insulinAdherence.questionnaire) {
			const q = formData.insulinAdherence.questionnaire as BaasisData;
			payload.adesao_mdi = {
					esquece_insulina: Number(q.p1),
					reducao_doses: q.p2 === "1",
					aplicou_fora_horario: q.p3 === "1",
					dias_sem_insulina: Number(q.p4),
			}
		}


		let objCriado: any = await apiFetch("/api/consulta-farmacia/", true, {
			method: "POST",
			body: JSON.stringify(payload),
		});

    let input = fileInputRef.current;
    if(input && input.files) {
      uploadFiles(Array.from(input.files), 'consultafarmacia', objCriado.id);
    }

		setMessage("Formulário enviado com sucesso!");
		setShowModal(true);
		setCurrentPage("consultas");

		setFormData({
        patientInfo: {
            nome: "",
            dataAvaliacao: "",
            sexo: "",
            idade: "",
            peso: "",
            estatura: "",
            data_nascimento: "",
        },
        insulinAdherence: {
            method: "",
            questionnaire: undefined,
        },
        complementaryMedications: {},
        otherMedications: [],
    });

		setFormKey(prev => prev + 1);
	};

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans p-6 text-gray-800">
        <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Avaliação Farmácia</h1>

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

            <form key={formKey} onSubmit={handleSubmit} className="space-y-0">
                <PatientBasicInfo patientData={formData.patientInfo} onChange={(data) => handleChange("patientInfo", data)} />
                <InsulinAdherence
                value={formData.insulinAdherence}
                onChange={(data) => handleChange("insulinAdherence", data)}
                somenteLeitura={somenteLeitura}
                />
                <ComplementaryMedications initialMedications={formData.complementaryMedications} onChange={(data) => handleChange("complementaryMedications", data)} somenteLeitura={somenteLeitura}/>
                <OtherMedications initialMedications={formData.otherMedications} onChange={(data) => handleChange("otherMedications", data)} />

                <div className="p-4 mt-8">
                  <h2 className="text-2xl font-bold text-blue-900">Anexo de exames complementares</h2>
                  <FileInput
                    ref={fileInputRef}
                    name="anexar"
                    multiple
                  />
                </div>

              
                  {!somenteLeitura && (
                  <div className="flex justify-center">
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

export default App
