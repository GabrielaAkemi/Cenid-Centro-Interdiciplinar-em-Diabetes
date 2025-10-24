"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import { useRouter, useParams  } from "next/navigation"; // <- corrigi aqui, estava "next/router"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  Home,
  Stethoscope,
  Baby,
  Accessibility,
  Syringe,
  Smartphone,
} from "lucide-react";
import { format } from "date-fns";
import DashboardContent from "@/components/DashboardContent"; // <- adicionado para sidebar/layout
import { apiFetch } from "@/lib/api"

interface Patient {
  nome: string;
  cpf: string;
  cartao_sus?: string;
  rg?: string;
  telefone?: string;
  data_nascimento: string;
  email: string;
  ocupacao?: string;
  sexo?: string;
  endereco?: string;
  numero?: string;
  municipio?: string;
  diagnostico: string;
  gestante?: string;
  semanasGestacao?: number;
  amamentando?: string;
  tempoPosParto?: string;
  deficiencia?: string;
  metodo_insulina?: string;
  metodo_monitoramento?: string;
  marca_sensor?: string;
  app_glicemia?: string;
  nome_responsavel?: string;
  cpf_responsavel?: string;
  telefone_responsavel?: string;
  data_nascimento_responsavel?: string;
  celular_com_internet?: string;
  data_cadastro: string;
}

const TipoAtendimentoMap: Record<number, string> = {
  0: "Sistema Único de Saúde (SUS)",
  1: "Convênio/Plano de Saúde",
  2: "Particular",
  3: "Misto (SUS + outros)",
};

const DiagnosticoMap: Record<number, string> = {
  0: "DM1",
  1: "DM2",
  2: "LADA",
  3: "MODY",
  4: "Gestacional",
  5: "Outro",
};

const DeficienciaMap: Record<number, string> = {
  0: "Física",
  1: "Visual",
  2: "Auditiva",
  3: "Intelectual",
  4: "Múltipla",
  5: "Outro",
};

const MetodoInsulinaMap: Record<number, string> = {
  1: "Caneta de Insulina",
  2: "Seringa",
  3: "Bomba de Insulina",
  4: "Não utiliza",
};

const MetodoMonitoramentoMap: Record<number, string> = {
  1: "Glicômetro Tradicional",
  2: "Sensor Flash",
  3: "Sensor Contínuo",
  4: "Múltiplos Métodos",
};


const AppGlicemiaMap: Record<number, string> = {
  1: "LibreLink",
  2: "Dexcom",
  3: "Medtronic",
  4: "Accu-Chek",
  5: "OneTouch",
  6: "GlicoSource",
  7: "Outro",
  8: "Não utiliza",
};

const getLabel = (map: Record<number, string>, value?: number | string) => {
  if (value === undefined || value === null) return "-";
  if (typeof value === "number") return map[value] || "Outro";
  return value;
};

const formatDateSafely = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd/MM/yyyy");
  } catch {
    return "Data inválida";
  }
};

const PatientDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [paciente, setPaciente] = useState<any>(null);

  const fetchPaciente = async () => {
    const data = await apiFetch(`/api/pacientes/${id}/`, true)
    setPaciente(data)
  }

  useEffect(() => {
    if (!id) return;
    
    fetchPaciente();
  }, [id])


  const infoItems = paciente ? [
    { icon: User, label: "Nome", value: paciente.nome },
    { icon: FileText, label: "CPF", value: paciente.cpf },
    { icon: FileText, label: "Cartão SUS", value: paciente.cartao_sus },
    { icon: FileText, label: "RG", value: paciente.rg },
    { icon: Calendar, label: "Data de Nascimento", value: formatDateSafely(paciente.data_nascimento) },
    { icon: Mail, label: "Email", value: paciente.email },
    { icon: Phone, label: "Telefone", value: paciente.telefone },
    { icon: User, label: "Sexo", value: paciente.sexo == "M" ? "Masculino": "Feminino" },
    { icon: Home, label: "Endereço", value: paciente.endereco && paciente.numero && paciente.municipio ? `${paciente.endereco}, ${paciente.numero}, ${paciente.municipio}` : "-" },
    { icon: User, label: "Ocupação", value: paciente.ocupacao },
    { icon: Stethoscope, label: "Diagnóstico", value: getLabel(DiagnosticoMap, paciente.diagnostico) },
    { icon: Baby, label: "Gestante", value: paciente.gestante ? "Sim" : "Não" },
    { icon: Baby, label: "Amamentando", value: paciente.amamentando ? "Sim" : "Não" },
    { icon: Accessibility, label: "Deficiência", value: getLabel(DeficienciaMap, paciente.deficiencia) },
    { icon: Syringe, label: "Método de Insulina", value: getLabel(MetodoInsulinaMap, paciente.metodo_insulina) },
    { icon: Smartphone, label: "Monitoramento Glicemia", value: getLabel(MetodoMonitoramentoMap, paciente.metodo_monitoramento) },
    { icon: Smartphone, label: "Uso de App", value: getLabel(AppGlicemiaMap, paciente.app_glicemia) },
    { icon: User, label: "Responsável", value: paciente.nome_responsavel ? paciente.nome_responsavel : "-" },
    { icon: FileText, label: "CPF do Responsável", value: paciente.cpf_responsavel ? paciente.cpf_responsavel : "-" },
    { icon: Phone, label: "Telefone do Responsável", value: paciente.telefone_responsavel ? paciente.telefone_responsavel : "-" },
    { icon: Calendar, label: "Data de Cadastro", value: paciente.data_cadastro ? formatDateSafely(paciente.data_cadastro) : "-" },
    { icon: Smartphone, label: "Acesso à Internet", value: paciente.celular_com_internet ? "Sim" : "Não" },
  ] : [];

  if (!paciente) {
    return (
      <DashboardContent>
        <div className="container mx-auto py-6">
          <p>Carregando paciente...</p>
        </div>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-900">
            Detalhes do Paciente
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/pacientes/${id}/consultas`)}
              className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
            >
              Iniciar Consulta
            </button>
            <button
              onClick={() => router.push(`/pacientes/${id}/historico`)}
              className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
            >
              Histórico
            </button>
            <button
              onClick={() => router.push("/Funcionarios/dashboard")}
              className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </button>
          </div>
        </div>

        

        {/* Card com informações */}
        <Card className="bg-white border border-blue-300 shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">{paciente.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center bg-blue-50 p-3 rounded shadow-sm">
                    <Icon className="h-5 w-5 text-blue-700 mr-2" />
                    <div>
                      <p className="text-sm text-red-600">{item.label}</p>
                      <p className="font-medium text-blue-900">{item.value || "N/A"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-8">
            <img
                src="/logoCenid.png"
                alt="LOGOCENID"
                width={150} 
                height={200}
                className="opacity-70"
            />
        </div>
      </div>
    </DashboardContent>
  );
};

export default PatientDetails;
