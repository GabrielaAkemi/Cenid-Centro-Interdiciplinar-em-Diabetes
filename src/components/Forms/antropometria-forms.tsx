"use client";

import React, { useState, useEffect, useRef } from "react";
import PatientBasicInfo, {PatientInfoData} from "./basicInfo/patientBasicInfo";
import { apiFetch } from "@/lib/api";
import FileInput from "../fileInput/fileInput";
import uploadFiles from "@/lib/fileInputPost";
import ListaAnexos from "../listaAnexos/listaAnexos";
import StatusToggle, {getStatusContainerClasses} from "../checkConcluido/statusToggle";

const Card = ({ className, children }: any) => <div className={`max-w-4xl mx-auto w-full bg-white p-8 space-y-8 rounded-lg shadow-lg ${className}`}>{children}</div>;
const CardContent = ({ className, children }: any) => <div className={`p-0 ${className}`}>{children}</div>;
const CardHeader = ({ className, children }: any) => <div className={`p-4 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }: any) => <h1 className={`text-3xl font-bold text-center text-blue-900 mb-6 ${className}`}>{children}</h1>;

const Input = ({ className, ...props }: any) => <input className={`p-3.5 w-full border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 ${className}`} {...props} />;
const Button = ({ className, children, ...props }: any) => <button className={`w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition transform hover:scale-105 rounded-md shadow-lg ${className}`} {...props}>{children}</button>;
const Separator = ({ className }: any) => <div className={`h-[1px] my-4 bg-gray-200 ${className}`} />;
const Table = ({ className, ...props }: any) => <table className={`min-w-full overflow-hidden border-collapse ${className}`} {...props} />;
const TableHeader = ({ ...props }: any) => <thead className="bg-gray-50" {...props} />;
const TableHead = ({ className, ...props }: any) => <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props} />;
const TableBody = ({ ...props }: any) => <tbody className="bg-white" {...props} />;
const TableRow = ({ ...props }: any) => <tr className="border-b border-gray-200" {...props} />;
const TableCell = ({ className, ...props }: any) => <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`} {...props} />;

const Dialog = ({ open, onOpenChange, children }: any) => (
  open ? (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  ) : null
);

const DialogContent = ({ children }: any) => children;

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);



const pegaIdade = (dataNascimento: string, dataAvaliacao: string) => {
  if (!dataNascimento || !dataAvaliacao) return 0;
  const nasc = new Date(dataNascimento);
  const aval = new Date(dataAvaliacao);
  let idade = aval.getFullYear() - nasc.getFullYear();
  const m = aval.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && aval.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};



interface AntropometriaProps {
  patientData?: PatientInfoData;
  initialData?: any;
  somenteLeitura?: boolean;
  attachments?: any;
}

interface FormDataType {
  patientInfo: {
    id: number | string;
    nome: string;
    dataAvaliacao: string;
    data_nascimento: string;
    idade: string;
    sexo: string;
    peso: string;
    estatura: string;
    somenteLeitura?: boolean;

  };
  pacienteId: string;
  nomePaciente: string;
  dataAvaliacao: string;
  dataNascimento: string;
  idade: string;
  sexo: string;
  peso_corporal: string;
  estatura_metros: string;
  circunferencia_braco: string;
  circunferencia_cintura: string;
  dobra_tricipal: string;
  imc: string;
  imc_escore_z: string;
  classificacao_imc: string;
  peso_tabela: string;
  peso_escore_z: string;
  classificacao_peso: string;
  estatura_tabela: string;
  estatura_escore_z: string;
  classificacao_estatura: string;
  circunferencia_braco_tabela: string;
  circunferencia_braco_escore_z: string;
  circunferencia_braco_classificacao: string;
  circunferencia_cintura_tabela: string;
  circunferencia_cintura_escore_z: string;
  circunferencia_cintura_classificacao: string;
  dobra_tricipal_tabela: string;
  dobra_tricipal_escore_z: string;
  dobra_tricipal_classificacao: string;
  gordura_corporal_bioimpedância_porcentagem_valor: string;
  gordura_corporal_bioimpedância_porcentagem_diagnostico: string;
  gordura_corporal_bioimpedância_kg_valor: string;
  gordura_corporal_bioimpedância_kg_diagnostico: string;
  massa_magra_bioimpedância_kg_valor: string;
  massa_magra_bioimpedância_kg_diagnostico: string;
  massa_magra_bioimpedância_porcentagem_valor: string;
  massa_magra_bioimpedância_porcentagem_diagnostico: string;
  agua_corporal_bioimpedância_litros_valor: string;
  agua_corporal_bioimpedância_litros_diagnostico: string;
  agua_corporal_bioimpedância_porcentagem_valor: string;
  agua_corporal_bioimpedância_porcentagem_diagnostico: string;
  agua_na_massa_magra_porcentagem_valor: string;
  agua_na_massa_magra_porcentagem_diagnostico: string;
  resistencia_r_ohms_valor: string;
  resistencia_r_ohms_diagnostico: string;
  reatancia_xc_ohms_valor: string;
  reatancia_xc_ohms_diagnostico: string;
  observacoes: string;
}

