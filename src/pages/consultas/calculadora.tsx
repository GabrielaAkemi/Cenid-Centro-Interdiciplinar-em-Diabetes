"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

// importa o formulário de Antropometria
import AntropometriaForm from "@/components/Forms/antropometria-forms";

const CalculadoraPage = () => {
  const router = useRouter();

  const handleAntropometriaSubmit = async (data: any) => {
    try {
      console.log("Dados de Antropometria enviados:", data);
      router.push("/consultas"); // depois de salvar volta para consultas
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-blue-50">
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-4xl mx-auto border border-blue-200 shadow-md bg-white">
          <CardContent>
            {/* O onSubmit agora chama a função que usa o router */}
            <AntropometriaForm onSubmit={handleAntropometriaSubmit} />
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/Funcionarios/consultas")}
            id="back-button"
            className="bg-blue-900 text-white border border-blue-900 hover:bg-blue-800 font-semibold py-2 px-6 rounded-md shadow-md transition-colors"
          >
            Voltar para Consultas
          </button>
        </div>
      </div>

      {/* Logo no canto inferior direito */}
      <div className="absolute bottom-4 right-4 z-20">
        <Image
          src="/logoCenid.png"
          alt="Logo Cenid"
          width={200}
          height={200}
          className="opacity-70"
        />
      </div>
    </div>
  );
};

export default CalculadoraPage;
