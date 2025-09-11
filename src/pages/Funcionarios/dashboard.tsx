"use client";

import { useState, useEffect } from "react";
import DashboardContent from "@/components/DashboardContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, PieChart, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  diagnostico: string;
  telefone: string;
  email: string;
  dateCadastro: string;
}

interface StatCardProps {
  title: string | number;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

const formatDateSafely = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  try { return new Date(dateString).toLocaleDateString("pt-BR"); }
  catch { return "Data inválida"; }
};

const StatCard = ({ title, value, description, icon, className }: StatCardProps) => (
  <Card className={`${className}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-blue-900">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-blue-900">{value}</div>
      {description && <p className="text-xs text-blue-900 mt-1">{description}</p>}
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterDiagnostico, setFilterDiagnostico] = useState("todos");
  const [patients, setPatients] = useState<Patient[]>([]);

  const fetchPatients = async () => {
    const res = await fetch("/api/patients");
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => { fetchPatients(); }, []);

  const diagnosticCounts = patients.reduce(
    (acc, p) => {
      if (p.diagnostico === "DM1") acc.DM1++;
      else if (p.diagnostico === "DM2") acc.DM2++;
      else if (p.diagnostico === "LADA") acc.LADA++;
      return acc;
    },
    { DM1: 0, DM2: 0, LADA: 0 }
  );

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf?.includes(search) ||
      p.email?.toLowerCase().includes(search.toLowerCase());

    const matchesDiagnostico =
      filterDiagnostico === "todos" || p.diagnostico === filterDiagnostico;

    return matchesSearch && matchesDiagnostico;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

  const navigateToPatientDetails = (id: string) => {
    router.push(`/pacientes/${id}`);
  };

  return (
    <DashboardContent>
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-900">Dashboard</h1>
            <p className="text-blue-900">Gerencie os pacientes cadastrados no sistema</p>
          </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => router.push("/pacientes/newpacient")}
                    variant="default"id="back-button"
                        class="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors">
                    Novo Paciente
                </button>
                <button 
                  onClick={() => router.push("/pacientes")}
                  className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
                >
                  Pacientes
                </button>
            </div>

        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total de Pacientes" value={patients.length} description="Pacientes cadastrados" icon={<UserPlus className="h-4 w-4 text-blue-900" />} />
          <StatCard title="DM1" value={diagnosticCounts.DM1} description="Pacientes com DM1" icon={<PieChart className="h-4 w-4 text-blue-900" />} className="border-l-4 border-red-600" />
          <StatCard title="DM2" value={diagnosticCounts.DM2} description="Pacientes com DM2" icon={<PieChart className="h-4 w-4 text-blue-900" />} className="border-l-4 border-red-400" />
          <StatCard title="LADA" value={diagnosticCounts.LADA} description="Pacientes com LADA" icon={<PieChart className="h-4 w-4 text-blue-900" />} className="border-l-4 border-blue-400" />
        </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <button
              onClick={() => router.push("/relatorios/new")}
              className="flex flex-col items-center justify-center p-4 bg-white border-l-4 border-blue-600 hover:border-blue-300 hover:bg-blue-200 text-black font-medium transition-colors duration-300"
            >
              <PieChart className="h-6 w-6 mb-1 text-blue-600 hover:text-blue-300 transition-colors duration-300" />
              <span className="text-black hover:text-blue-300 transition-colors duration-300">Novo Relatório</span>
            </button>

            <button
              onClick={() => router.push("/agendamentos")}
              className="flex flex-col items-center justify-center p-4 bg-white border-l-4 border-red-500 hover:border-blue-300 hover:bg-blue-200 text-black font-medium transition-colors duration-300"
            >
              <PieChart className="h-6 w-6 mb-1 text-red-500 hover:text-blue-300 transition-colors duration-300" />
              <span className="text-black hover:text-blue-300 transition-colors duration-300">Agendamentos</span>
            </button>

            <button
              onClick={() => router.push("/monitoramento")}
              className="flex flex-col items-center justify-center p-4 bg-white border-l-4 border-teal-400 hover:border-blue-300 hover:bg-blue-200 text-black font-medium transition-colors duration-300"
            >
              <PieChart className="h-6 w-6 mb-1 text-teal-400 hover:text-blue-300 transition-colors duration-300" />
              <span className="text-black hover:text-blue-300 transition-colors duration-300">Monitoramento</span>
            </button>

            <button
              onClick={() => router.push("/estatisticas")}
              className="flex flex-col items-center justify-center p-4 bg-white border-l-4 border-red-400 hover:border-blue-300 hover:bg-blue-200 text-black font-medium transition-colors duration-300"
            >
              <PieChart className="h-6 w-6 mb-1 text-red-400 hover:text-blue-300 transition-colors duration-300" />
              <span className="text-black hover:text-blue-300 transition-colors duration-300">Estatísticas</span>
            </button>
          </div>


        {/* Lista de pacientes */}
        <Card className="bg-blue-50 border-blue-200 mt-6">
          <CardHeader>
            <CardTitle className="text-blue-900 font-bold">Pacientes Cadastrados</CardTitle>
            <CardDescription className="text-blue-900">Lista de todos os pacientes cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-900" />
                <Input
                  placeholder="Buscar paciente por nome, CPF ou email..."
                  className="pl-8 text-blue-900 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={filterDiagnostico} onValueChange={setFilterDiagnostico} className="w-full md:w-[180px]">
                <SelectItem value="todos">Todos os diagnósticos</SelectItem>
                <SelectItem value="DM1">DM1</SelectItem>
                <SelectItem value="DM2">DM2</SelectItem>
                <SelectItem value="LADA">LADA</SelectItem>
              </Select>
            </div>

            <div className="rounded-md border border-blue-300 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="text-blue-900 font-bold">Nome</TableHead>
                    <TableHead className="text-blue-900 font-bold">CPF</TableHead>
                    <TableHead className="text-blue-900 font-bold">Data de Nascimento</TableHead>
                    <TableHead className="text-blue-900 font-bold">Diagnóstico</TableHead>
                    <TableHead className="text-blue-900 font-bold">Contato</TableHead>
                    <TableHead className="text-blue-900 font-bold">Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((patient) => (
                      <TableRow
                        key={patient.id}
                        className="cursor-pointer hover:bg-blue-50 text-blue-900"
                        onClick={() => navigateToPatientDetails(patient.id)}
                      >
                        <TableCell className="font-medium">{patient.nome}</TableCell>
                        <TableCell>{patient.cpf}</TableCell>
                        <TableCell>{formatDateSafely(patient.dataNascimento)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                            ${patient.diagnostico === "DM1"
                              ? "bg-red-600 text-white"
                              : patient.diagnostico === "DM2"
                              ? "bg-red-400 text-white"
                              : "bg-blue-300 text-blue-900"
                            }`}
                          >
                            {patient.diagnostico}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>{patient.telefone}</div>
                          <div className="text-sm text-blue-900">{patient.email}</div>
                        </TableCell>
                        <TableCell>{formatDateSafely(patient.dateCadastro)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-blue-900">
                        Nenhum paciente encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
              {/* Logo como footer visual */}
      <div className="w-full flex justify-end mt-8">
        <Image
          src="/logoCenid.png"
          alt="LOGOCENID"
          width={200}
          height={200}
          className="opacity-70"
        />
      </div>
    </DashboardContent>
    
  );
};

export default DashboardPage;
