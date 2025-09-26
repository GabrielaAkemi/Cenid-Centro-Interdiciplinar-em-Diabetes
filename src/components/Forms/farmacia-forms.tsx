"use client"

import type React from "react"
import { useState, useCallback } from "react"

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
}

interface PatientInfoData {
  nome?: string
  dataAvaliacao?: string
  sexo?: string
  idade?: string
  peso?: string
  estatura?: string
  data_nascimento?: string
}

interface PatientInfoProps {
  onChange: (data: PatientInfoData) => void
  patientData?: PatientInfoData
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
  onChange: (data: BaasisData) => void
}

interface BaasisCSIIProps {
  onChange: (data: BaasisCSIIData) => void
}

interface InsulinAdherenceData {
  method?: string
  questionnaire?: BaasisData | BaasisCSIIData
}

interface InsulinAdherenceProps {
  onChange: (data: InsulinAdherenceData) => void
}

interface ComplementaryMedicationsProps {
  onChange: (data: Record<string, MedicationData>) => void
}

interface OtherMedicationsProps {
  onChange: (data: MedicationData[]) => void
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

interface FormField {
  name: string
  label: string
  type: string
  options?: string[]
  step?: string
  readOnly?: boolean
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
          />
        </div>
        <div>
          <label className={labelClass}>Princípio ativo:</label>
          <input
            type="text"
            value={medicationData.principioAtivo}
            onChange={(e) => handleFieldChange("principioAtivo", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Com prescrição médica?</label>
          <select
            value={medicationData.comPrescricaoMedica}
            onChange={(e) => handleFieldChange("comPrescricaoMedica", e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Data início:</label>
          <input
            type="date"
            value={medicationData.dataInicio}
            onChange={(e) => handleFieldChange("dataInicio", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Data término ou atual:</label>
          <input
            type="date"
            value={medicationData.dataTermino}
            onChange={(e) => handleFieldChange("dataTermino", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Tempo de uso:</label>
          <input type="text" value={calculateTempoDeUso()} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed`} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className={labelClass}>Finalidade do uso:</label>
          <input
            type="text"
            value={medicationData.finalidade}
            onChange={(e) => handleFieldChange("finalidade", e.target.value)}
            className={inputClass}
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
                  <td className="p-2"><input type="text" value={pos.posologia} onChange={(e) => handlePosologiaChange(i, "posologia", e.target.value)} className={tableInputClass} /></td>
                  <td className="p-2"><input type="text" value={pos.frequencia} onChange={(e) => handlePosologiaChange(i, "frequencia", e.target.value)} className={tableInputClass} /></td>
                  <td className="p-2"><input type="text" value={pos.dose} onChange={(e) => handlePosologiaChange(i, "dose", e.target.value)} className={tableInputClass} /></td>
                  <td className="p-2"><input type="text" value={pos.horario} onChange={(e) => handlePosologiaChange(i, "horario", e.target.value)} className={tableInputClass} /></td>
                  <td className="p-2">
                    <select value={pos.emJejum} onChange={(e) => handlePosologiaChange(i, "emJejum", e.target.value)} className={tableInputClass}>
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

const calculateAge = (birthDateStr: string) => {
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString();
};

const PatientInfo: React.FC<PatientInfoProps> = ({ onChange, patientData }) => {
  const [data, setData] = useState<PatientInfoData>({
    ...patientData,
    idade: patientData?.data_nascimento ? calculateAge(patientData.data_nascimento) : "",
    sexo: patientData?.sexo === "M" ? "Masculino" : patientData?.sexo === "F" ? "Feminino" : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };

  const fields: FormField[] = [
    { name: "nome", label: "Nome completo:", type: "text", readOnly: true },
    { name: "dataAvaliacao", label: "Data da avaliação:", type: "date" },
    { name: "sexo", label: "Sexo:", type: "select", options: ["Masculino", "Feminino"], readOnly: true },
    { name: "idade", label: "Idade (anos):", type: "number", readOnly: true },
    { name: "peso", label: "Peso (kg):", type: "number", step: "0.1" },
    { name: "estatura", label: "Estatura (metros):", type: "number", step: "0.01" },
    { name: "data_nascimento", label: "Data de Nascimento:", type: "date", readOnly: true },
  ];

  return (
    <div className={sectionContainerClass}>
      <h2 className={sectionTitleClass}>Dados do Paciente</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className={labelClass}>{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                id={field.name}
                onChange={handleChange}
                className={`${inputClass} ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={field.readOnly || false}
                value={data[field.name as keyof PatientInfoData] || ""}
              >
                <option value="">Selecione</option>
                {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                step={field.step}
                value={data[field.name as keyof PatientInfoData] || ""}
                onChange={handleChange}
                className={`${inputClass} ${field.readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                readOnly={field.readOnly}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const BAASIS: React.FC<BaasisProps> = ({ onChange }) => {
  const [data, setData] = useState<BaasisData>({ p1: "", p2: "", p3: "", p4: "" })
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    const newData = { ...data, [name]: value }
    setData(newData)
    onChange(newData)
  }

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
          <select name={q.key} value={data[q.key as keyof BaasisData]} onChange={handleChange} className={inputClass}>
            <option value="">Selecione</option>
            {q.options.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      ))}
      <p className="pt-2 text-sm text-blue-800 font-medium">
        CLASSIFICAÇÃO: Não aderente se: ≥1 falha (P1), "Sim" (P2/P3), ou ≥3 dias sem (P4).
      </p>
    </div>
  )
}

const BAASIS_CSII: React.FC<BaasisCSIIProps> = ({ onChange }) => {
  const [data, setData] = useState<BaasisCSIIData>({ p1: "", p2: "", p3: "", p4: "", p5: "", p6: "" })
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
          <select name={q.key} value={data[q.key as keyof BaasisCSIIData]} onChange={handleChange} className={inputClass}>
            <option value="">Selecione</option>
            {q.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      ))}
      <p className="pt-2 text-sm text-green-800 font-medium">
        CLASSIFICAÇÃO: Não aderente se: ≥1 falha (P1,4,5), "Sim" (P2), ≥3 dias (P3), ou "Frequentemente/Às vezes" (P6).
      </p>
    </div>
  )
}

const InsulinAdherence: React.FC<InsulinAdherenceProps> = ({ onChange }) => {
  const [method, setMethod] = useState<string>("")
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
        <select value={method} onChange={handleMethodChange} className={inputClass}>
          <option value="">Selecione</option>
          <option value="SICI">SICI</option>
          <option value="MDI">MDI</option>
        </select>
      </div>
      {method === "MDI" && <BAASIS onChange={handleQuestionnaireChange} />}
      {method === "SICI" && <BAASIS_CSII onChange={handleQuestionnaireChange} />}
    </div>
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

const ComplementaryMedications: React.FC<ComplementaryMedicationsProps> = ({ onChange }) => {
  const [meds, setMeds] = useState<Record<string, MedicationData>>({})
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
                                    <input type="checkbox" checked={!!meds[cat.key]} onChange={() => handleToggle(cat.key)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                        )}
                    </div>
                    {meds[cat.key] && !cat.isParent && <MedicationCard medicationData={meds[cat.key]} onDataChange={(data) => handleDataChange(cat.key, data)} />}
                    {cat.isParent && (
                        <div className="pl-4 mt-4 space-y-4">
                            {medicationCategories.filter(subCat => subCat.parent === cat.key).map(subCat => (
                                <div key={subCat.key} className="bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-semibold text-gray-900">{subCat.title}</h5>
                                        <label className="flex items-center cursor-pointer">
                                            <span className="mr-3 text-sm font-medium text-gray-900">Em uso?</span>
                                            <div className="relative">
                                                <input type="checkbox" checked={!!meds[subCat.key]} onChange={() => handleToggle(subCat.key)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                        </label>
                                    </div>
                                    {meds[subCat.key] && <MedicationCard medicationData={meds[subCat.key]} onDataChange={(data) => handleDataChange(subCat.key, data)} />}
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

const OtherMedications: React.FC<OtherMedicationsProps> = ({ onChange }) => {
  const [meds, setMeds] = useState<MedicationData[]>([])
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

interface AppProps {
  patientData?: PatientInfoData;
}

const App: React.FC<AppProps> = ({ patientData }) => {
  const [formData, setFormData] = useState<FormData>({
    patientInfo: {}, insulinAdherence: {}, complementaryMedications: {}, otherMedications: [],
  })
  const handleChange = (section: keyof FormData, data: any) => {
    setFormData((prevData) => ({ ...prevData, [section]: data }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form data submitted:", formData)
    // Idealmente, você usaria um modal para exibir esta mensagem
    alert("Formulário enviado com sucesso! Verifique o console para os dados.")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans p-6 text-gray-800">
        <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Avaliação Farmácia</h1>
            <form onSubmit={handleSubmit} className="space-y-0">
                <PatientInfo patientData={patientData} onChange={(data) => handleChange("patientInfo", data)} />
                <InsulinAdherence onChange={(data) => handleChange("insulinAdherence", data)} />
                <ComplementaryMedications onChange={(data) => handleChange("complementaryMedications", data)} />
                <OtherMedications onChange={(data) => handleChange("otherMedications", data)} />

                <div className="flex justify-center pt-8">
                    <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
                        Salvar Avaliação
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default App
