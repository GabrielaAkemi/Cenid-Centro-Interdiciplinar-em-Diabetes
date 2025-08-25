"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// ================= CONSTANTES =================
const TIPO_ATENDIMENTO_OPTIONS = [
  { value: "SUS", label: "Sistema Único de Saúde (SUS)" },
  { value: "CONVENIO", label: "Convênio/Plano de Saúde" },
  { value: "PARTICULAR", label: "Particular" },
  { value: "MISTO", label: "Misto (SUS + outros)" },
];

const DIAGNOSTICO_OPTIONS = [
  { value: "DM1", label: "Diabetes Mellitus Tipo 1 (DM1)" },
  { value: "DM2", label: "Diabetes Mellitus Tipo 2 (DM2)" },
  { value: "LADA", label: "Diabetes Autoimune Latente do Adulto (LADA)" },
  { value: "MODY", label: "Maturity Onset Diabetes of the Young (MODY)" },
  { value: "GESTACIONAL", label: "Diabetes Gestacional" },
  { value: "OUTRO", label: "Outro" },
];

const TIPO_DEFICIENCIA_OPTIONS = [
  { value: "FISICA", label: "Física" },
  { value: "VISUAL", label: "Visual" },
  { value: "AUDITIVA", label: "Auditiva" },
  { value: "INTELECTUAL", label: "Intelectual" },
  { value: "MULTIPLA", label: "Múltipla" },
  { value: "OUTRO", label: "Outro" },
];

const METODO_INSULINA_OPTIONS = [
  { value: "CANETA", label: "Caneta de Insulina" },
  { value: "SERINGA", label: "Seringa" },
  { value: "BOMBA", label: "Bomba de Insulina" },
  { value: "NAO_USA", label: "Não utiliza insulina" },
];

const METODO_MONITORAMENTO_OPTIONS = [
  { value: "GLICOMETRO", label: "Glicômetro Tradicional" },
  { value: "FGM", label: "Sensor Flash (FGM)" },
  { value: "CGM", label: "Sensor Contínuo (CGM)" },
  { value: "MULTIPLOS", label: "Múltiplos métodos" },
];

const MARCA_SENSOR_OPTIONS = [
  { value: "FREESTYLE", label: "FreeStyle Libre" },
  { value: "FREESTYLE2", label: "FreeStyle Libre 2" },
  { value: "DEXCOMG6", label: "Dexcom G6" },
  { value: "DEXCOMG7", label: "Dexcom G7" },
  { value: "MEDTRONIC", label: "Medtronic Guardian" },
  { value: "ACCUCHEK_ACTIVE", label: "Accu-Chek Active" },
  { value: "ACCUCHEK_GUIDE", label: "Accu-Chek Guide" },
  { value: "ONETOUCH_SELECT", label: "One Touch Select Plus" },
  { value: "ONETOUCH_ULTRA", label: "One Touch Ultra" },
  { value: "CONTOUR", label: "Contour Ultra" },
  { value: "OUTRO", label: "Outro" },
];

const APP_GLICEMIA_OPTIONS = [
  { value: "LIBRELINK", label: "LibreLink" },
  { value: "DEXCOM", label: "Dexcom" },
  { value: "MEDTRONIC", label: "Medtronic" },
  { value: "ACCUCHEK", label: "Accu-Chek" },
  { value: "ONETOUCH", label: "One Touch" },
  { value: "GLICOSOURCE", label: "GlicoSource" },
  { value: "OUTRO", label: "Outro App" },
  { value: "NAO_USA", label: "Não utiliza App" },
];

const PARENTESCO_OPTIONS = [
  { value: "MAE", label: "Mãe" },
  { value: "PAI", label: "Pai" },
  { value: "IRMAO", label: "Irmão/Irmã" },
  { value: "AVO", label: "Avô/Avó" },
  { value: "TIO", label: "Tio/Tia" },
  { value: "PRIMO", label: "Primo/Prima" },
  { value: "OUTRO", label: "Outro" },
];

