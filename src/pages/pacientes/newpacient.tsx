"use client";

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
        <div className="flex justify-center mb-8">
          <Card className="w-full max-w-4xl shadow-lg border border-blue-200">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-2xl text-blue-900 text-center">
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Formulário */}
              <PacienteForm onSubmit={handlePacienteSubmit} />
            </CardContent>
          </Card>
        </div>

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
          width={250}
          height={150}
          className="opacity-70"
        />
      </div>
    </div>
  );
};

export default NewPacientPage;
