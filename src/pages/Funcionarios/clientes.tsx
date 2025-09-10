"use client";

import React, { useState, useEffect } from "react";
import DashboardContent from "@/components/DashboardContent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => { fetchClients(); }, []);

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
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Clientes</h1>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white">Novo Cliente</Button>
      </div>

      <Input
        placeholder="Buscar cliente por nome, CPF ou email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Clientes Cadastrados</CardTitle>
          <CardDescription>Lista geral de clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-300 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map(client => (
                    <TableRow key={client.id} className="hover:bg-blue-50 cursor-pointer">
                      <TableCell>{client.nome}</TableCell>
                      <TableCell>{client.cpf}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.telefone}</TableCell>
                      <TableCell>{formatDateSafely(client.dataCadastro)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">Nenhum cliente encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Logo fixa no canto inferior direito da tela */}
      <div className="fixed bottom-4 right-4 z-50">
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
