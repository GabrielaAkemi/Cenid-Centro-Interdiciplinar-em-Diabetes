"use client";

import React from "react";
import Image from "next/image";
import LayoutSidebar from "@/components/LayoutSidebar"; // Sidebar
import PacienteForm from "@/components/Forms/paciente-forms";

const CadastroPacientePage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <LayoutSidebar />

      <div className="flex-1 container mx-auto py-8 relative">


        <div className="bg-white border border-blue-200 p-6 rounded-md shadow-md">
          <PacienteForm />
        </div>
      </div>

        <div className="flex justify-end mt-auto">
          <Image
            src="/logoCenid.png"
            alt="LOGOCENID"
            width={150}
            height={200}
            className="opacity-70"
          />
        </div>
    </div>
  );
};

export default CadastroPacientePage;
