import type React from "react"
import { useState, useEffect } from "react"

const inputClass = "p-3.5 border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 w-full bg-white text-gray-800";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";
const sectionTitleClass = "text-2xl font-bold text-blue-900";
const sectionContainerClass = "p-6 border-b border-gray-200";

interface FormField {
  name: string
  label: string
  type: string
  options?: string[]
  step?: string
  readOnly?: boolean
  placeholder?: string
}

export interface PatientInfoData {
  id?: number
  nome?: string
  dataAvaliacao?: string
  sexo?: string
  idade?: string
  peso?: string
  estatura?: string
  data_nascimento?: string
}

interface PatientBasicInfoProps {
  onChange: (data: PatientInfoData) => void
  patientData: PatientInfoData | undefined;
  somenteLeitura?: boolean;
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

const PatientBasicInfo: React.FC<PatientBasicInfoProps> = ({ onChange, patientData, somenteLeitura }) => {
  const [data, setData] = useState<PatientInfoData>({
    id: patientData?.id,
    nome: patientData?.nome || "",
    dataAvaliacao: patientData?.dataAvaliacao || new Date().toISOString().split("T")[0],
    data_nascimento: patientData?.data_nascimento || "",
    sexo: patientData?.sexo === "M" ? "Masculino" : patientData?.sexo === "F" ? "Feminino" : "",
    idade: patientData?.data_nascimento ? calculateAge(patientData.data_nascimento) : "",
    peso: patientData?.peso || "",
    // começa vazio (não com valor 0)
    estatura: patientData?.estatura || "",
  });

  useEffect(() => {
    if (!patientData) return;
    setData(prev => ({
      ...prev,
      id: patientData.id,
      nome: patientData.nome || "",
      dataAvaliacao: patientData.dataAvaliacao || prev.dataAvaliacao,
      data_nascimento: patientData.data_nascimento || prev.data_nascimento,
      sexo: patientData.sexo === "M" ? "Masculino" : patientData.sexo === "F" ? "Feminino" : prev.sexo,
      idade: patientData.data_nascimento ? calculateAge(patientData.data_nascimento) : prev.idade,
      peso: patientData.peso ?? prev.peso,
      estatura: patientData.estatura ?? prev.estatura ?? "",
    }));
  }, [patientData?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "peso" || name === "estatura") {
      let tempValue = value;

      tempValue = tempValue.replace(/[^0-9,.]/g, ''); 

      if (tempValue.includes(',')) {
          tempValue = tempValue.replace(/\./g, '');
      } else {
          tempValue = tempValue.replace(/,/g, '');
      }
      
      const separator = tempValue.includes(',') ? ',' : '.';
      const parts = tempValue.split(separator);

      if (parts.length > 2) {
        newValue = parts[0] + separator + parts.slice(1).join('');
      } else {
        newValue = tempValue;
      }

      if (newValue.startsWith('.') || newValue.startsWith(',')) {
          newValue = '0' + newValue;
      }
    }

    const newData = { ...data, [name]: newValue };
    setData(newData);
    onChange(newData);
  };

  const fields: FormField[] = [
    { name: "nome", label: "Nome completo:", type: "text", readOnly: true },
    { name: "dataAvaliacao", label: "Data da avaliação:", type: "date", readOnly: somenteLeitura },
    { name: "sexo", label: "Sexo:", type: "select", options: ["Masculino", "Feminino"], readOnly: true },
    { name: "idade", label: "Idade (anos):", type: "number", readOnly: true },
    { name: "peso", label: "Peso (kg):", type: "text", step: "0.1", placeholder: "00,0", readOnly: somenteLeitura },
    { name: "estatura", label: "Estatura (metros):", type: "text", step: "0.01", placeholder: "0,00", readOnly: somenteLeitura },
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
                placeholder={field.placeholder}
                value={data[field.name as keyof PatientInfoData] ?? ""}
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

export default PatientBasicInfo;