const AUXILIOS_OPTIONS = [
  { value: "BPC", label: "Benefício de Prestação Continuada (BPC)" },
  { value: "BOLSA_FAMILIA", label: "Bolsa Família" },
  { value: "AUXILIO_DOENCA", label: "Auxílio Doença" },
  { value: "APOSENTADORIA_INVALIDEZ", label: "Aposentadoria por Invalidez" },
  { value: "OUTRO", label: "Outro Auxílio" },
  { value: "NINGUEM", label: "Nenhum Auxílio" },
];

// ================= COMPONENTE =================
interface PacienteFormProps {
  onSubmit: (data: FormData) => void;
}

const PacienteForm: React.FC<PacienteFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<any>({
    // Dados pessoais
    nome: "", cpf: "", cartaoSUS: "", rg: "", telefone: "", email: "", dataNascimento: "", sexo: "", ocupacao: "",
    // Endereço
    cep: "", endereco: "", numero: "", bairro: "", municipio: "",
    // Dados clínicos
    tipoAtendimento: "", diagnostico: "", dataDiagnostico: "", gestante: false, amamentando: false, deficiencia: "",
    historicoFamiliar: { dm1: false, dm2: false, outros: "" },
    tratamento: { metodoInsulina: "", metodoMonitoramento: "", marcaSensor: "", appGlicemia: "" },
    responsavel: { nome: "", cpf: "", rg: "", parentesco: "", telefone: "", dataNascimento: "", ocupacao: "" },
    // Outras informações
    auxilio: "", celularInternet: false, dataCadastro: "", documento: null,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parent: string, key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "documento" && formData.documento) {
        dataToSend.append(key, formData.documento);
      } else if (typeof formData[key] === "object") {
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    await onSubmit(dataToSend);
  };

  return (
    <form className="space-y-6 text-blue-900" onSubmit={handleSubmit}>

      {/* === Dados Pessoais === */}
      <details open className="p-4 border rounded">
        <summary className="font-bold cursor-pointer">Dados Pessoais</summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Nome completo" value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} required />
          <Input placeholder="CPF" value={formData.cpf} onChange={(e) => handleChange("cpf", e.target.value)} required />
          <Input placeholder="Cartão SUS" value={formData.cartaoSUS} onChange={(e) => handleChange("cartaoSUS", e.target.value)} />
          <Input placeholder="RG" value={formData.rg} onChange={(e) => handleChange("rg", e.target.value)} />
          <Input placeholder="Telefone" value={formData.telefone} onChange={(e) => handleChange("telefone", e.target.value)} required />
          <Input placeholder="E-mail" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
          <Input type="date" placeholder="Data de Nascimento" value={formData.dataNascimento} onChange={(e) => handleChange("dataNascimento", e.target.value)} required />
          <Select value={formData.sexo} onValueChange={(val) => handleChange("sexo", val)}>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="F">Feminino</SelectItem>
            <SelectItem value="OUTRO">Outro</SelectItem>
          </Select>
          <Input placeholder="Ocupação" value={formData.ocupacao} onChange={(e) => handleChange("ocupacao", e.target.value)} />
        </div>
      </details>

      {/* === Endereço === */}
      <details className="p-4 border rounded">
        <summary className="font-bold cursor-pointer">Endereço</summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="CEP" value={formData.cep} onChange={(e) => handleChange("cep", e.target.value)} />
          <Input placeholder="Endereço" value={formData.endereco} onChange={(e) => handleChange("endereco", e.target.value)} />
          <Input placeholder="Número" value={formData.numero} onChange={(e) => handleChange("numero", e.target.value)} />
          <Input placeholder="Bairro" value={formData.bairro} onChange={(e) => handleChange("bairro", e.target.value)} />
          <Input placeholder="Município" value={formData.municipio} onChange={(e) => handleChange("municipio", e.target.value)} />
        </div>
      </details>

      {/* === Dados Clínicos e Tratamento === */}
      <details className="p-4 border rounded">
        <summary className="font-bold cursor-pointer">Dados Clínicos e Tratamento</summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={formData.tipoAtendimento} onValueChange={(val) => handleChange("tipoAtendimento", val)}>
            {TIPO_ATENDIMENTO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>

          <Select value={formData.diagnostico} onValueChange={(val) => handleChange("diagnostico", val)}>
            {DIAGNOSTICO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>

          <Input type="date" placeholder="Data do Diagnóstico" value={formData.dataDiagnostico} onChange={(e) => handleChange("dataDiagnostico", e.target.value)} />

          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.gestante} onChange={(e) => handleChange("gestante", e.target.checked)} /> Gestante</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.amamentando} onChange={(e) => handleChange("amamentando", e.target.checked)} /> Amamentando</label>
          </div>

          <Select value={formData.deficiencia} onValueChange={(val) => handleChange("deficiencia", val)}>
            {TIPO_DEFICIENCIA_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>

          {/* Histórico Familiar */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.historicoFamiliar.dm1} onChange={(e) => handleNestedChange("historicoFamiliar","dm1", e.target.checked)} /> Histórico DM1</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.historicoFamiliar.dm2} onChange={(e) => handleNestedChange("historicoFamiliar","dm2", e.target.checked)} /> Histórico DM2</label>
            <Input placeholder="Outros DM" value={formData.historicoFamiliar.outros} onChange={(e) => handleNestedChange("historicoFamiliar","outros", e.target.value)} />
          </div>

          {/* Tratamento */}
          <Select value={formData.tratamento.metodoInsulina} onValueChange={(val) => handleNestedChange("tratamento","metodoInsulina", val)}>
            {METODO_INSULINA_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>

          <Select value={formData.tratamento.metodoMonitoramento} onValueChange={(val) => handleNestedChange("tratamento","metodoMonitoramento", val)}>
            {METODO_MONITORAMENTO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>

          <Select value={formData.tratamento.marcaSensor} onValueChange={(val) => handleNestedChange("tratamento","marcaSensor", val)}>
            {MARCA_SENSOR_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>

          <Select value={formData.tratamento.appGlicemia} onValueChange={(val) => handleNestedChange("tratamento","appGlicemia", val)}>
            {APP_GLICEMIA_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>
        </div>
      </details>

      {/* === Responsável === */}
      <details className="p-4 border rounded">
        <summary className="font-bold cursor-pointer">Dados do Responsável</summary>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Nome do Responsável" value={formData.responsavel.nome} onChange={(e) => handleNestedChange("responsavel","nome", e.target.value)} />
          <Input placeholder="CPF" value={formData.responsavel.cpf} onChange={(e) => handleNestedChange("responsavel","cpf", e.target.value)} />
          <Input placeholder="RG" value={formData.responsavel.rg} onChange={(e) => handleNestedChange("responsavel","rg", e.target.value)} />
          <Select value={formData.responsavel.parentesco} onValueChange={(val) => handleNestedChange("responsavel","parentesco", val)}>
            {PARENTESCO_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </Select>
          <Input placeholder="Telefone" value={formData.responsavel.telefone} onChange={(e) => handleNestedChange("responsavel","telefone", e.target.value)} />
          <Input type="date" placeholder="Data de Nascimento" value={formData.responsavel.dataNascimento} onChange={(e) => handleNestedChange("responsavel","dataNascimento", e.target.value)} />
          <Input placeholder="Ocupação" value={formData.responsavel.ocupacao} onChange={(e) => handleNestedChange("responsavel","ocupacao", e.target.value)} />
        </div>
      </details>

{/* === Outras Informações === */}
<details className="p-4 border rounded">
  <summary className="font-bold cursor-pointer">Outras Informações</summary>
  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
    <Select value={formData.auxilio} onValueChange={(val) => handleChange("auxilio", val)}>
      {AUXILIOS_OPTIONS.map(opt => (
        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
      ))}
    </Select>

    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={formData.celularInternet}
        onChange={(e) => handleChange("celularInternet", e.target.checked)}
      />
      Celular com internet
    </label>

    <div className="flex flex-col">
      <label className="font-medium text-sm">Data do Cadastro</label>
      <Input
        type="date"
        placeholder="Selecione o dia do cadastro"
        value={formData.dataCadastro}
        onChange={(e) => handleChange("dataCadastro", e.target.value)}
      />
      <span className="text-xs text-gray-500 mt-1">
        Esta data corresponde ao dia em que o paciente foi cadastrado.
      </span>
    </div>

    <Input type="file" onChange={(e) => handleChange("documento", e.target.files?.[0] || null)} />
  </div>
</details>

<Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white mt-4">
  Salvar Cadastro
</Button>
    </form>
  );
};

export default PacienteForm;
