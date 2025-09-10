"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Patient {
  nome: string;
  cpf: string;
  cartaoSus?: string;
  rg?: string;
  telefone?: string;
  dataNascimento: string;
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
  tipoDeficiencia?: string;
  metodoInsulina?: string;
  marcaModeloBomba?: string;
  metodoMonitoramentoGlicemia?: string;
  marcaModeloGlicometroSensor?: string;
  usoAppGlicemia?: string;
  outrosApps?: string;
  nomeResponsavel?: string;
  cpfResponsavel?: string;
  telefoneResponsavel?: string;
  dataNascimentoResponsavel?: string;
  possuiCelularComAcessoInternet?: string;
  dataCadastro: string;
}

const patient: Patient = {
  nome: "Gabss Akemi",
  cpf: "123.456.789-00",
  cartaoSus: "987654321",
  rg: "12.345.678-9",
  telefone: "(14) 99999-9999",
  dataNascimento: "2006-03-12",
  email: "gabss@example.com",
  ocupacao: "Estudante",
  sexo: "Feminino",
  endereco: "Rua das Flores",
  numero: "123",
  municipio: "Garça",
  diagnostico: "Diabetes Tipo 1",
  gestante: "Não",
  semanasGestacao: 0,
  amamentando: "Não",
  tempoPosParto: "",
  deficiencia: "Não",
  tipoDeficiencia: "",
  metodoInsulina: "Caneta",
  marcaModeloBomba: "",
  metodoMonitoramentoGlicemia: "Glicometro",
  marcaModeloGlicometroSensor: "Accu-Chek",
  usoAppGlicemia: "Sim",
  outrosApps: "MySugr",
  nomeResponsavel: "Maria Akemi",
  cpfResponsavel: "111.222.333-44",
  telefoneResponsavel: "(14) 98888-8888",
  dataNascimentoResponsavel: "1980-05-10",
  possuiCelularComAcessoInternet: "Sim",
  dataCadastro: "2025-08-01",
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

  const infoItems = [
    { icon: User, label: "Nome", value: patient.nome },
    { icon: FileText, label: "CPF", value: patient.cpf },
    { icon: FileText, label: "Cartão SUS", value: patient.cartaoSus },
    { icon: FileText, label: "RG", value: patient.rg },
    { icon: Calendar, label: "Data de Nascimento", value: formatDateSafely(patient.dataNascimento) },
    { icon: Mail, label: "Email", value: patient.email },
    { icon: Phone, label: "Telefone", value: patient.telefone },
    { icon: User, label: "Sexo", value: patient.sexo },
    { icon: Home, label: "Endereço", value: `${patient.endereco}, ${patient.numero}, ${patient.municipio}` },
    { icon: User, label: "Ocupação", value: patient.ocupacao },
    { icon: Stethoscope, label: "Diagnóstico", value: patient.diagnostico },
    { icon: Baby, label: "Gestante", value: patient.gestante },
    { icon: Baby, label: "Amamentando", value: patient.amamentando },
    { icon: Accessibility, label: "Deficiência", value: patient.deficiencia },
    { icon: Syringe, label: "Método de Insulina", value: patient.metodoInsulina },
    { icon: Smartphone, label: "Monitoramento Glicemia", value: patient.metodoMonitoramentoGlicemia },
    { icon: Smartphone, label: "Uso de App", value: patient.usoAppGlicemia },
    { icon: User, label: "Responsável", value: patient.nomeResponsavel },
    { icon: FileText, label: "CPF do Responsável", value: patient.cpfResponsavel },
    { icon: Phone, label: "Telefone do Responsável", value: patient.telefoneResponsavel },
    { icon: Calendar, label: "Data de Cadastro", value: formatDateSafely(patient.dataCadastro) },
    { icon: Smartphone, label: "Acesso à Internet", value: patient.possuiCelularComAcessoInternet },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-900">
          Detalhes do Paciente
        </h1>
        <div className="flex gap-2">
            <Button
            onClick={() => router.push("/Funcionarios/consultas")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            >
            Iniciar Consulta
            </Button>
            <Button
            onClick={() => router.push("/consultas/historico")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Histórico
          </Button>
          <Button
            onClick={() => router.push("/Funcionarios/dashboard")}
            className="bg-gray-300 hover:bg-gray-400 text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <Card className="bg-white border border-blue-300 shadow-lg">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">{patient.nome}</CardTitle>
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
    </div>
  );
};

export default PatientDetails;
