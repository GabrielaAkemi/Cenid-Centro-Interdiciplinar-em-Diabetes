"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PacienteForm from "@/components/Forms/paciente-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NewPacientPage = () => {
  const router = useRouter();

  const handlePacienteSubmit = async (data: any) => {
    try {
      console.log("Dados do paciente enviados:", data);
      router.push("/pacientes");
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-50">
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-4xl mx-auto border border-blue-200 shadow-md bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900">
              Cadastrar Novo Paciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PacienteForm onSubmit={handlePacienteSubmit} />
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
        <Button
            onClick={() => router.push("/Funcionarios/dashboard")}
            className="border border-blue-900 text-blue-900 hover:bg-blue-100"
        >
            Voltar para Dashboard
        </Button>
        </div>

      </div>

      {/* Logo no canto inferior direito */}
      <div className="absolute bottom-4 right-4 z-20">
        <Image
          src="/logoCenid.png"
          alt="Logo Cenid"
          width={150}
          height={150}
          className="opacity-70"
        />
      </div>
    </div>
  );
};

export default NewPacientPage;