export default function AntropometriaForm({patientData, initialData, somenteLeitura, attachments} : AntropometriaProps) {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('formulario');
  const [status, setStatus] = useState<"andamento" | "concluida">("andamento");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const patient = {
    id: 0,
    nome: "",
    idade:"",
    sexo: "",
    peso: "",
    estatura:"",
    data_nascimento:"",
    dataAvaliacao:new Date().toISOString().split("T")[0],
  };

  const [formData, setFormData] = useState<FormDataType>({
    patientInfo: {
      id: patient.id || "",
      nome: patient.nome || "",
      data_nascimento: patient.data_nascimento || "",
      dataAvaliacao: initialData?.data_consulta || new Date().toISOString().split("T")[0],
      idade: "",
      sexo: patient.sexo || "",
      peso: patient.peso?.toString() || "",
      estatura: patient.estatura?.toString() || "",
    },
    pacienteId: "",
    nomePaciente: "",
    dataAvaliacao: new Date().toISOString().split("T")[0],
    dataNascimento: "",
    idade: "",
    sexo: "",
    peso_corporal: "",
    estatura_metros: "",
    circunferencia_braco: "",
    circunferencia_cintura: "",
    dobra_tricipal: "",
    imc: "",
    imc_escore_z: "",
    classificacao_imc: "",
    peso_tabela: "",
    peso_escore_z: "",
    classificacao_peso: "",
    estatura_tabela: "",
    estatura_escore_z: "",
    classificacao_estatura: "",
    circunferencia_braco_tabela: "",
    circunferencia_braco_escore_z: "",
    circunferencia_braco_classificacao: "",
    circunferencia_cintura_tabela: "",
    circunferencia_cintura_escore_z: "",
    circunferencia_cintura_classificacao: "",
    dobra_tricipal_tabela: "",
    dobra_tricipal_escore_z: "",
    dobra_tricipal_classificacao: "",
    gordura_corporal_bioimpedância_porcentagem_valor: "",
    gordura_corporal_bioimpedância_porcentagem_diagnostico: "",
    gordura_corporal_bioimpedância_kg_valor: "",
    gordura_corporal_bioimpedância_kg_diagnostico: "",
    massa_magra_bioimpedância_kg_valor: "",
    massa_magra_bioimpedância_kg_diagnostico: "",
    massa_magra_bioimpedância_porcentagem_valor: "",
    massa_magra_bioimpedância_porcentagem_diagnostico: "",
    agua_corporal_bioimpedância_litros_valor: "",
    agua_corporal_bioimpedância_litros_diagnostico: "",
    agua_corporal_bioimpedância_porcentagem_valor: "",
    agua_corporal_bioimpedância_porcentagem_diagnostico: "",
    agua_na_massa_magra_porcentagem_valor: "",
    agua_na_massa_magra_porcentagem_diagnostico: "",
    resistencia_r_ohms_valor: "",
    resistencia_r_ohms_diagnostico: "",
    reatancia_xc_ohms_valor: "",
    reatancia_xc_ohms_diagnostico: "",
    observacoes: "",
  });

  useEffect(() => {
    const patient = {
      id: patientData?.id ?? initialData?.patient ?? 0,
      nome: patientData?.nome || "",
      idade: patientData?.idade || "",
      sexo: patientData?.sexo || "",
      peso: patientData?.peso?.toString() || initialData?.peso?.toString() || "",
      estatura: patientData?.estatura?.toString() || initialData?.estatura?.toString() || "",
      data_nascimento: patientData?.data_nascimento || "",
      dataAvaliacao: initialData?.data_consulta || new Date().toISOString().split("T")[0],
    };

    setFormData(prev => ({
      ...prev,             
      patientInfo: {      
        id: patient.id,
        nome: patient.nome,
        dataAvaliacao: patient.dataAvaliacao,
        data_nascimento: patient.data_nascimento,
        idade: "",
        sexo: patient.sexo,
        peso: patient.peso,
        estatura: patient.estatura,
      },
    }));
    if (!initialData) return;

    setFormData({
      patientInfo: {
        id: patient.id,
        nome: patient.nome,
        dataAvaliacao: patient.dataAvaliacao,
        data_nascimento: patient.data_nascimento,
        idade: "",
        sexo: patient.sexo,
        peso: patient.peso,
        estatura: patient.estatura,
      },
      pacienteId: patient.id.toString(),
      nomePaciente: patient.nome,
      dataAvaliacao: patient.dataAvaliacao,
      dataNascimento: patient.data_nascimento,
      idade: "",
      sexo: patient.sexo,
      peso_corporal: patient.peso,
      estatura_metros: patient.estatura,
      circunferencia_braco: initialData?.medidas?.circunferencia_braco?.toString() || "",
      circunferencia_cintura: initialData?.medidas?.circunferencia_cintura?.toString() || "",
      dobra_tricipal: initialData?.medidas?.dobra_tricipital?.toString() || "",
      imc: "",
      imc_escore_z: "",
      classificacao_imc: "",
      peso_tabela: initialData?.peso?.toString() || "",
      peso_escore_z: "",
      classificacao_peso: "",
      estatura_tabela: initialData?.estatura?.toString() || "",
      estatura_escore_z: "",
      classificacao_estatura: "",
      circunferencia_braco_tabela: initialData?.medidas?.circunferencia_braco?.toString() || "",
      circunferencia_braco_escore_z: "",
      circunferencia_braco_classificacao: "",
      circunferencia_cintura_tabela: initialData?.medidas?.circunferencia_cintura?.toString() || "",
      circunferencia_cintura_escore_z: "",
      circunferencia_cintura_classificacao: "",
      dobra_tricipal_tabela: initialData?.medidas?.dobra_tricipital?.toString() || "",
      dobra_tricipal_escore_z: "",
      dobra_tricipal_classificacao: "",
      gordura_corporal_bioimpedância_porcentagem_valor: initialData?.bio_impedancia?.gordura_porcentagem?.toString() || "",
      gordura_corporal_bioimpedância_porcentagem_diagnostico: "",
      gordura_corporal_bioimpedância_kg_valor: initialData?.bio_impedancia?.gordura_kg?.toString() || "",
      gordura_corporal_bioimpedância_kg_diagnostico: "",
      massa_magra_bioimpedância_kg_valor: initialData?.bio_impedancia?.massa_kg?.toString() || "",
      massa_magra_bioimpedância_kg_diagnostico: "",
      massa_magra_bioimpedância_porcentagem_valor: initialData?.bio_impedancia?.massa_porcentagem?.toString() || "",
      massa_magra_bioimpedância_porcentagem_diagnostico: "",
      agua_corporal_bioimpedância_litros_valor: initialData?.bio_impedancia?.agua_corporal_litros?.toString() || "",
      agua_corporal_bioimpedância_litros_diagnostico: "",
      agua_corporal_bioimpedância_porcentagem_valor: initialData?.bio_impedancia?.agua_corporal_porcentagem?.toString() || "",
      agua_corporal_bioimpedância_porcentagem_diagnostico: "",
      agua_na_massa_magra_porcentagem_valor: initialData?.bio_impedancia?.agua_massa_porcentagem?.toString() || "",
      agua_na_massa_magra_porcentagem_diagnostico: "",
      resistencia_r_ohms_valor: initialData?.bio_impedancia?.resistencia?.toString() || "",
      resistencia_r_ohms_diagnostico: "",
      reatancia_xc_ohms_valor: initialData?.bio_impedancia?.reatancia?.toString() || "",
      reatancia_xc_ohms_diagnostico: "",
      observacoes: initialData?.observacoes || "",
    });

    setStatus(initialData.consulta_finalizada ? 'concluida' : 'andamento');
  }, [initialData, patientData]);

  useEffect(() => {
    const peso = parseFloat(formData.patientInfo.peso);
    const estatura = parseFloat(formData.patientInfo.estatura);

    if (peso && estatura) {
      handleCalculate();
    }
  }, [formData.patientInfo.peso, formData.patientInfo.estatura]);


  const [pacientes, setPacientes] = useState<any[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const nomeContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    
    if (name != "observacoes") {
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

    } else {
        newValue = value;
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

    const handlePatientInfoChange = (data: PatientInfoData) => {
      setFormData(prev => ({
        ...prev,
        patientInfo: {
          id: data.id || "",
          nome: data.nome || "",
          dataAvaliacao: data.dataAvaliacao || "",
          data_nascimento: data.data_nascimento || "",
          idade: data.idade || "",
          sexo: data.sexo || "",
          peso: data.peso || "",
          estatura: data.estatura || "",
        },
        nomePaciente: data.nome || "",
        dataNascimento: data.data_nascimento || "",
        sexo: data.sexo || "",
        idade: data.idade || "",
      }));
    };

  const handleCalculate = async () => {
    const peso = parseFloat(formData.patientInfo.peso);
    const estatura = parseFloat(formData.patientInfo.estatura);

    if (!peso || !estatura) {
      alert("Peso e Estatura são campos obrigatórios para o cálculo.");
      return;
    }

    try {
      const resultado = await apiFetch<{
        imc: number;
        imcZ: number;
        imcDiagnostico: string;
        pesoZ: number;
        pesoDiagnostico: string | null;
        alturaZ: number;
        alturaDiagnostico: string;
      }>(
        "/api/escore-z/",
        true,
        {
          method: "POST",
          body: JSON.stringify({
            dataNascimento: formData.dataNascimento,
            dataAvaliacao: formData.dataAvaliacao,
            altura: estatura * 100,
            peso: peso,
            sexo: formData.sexo[0],
          }),
        }
      );

      setFormData(prev => ({
        ...prev,
        imc: resultado.imc?.toFixed(2) || "",
        imc_escore_z: resultado.imcZ != null ? resultado.imcZ.toString() : "",
        classificacao_imc: resultado.imcDiagnostico || "",
        peso_tabela: peso.toFixed(2),
        peso_escore_z: resultado.pesoZ != null ? resultado.pesoZ.toString() : "",
        classificacao_peso: resultado.pesoDiagnostico || "",
        estatura_tabela: estatura.toFixed(2),
        estatura_escore_z: resultado.alturaZ != null ? resultado.alturaZ.toString() : "",
        classificacao_estatura: resultado.alturaDiagnostico || "",
        circunferencia_braco_tabela: formData.circunferencia_braco,
        circunferencia_cintura_tabela: formData.circunferencia_cintura,
        dobra_tricipal_tabela: formData.dobra_tricipal,
      }));
    } catch (err) {
      console.error("Erro ao calcular escore Z:", err);
      alert("Erro ao calcular escore Z. Tente novamente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientInfo?.dataAvaliacao) {
      alert('A Data da Avaliação é obrigatória.');
      return;
    }


    if (!formData.imc || !formData.imc_escore_z) {
      await handleCalculate();
    }

    const payload = {
      patient: formData.patientInfo.id,
      peso: parseFloat(formData.patientInfo.peso) || 0,
      estatura: parseFloat(formData.patientInfo.estatura) || 0,
      medidas: {
        peso: parseFloat(formData.patientInfo.peso) || 0,
        estatura: parseFloat(formData.patientInfo.estatura) || 0,
        circunferencia_braco: parseFloat(formData.circunferencia_braco) || 0,
        circunferencia_cintura: parseFloat(formData.circunferencia_cintura) || 0,
        dobra_tricipital: parseFloat(formData.dobra_tricipal) || 0,
      },
      bio_impedancia: {
        gordura_porcentagem: parseFloat(formData.gordura_corporal_bioimpedância_porcentagem_valor) || 0,
        gordura_kg: parseFloat(formData.gordura_corporal_bioimpedância_kg_valor) || 0,
        massa_porcentagem: parseFloat(formData.massa_magra_bioimpedância_porcentagem_valor) || 0,
        massa_kg: parseFloat(formData.massa_magra_bioimpedância_kg_valor) || 0,
        agua_corporal_litros: parseFloat(formData.agua_corporal_bioimpedância_litros_valor) || 0,
        agua_corporal_porcentagem: parseFloat(formData.agua_corporal_bioimpedância_porcentagem_valor) || 0,
        agua_massa_porcentagem: parseFloat(formData.agua_na_massa_magra_porcentagem_valor) || 0,
        resistencia: parseFloat(formData.resistencia_r_ohms_valor) || 0,
        reatancia: parseFloat(formData.reatancia_xc_ohms_valor) || 0,
      },
      data_consulta: formData.patientInfo.dataAvaliacao,
      observacoes: formData.observacoes || "",
    };

    try {
      let objCriado: any = await apiFetch("/api/consulta-calculadora/", true, {
              method: "POST",
              body: JSON.stringify(payload),
            });

      let input = fileInputRef.current;
      if(input && input.files) {
        uploadFiles(Array.from(input.files), 'consultacalculadora', objCriado.id);
      }
        
      setMessage("Formulário enviado com sucesso!");
      setShowModal(true);
      setCurrentPage("consultas");

      setFormData({
        patientInfo: {
          id: "",
          nome: "",
          data_nascimento: "",
          dataAvaliacao: new Date().toISOString().split("T")[0],
          idade: "",
          sexo: "",
          peso: "",
          estatura: "",
        },
        pacienteId: "",
        nomePaciente: "",
        dataAvaliacao: new Date().toISOString().split("T")[0],
        dataNascimento: "",
        idade: "",
        sexo: "",
        peso_corporal: "",
        estatura_metros: "",
        circunferencia_braco: "",
        circunferencia_cintura: "",
        dobra_tricipal: "",
        imc: "",
        imc_escore_z: "",
        classificacao_imc: "",
        peso_tabela: "",
        peso_escore_z: "",
        classificacao_peso: "",
        estatura_tabela: "",
        estatura_escore_z: "",
        classificacao_estatura: "",
        circunferencia_braco_tabela: "",
        circunferencia_braco_escore_z: "",
        circunferencia_braco_classificacao: "",
        circunferencia_cintura_tabela: "",
        circunferencia_cintura_escore_z: "",
        circunferencia_cintura_classificacao: "",
        dobra_tricipal_tabela: "",
        dobra_tricipal_escore_z: "",
        dobra_tricipal_classificacao: "",
        gordura_corporal_bioimpedância_porcentagem_valor: "",
        gordura_corporal_bioimpedância_porcentagem_diagnostico: "",
        gordura_corporal_bioimpedância_kg_valor: "",
        gordura_corporal_bioimpedância_kg_diagnostico: "",
        massa_magra_bioimpedância_kg_valor: "",
        massa_magra_bioimpedância_kg_diagnostico: "",
        massa_magra_bioimpedância_porcentagem_valor: "",
        massa_magra_bioimpedância_porcentagem_diagnostico: "",
        agua_corporal_bioimpedância_litros_valor: "",
        agua_corporal_bioimpedância_litros_diagnostico: "",
        agua_corporal_bioimpedância_porcentagem_valor: "",
        agua_corporal_bioimpedância_porcentagem_diagnostico: "",
        agua_na_massa_magra_porcentagem_valor: "",
        agua_na_massa_magra_porcentagem_diagnostico: "",
        resistencia_r_ohms_valor: "",
        resistencia_r_ohms_diagnostico: "",
        reatancia_xc_ohms_valor: "",
        reatancia_xc_ohms_diagnostico: "",
        observacoes: "",
      });

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar avaliação.");
    }

    
  };

  useEffect(() => {
    if (!formData.gordura_corporal_bioimpedância_porcentagem_valor || formData.gordura_corporal_bioimpedância_porcentagem_valor === '') {
      setFormData(prev => ({...prev, gordura_corporal_bioimpedância_porcentagem_diagnostico: ""}));
      return;
    }
    const sexo = formData.sexo
    const valor = Number(formData.gordura_corporal_bioimpedância_porcentagem_valor)

    let diagnostico = ''

    if (sexo === 'Masculino') {
      diagnostico = valor >= 25 ? 'Obeso' : 'Não obeso'
    } else {
      diagnostico = valor >= 30 ? 'Obeso' : 'Não obeso'
    }

    setFormData(prev => ({...prev, gordura_corporal_bioimpedância_porcentagem_diagnostico: diagnostico}));
  }, [formData.gordura_corporal_bioimpedância_porcentagem_valor, formData.sexo]);

  useEffect(() => {
    if (!formData.dataNascimento || !formData.dataAvaliacao) {
      setFormData(prev => ({...prev, idade: ""}));
      return;
    }
    const idadeCalculada = pegaIdade(formData.dataNascimento, formData.dataAvaliacao);
    setFormData(prev => ({...prev, idade: idadeCalculada.toString()}));
  }, [formData.dataNascimento, formData.dataAvaliacao]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nomeContainerRef.current &&
        !nomeContainerRef.current.contains(event.target as Node)
      ) {
        setPacientes([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <div className="flex flex-col min-h-screen bg-white font-sans p-6 text-gray-800">
      <div className={`max-w-4xl mx-auto w-full p-8 rounded-lg shadow-xl border-2 transition-colors duration-300 ${getStatusContainerClasses(status)}`}>
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Avaliação Antropométrica</h1>
        <StatusToggle 
          value={status} 
          onChange={setStatus} 
          somenteLeitura={somenteLeitura} 
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

        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientBasicInfo 
              patientData={{
                ...formData.patientInfo,
                id: Number(formData.patientInfo.id) || undefined,
              }}
              onChange={handlePatientInfoChange} 
              somenteLeitura={somenteLeitura}
            />
            <section className="p-4 space-y-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-900">Medidas Antropométricas</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Circunferência do Braço (cm)</label>
                  <Input
                    type="text"
                    step="0.1"
                    placeholder="Digite a medida"
                    name="circunferencia_braco"
                    value={formData.circunferencia_braco}
                    onChange={handleChange}
                    readOnly={somenteLeitura}

                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Circunferência da Cintura (cm)</label>
                  <Input
                    type="text"
                    step="0.1"
                    placeholder="Digite a medida"
                    name="circunferencia_cintura"
                    value={formData.circunferencia_cintura}
                    onChange={handleChange}
                    readOnly={somenteLeitura}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Dobra Tricipital (mm)</label>
                  <Input
                    type="text"
                    step="0.1"
                    placeholder="Digite a medida"
                    name="dobra_tricipal"
                    value={formData.dobra_tricipal}
                    onChange={handleChange}
                    readOnly={somenteLeitura}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={handleCalculate}>
                  Calcular
                </Button>
              </div>
            </section>

            <section className="p-4 space-y-4">
              <div className="mt-4 overflow-x-auto rounded-md border border-gray-600">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Medida</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Valor escore-z</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Circunferência da Cintura (cm)</TableCell>
                      <TableCell><Input type="text" readOnly  value={formData.circunferencia_cintura_tabela} /></TableCell>
                      <TableCell><Input type="text"  readOnly value={formData.circunferencia_cintura_escore_z}/></TableCell>
                      <TableCell><Input type="text"  readOnly value={formData.circunferencia_cintura_classificacao}/></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Circunferência do Braço (cm)</TableCell>
                      <TableCell><Input type="text" readOnly value={formData.circunferencia_braco_tabela}/></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.circunferencia_braco_escore_z}/></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.circunferencia_braco_classificacao} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dobra Tricipital (mm)</TableCell>
                      <TableCell><Input type="text"  readOnly value={formData.dobra_tricipal_tabela} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.dobra_tricipal_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.dobra_tricipal_classificacao}/></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>IMC (kg/m²)</TableCell>
                      <TableCell><Input type="text" readOnly value={formData.imc} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.imc_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.classificacao_imc} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Peso (kg)</TableCell>
                      <TableCell><Input type="text" readOnly value={formData.peso_tabela} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.peso_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.classificacao_peso} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Estatura</TableCell>
                      <TableCell><Input type="text" readOnly value={formData.estatura_tabela} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.estatura_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.classificacao_estatura} /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-4">
              <h2 className="text-2xl font-bold text-blue-900">Bioimpedância</h2>
              <div className="mt-4 overflow-x-auto rounded-md border border-gray-600">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Medida</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>% gordura corporal bioimpedância (%)</TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_porcentagem_valor" value={formData.gordura_corporal_bioimpedância_porcentagem_valor} onChange={handleChange} readOnly={somenteLeitura} /></TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_porcentagem_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gordura corporal bioimpedância (kg)</TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_kg_valor" value={formData.gordura_corporal_bioimpedância_kg_valor} onChange={handleChange}readOnly={somenteLeitura} /></TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_kg_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Massa magra bioimpedância (kg)</TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_kg_valor" value={formData.massa_magra_bioimpedância_kg_valor} onChange={handleChange} readOnly={somenteLeitura} /></TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_kg_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% massa magra bioimpedância (%)</TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_porcentagem_valor" value={formData.massa_magra_bioimpedância_porcentagem_valor} onChange={handleChange} readOnly={somenteLeitura}/></TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_porcentagem_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Água corporal bioimpedância (litros)</TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_litros_valor" value={formData.agua_corporal_bioimpedância_litros_valor} onChange={handleChange}readOnly={somenteLeitura} /></TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_litros_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% água corporal bioimpedância (%)</TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_porcentagem_valor" value={formData.agua_corporal_bioimpedância_porcentagem_valor} onChange={handleChange}readOnly={somenteLeitura} /></TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_porcentagem_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% água na massa magra (%)</TableCell>
                      <TableCell><Input type="text" name="agua_na_massa_magra_porcentagem_valor" value={formData.agua_na_massa_magra_porcentagem_valor} onChange={handleChange} readOnly={somenteLeitura}/></TableCell>
                      <TableCell><Input type="text" name="agua_na_massa_magra_porcentagem_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Resistência (R) (Ohms)</TableCell>
                      <TableCell><Input type="text" name="resistencia_r_ohms_valor" value={formData.resistencia_r_ohms_valor} onChange={handleChange}readOnly={somenteLeitura} /></TableCell>
                      <TableCell><Input type="text" name="resistencia_r_ohms_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Reatância (Xc) (Ohms)</TableCell>
                      <TableCell><Input type="text" name="reatancia_xc_ohms_valor" value={formData.reatancia_xc_ohms_valor} onChange={handleChange} readOnly={somenteLeitura}/></TableCell>
                      <TableCell><Input type="text" name="reatancia_xc_ohms_diagnostico" readOnly={somenteLeitura} onChange={handleChange} /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-4">
              <h2 className="text-2xl font-bold text-blue-900">Observações</h2>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                <textarea
                  className="p-3.5 focus:ring-4 focus:ring-blue-300 min-h-[120px] w-full border border-gray-600 rounded-md shadow-sm"
                  placeholder="Digite observações adicionais sobre a avaliação antropométrica"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  readOnly={somenteLeitura}
                ></textarea>
              </div>

              <div className="p-4 mt-8">
                <h2 className="text-2xl font-bold text-blue-900">Anexo de exames complementares</h2>

                {somenteLeitura ? (
                  <ListaAnexos attachments={attachments} />
                ) : (
                  <FileInput
                    ref={fileInputRef}
                    name="anexar"
                    multiple
                  />
                )}
              </div>
              
            </section>

            {!somenteLeitura && (
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105">
                  Salvar Avaliação
                </button>
              </div>
            )}

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent>
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    As informações foram salvas com sucesso.
                  </p>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 mt-4"
                    onClick={() => setShowSuccessDialog(false)}>
                    Fechar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </form> 
        </CardContent> 
      </div> 
    </div> 
  ); 
}
