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
    { icon: User, label: "Sexo", value: paciente.sexo },
    { icon: Home, label: "Endereço", value: `${paciente.endereco}, ${paciente.numero}, ${paciente.municipio}` },
    { icon: User, label: "Ocupação", value: paciente.ocupacao },
    { icon: Stethoscope, label: "Diagnóstico", value: paciente.diagnostico },
    { icon: Baby, label: "Gestante", value: paciente.gestante },
    { icon: Baby, label: "Amamentando", value: paciente.amamentando },
    { icon: Accessibility, label: "Deficiência", value: paciente.deficiencia },
    { icon: Syringe, label: "Método de Insulina", value: paciente.metodo_insulina },
    { icon: Smartphone, label: "Monitoramento Glicemia", value: paciente.metodo_monitoramento },
    { icon: Smartphone, label: "Uso de App", value: paciente.app_glicemia },
    { icon: User, label: "Responsável", value: paciente.nome_responsavel },
    { icon: FileText, label: "CPF do Responsável", value: paciente.cpf_responsavel },
    { icon: Phone, label: "Telefone do Responsável", value: paciente.telefone_responsavel },
    { icon: Calendar, label: "Data de Cadastro", value: formatDateSafely(paciente.data_cadastro) },
    { icon: Smartphone, label: "Acesso à Internet", value: paciente.celular_com_internet },
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
              onClick={() => router.push("/consultas/historico")}
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

        <div className="fixed bottom-4 right-4 z-50">
          <Image
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
