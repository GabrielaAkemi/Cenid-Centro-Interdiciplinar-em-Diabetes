"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DashboardContent from "@/components/DashboardContent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Client {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataCadastro: string;
}

const formatDateSafely = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  try { return new Date(dateString).toLocaleDateString("pt-BR"); }
  catch { return "Data inválida"; }
};

const ClientesPage: React.FC = () => {
  const router = useRouter();

  const [clients] = useState<Client[]>([
    { id: "1", nome: "Gabriela Akemi", cpf: "123.456.789-00", email: "gabriela@email.com", telefone: "11999999999", dataCadastro: "2025-09-10" },
    { id: "2", nome: "Maria Silva", cpf: "987.654.321-00", email: "maria@email.com", telefone: "11988888888", dataCadastro: "2025-09-09" },
    { id: "3", nome: "João Santos", cpf: "111.222.333-44", email: "joao@email.com", telefone: "11977777777", dataCadastro: "2025-09-08" },
  ]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClients = clients.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <DashboardContent>
      {/* Cabeçalho com título e botão */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Clientes</h1>

        <button
          onClick={() => router.push("/pacientes/newpacient")}
          id="back-button"
          className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
        >
          Novo Paciente
        </button>
      </div>

      {/* Input de busca */}
      <Input
        placeholder="Buscar cliente por nome, CPF ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 text-black border-black"
      />

      {/* Card com tabela */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-black">Clientes Cadastrados</CardTitle>
          <CardDescription>Lista geral de clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-300 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="text-black">Nome</TableHead>
                  <TableHead className="text-black">CPF</TableHead>
                  <TableHead className="text-black">Email</TableHead>
                  <TableHead className="text-black">Telefone</TableHead>
                  <TableHead className="text-black">Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map(client => (
                    <TableRow key={client.id} className="hover:bg-blue-200 cursor-pointer">
                      <TableCell className="text-black font-medium">{client.nome}</TableCell>
                      <TableCell className="text-black">{client.cpf}</TableCell>
                      <TableCell className="text-black">{client.email}</TableCell>
                      <TableCell className="text-black">{client.telefone}</TableCell>
                      <TableCell className="text-black">{formatDateSafely(client.dataCadastro)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-black">Nenhum cliente encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Logo fixa no canto inferior direito */}
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

export default ClientesPage;
