import React, { useState, FormEvent, ChangeEvent } from "react";
import { apiFetch } from "@/lib/api";

// ================= TIPOS =================
type HistoricoFamiliar = {
  dm1: boolean;
  dm2: boolean;
  outros: string;
};

type Tratamento = {
  metodoInsulina: string;
  metodoMonitoramento: string;
  marcaSensor: string;
  appGlicemia: string;
};

type Responsavel = {
  nome: string;
  cpf: string;
  rg: string;
  parentesco: string;
  telefone: string;
  dataNascimento: string;
  ocupacao: string;
};

type FormData = {
  nome: string;
  cpf: string;
  cartaoSUS: string;
  rg: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  sexo: string;
  ocupacao: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  municipio: string;
  tipoAtendimento: string;
  diagnostico: string;
  dataDiagnostico: string;
  gestante: boolean;
  amamentando: boolean;
  deficiencia: string;
  historicoFamiliar: HistoricoFamiliar;
  tratamento: Tratamento;
  responsavel: Responsavel;
  auxilio: string;
  celularInternet: boolean;
  dataCadastro: string;
  documento: File | null;
};

// ================= CONSTANTES =================
const TIPO_ATENDIMENTO_OPTIONS = [
  { value: "0", label: "Sistema Único de Saúde (SUS)" },
  { value: "1", label: "Convênio/Plano de Saúde" },
  { value: "2", label: "Particular" },
  { value: "3", label: "Misto (SUS + outros)" },
];

const DIAGNOSTICO_OPTIONS = [
  { value: "0", label: "Diabetes Mellitus Tipo 1 (DM1)" },
  { value: "1", label: "Diabetes Mellitus Tipo 2 (DM2)" },
  { value: "2", label: "Diabetes Autoimune Latente do Adulto (LADA)" },
  { value: "3", label: "Maturity Onset Diabetes of the Young (MODY)" },
  { value: "4", label: "Diabetes Gestacional" },
  { value: "5", label: "Outro" },
];

const TIPO_DEFICIENCIA_OPTIONS = [
  { value: "0", label: "Física" },
  { value: "1", label: "Visual" },
  { value: "2", label: "Auditiva" },
  { value: "3", label: "Intelectual" },
  { value: "4", label: "Múltipla" },
  { value: "5", label: "Outro" },
];

const METODO_INSULINA_OPTIONS = [
  { value: "1", label: "Caneta de Insulina" },
  { value: "2", label: "Seringa" },
  { value: "3", label: "Bomba de Insulina" },
  { value: "4", label: "Não utiliza insulina" },
];

const METODO_MONITORAMENTO_OPTIONS = [
  { value: "1", label: "Glicômetro Tradicional" },
  { value: "2", label: "Sensor Flash (FGM)" },
  { value: "3", label: "Sensor Contínuo (CGM)" },
  { value: "4", label: "Múltiplos métodos" },
];

const MARCA_SENSOR_OPTIONS = [
  { value: "1", label: "FreeStyle Libre" },
  { value: "2", label: "FreeStyle Libre 2" },
  { value: "3", label: "Dexcom G6" },
  { value: "4", label: "Dexcom G7" },
  { value: "5", label: "Medtronic Guardian" },
  { value: "6", label: "Accu-Chek Active" },
  { value: "7", label: "Accu-Chek Guide" },
  { value: "8", label: "One Touch Select Plus" },
  { value: "9", label: "One Touch Ultra" },
  { value: "10", label: "Contour Ultra" },
  { value: "11", label: "Outro" },
];

const APP_GLICEMIA_OPTIONS = [
  { value: "1", label: "LibreLink" },
  { value: "2", label: "Dexcom" },
  { value: "3", label: "Medtronic" },
  { value: "4", label: "Accu-Chek" },
  { value: "5", label: "One Touch" },
  { value: "6", label: "GlicoSource" },
  { value: "7", label: "Outro App" },
  { value: "8", label: "Não utiliza App" },
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
  { value: "1", label: "Benefício de Prestação Continuada (BPC)" },
  { value: "2", label: "Bolsa Família" },
  { value: "3", label: "Auxílio Doença" },
  { value: "4", label: "Aposentadoria por Invalidez" },
  { value: "5", label: "Outro Auxílio" },
  { value: "6", label: "Nenhum Auxílio" },
];

// ================= COMPONENTE =================
const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    cartaoSUS: "",
    rg: "",
    telefone: "",
    email: "",
    dataNascimento: "",
    sexo: "",
    ocupacao: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    municipio: "",
    tipoAtendimento: "",
    diagnostico: "",
    dataDiagnostico: "",
    gestante: false,
    amamentando: false,
    deficiencia: "",
    historicoFamiliar: { dm1: false, dm2: false, outros: "" },
    tratamento: {
      metodoInsulina: "",
      metodoMonitoramento: "",
      marcaSensor: "",
      appGlicemia: "",
    },
    responsavel: {
      nome: "",
      cpf: "",
      rg: "",
      parentesco: "",
      telefone: "",
      dataNascimento: "",
      ocupacao: "",
    },
    auxilio: "",
    celularInternet: false,
    dataCadastro: "",
    documento: null,
  });

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Função genérica para atualizar campos simples
  const handleChange = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Função para atualizar objetos aninhados
  const handleNestedChange = <
    P extends keyof FormData,
    K extends keyof FormData[P]
  >(
    parent: P,
    key: K,
    value: FormData[P][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent] as object, [key]: value },
    }));
  };

  // Envio do formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      nome: formData.nome,
      cpf: formData.cpf,
      cartao_sus: formData.cartaoSUS,
      rg: formData.rg,
      telefone: formData.telefone,
      data_nascimento: formData.dataNascimento || null,
      email: formData.email,
      ocupacao: formData.ocupacao,
      sexo: formData.sexo || null,
      endereco: formData.endereco,
      municipio: formData.municipio,
      numero: formData.numero,
      cep: formData.cep,
      gestante: formData.gestante,
      amamentando: formData.amamentando,
      historico_dm1: formData.historicoFamiliar.dm1,
      historico_dm2: formData.historicoFamiliar.dm2,
      outros_dm: formData.historicoFamiliar.outros,
      tipo_atendimento: formData.tipoAtendimento
        ? Number(formData.tipoAtendimento)
        : null,
      diagnostico: formData.diagnostico ? Number(formData.diagnostico) : null,
      deficiencia: formData.deficiencia ? Number(formData.deficiencia) : null,
      metodo_insulina: formData.tratamento.metodoInsulina
        ? Number(formData.tratamento.metodoInsulina)
        : null,
      metodo_monitoramento: formData.tratamento.metodoMonitoramento
        ? Number(formData.tratamento.metodoMonitoramento)
        : null,
      marca_sensor: formData.tratamento.marcaSensor
        ? Number(formData.tratamento.marcaSensor)
        : null,
      app_glicemia: formData.tratamento.appGlicemia
        ? Number(formData.tratamento.appGlicemia)
        : null,
      nome_responsavel: formData.responsavel.nome || null,
      cpf_responsavel: formData.responsavel.cpf || null,
      rg_responsavel: formData.responsavel.rg || null,
      telefone_responsavel: formData.responsavel.telefone || null,
      data_nascimento_responsavel:
        formData.responsavel.dataNascimento || null,
      ocupacao_responsavel: formData.responsavel.ocupacao || null,
      auxilio: formData.auxilio ? Number(formData.auxilio) : null,
      data_cadastro: formData.dataCadastro || null,
      celular_com_internet: formData.celularInternet,
    };

    try {
      const response = await apiFetch("/api/pacientes/", true, {
        method: "POST",
        body: JSON.stringify(payload),
      });


      setMessage("Paciente cadastrado com sucesso!");
      setShowModal(true);
    } catch (err) {
      console.error("Erro:", err);
      setMessage("Erro ao cadastrar paciente");
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans p-6 text-gray-800">
      <div className="max-w-4xl mx-auto w-full bg-white shadow-xl rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-900">Formulário de Cadastro do Paciente</h1>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <p className="text-lg font-semibold">{message}</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Nome completo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Cartão SUS</label>
                <input
                  type="text"
                  value={formData.cartaoSUS}
                  onChange={(e) => handleChange("cartaoSUS", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">RG</label>
                <input
                  type="text"
                  value={formData.rg}
                  onChange={(e) => handleChange("rg", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleChange("dataNascimento", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Sexo</label>
                <select
                  value={formData.sexo}
                  onChange={(e) => handleChange("sexo", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                >
                  <option value="">Selecione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Ocupação</label>
                <input
                  type="text"
                  value={formData.ocupacao}
                  onChange={(e) => handleChange("ocupacao", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => handleChange("cep", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => handleChange("bairro", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Município</label>
                <input
                  type="text"
                  value={formData.municipio}
                  onChange={(e) => handleChange("municipio", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Dados Clínicos e Tratamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Tipo de Atendimento</label>
                <select
                  value={formData.tipoAtendimento}
                  onChange={(e) => handleChange("tipoAtendimento", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                >
                  <option value="">Selecione...</option>
                  {TIPO_ATENDIMENTO_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Diagnóstico</label>
                <select
                  value={formData.diagnostico}
                  onChange={(e) => handleChange("diagnostico", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                >
                  <option value="">Selecione...</option>
                  {DIAGNOSTICO_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Data do Diagnóstico</label>
                <input
                  type="date"
                  value={formData.dataDiagnostico}
                  onChange={(e) => handleChange("dataDiagnostico", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.gestante} onChange={(e) => handleChange("gestante", e.target.checked)} /> Gestante</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.amamentando} onChange={(e) => handleChange("amamentando", e.target.checked)} /> Amamentando</label>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Tipo de Deficiência</label>
                <select
                  value={formData.deficiencia}
                  onChange={(e) => handleChange("deficiencia", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                >
                  <option value="">Selecione...</option>
                  {TIPO_DEFICIENCIA_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <h3 className="text-md font-semibold text-gray-700">Histórico Familiar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.historicoFamiliar.dm1} onChange={(e) => handleNestedChange("historicoFamiliar", "dm1", e.target.checked)} /> DM1</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.historicoFamiliar.dm2} onChange={(e) => handleNestedChange("historicoFamiliar", "dm2", e.target.checked)} /> DM2</label>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Outros DM</label>
                    <input
                      type="text"
                      value={formData.historicoFamiliar.outros}
                      onChange={(e) => handleNestedChange("historicoFamiliar", "outros", e.target.value)}
                      className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 space-y-2">
                <h3 className="text-md font-semibold text-gray-700">Tratamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Método de Insulina</label>
                    <select
                      value={formData.tratamento.metodoInsulina}
                      onChange={(e) => handleNestedChange("tratamento", "metodoInsulina", e.target.value)}
                      className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Selecione...</option>
                      {METODO_INSULINA_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Método de Monitoramento</label>
                    <select
                      value={formData.tratamento.metodoMonitoramento}
                      onChange={(e) => handleNestedChange("tratamento", "metodoMonitoramento", e.target.value)}
                      className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Selecione...</option>
                      {METODO_MONITORAMENTO_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">Marca do Sensor</label>
                    <select
                      value={formData.tratamento.marcaSensor}
                      onChange={(e) => handleNestedChange("tratamento", "marcaSensor", e.target.value)}
                      className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Selecione...</option>
                      {MARCA_SENSOR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-700">App Glicemia</label>
                    <select
                      value={formData.tratamento.appGlicemia}
                      onChange={(e) => handleNestedChange("tratamento", "appGlicemia", e.target.value)}
                      className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                    >
                      <option value="">Selecione...</option>
                      {APP_GLICEMIA_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Dados do Responsável</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Nome do Responsável</label>
                <input
                  type="text"
                  value={formData.responsavel.nome}
                  onChange={(e) => handleNestedChange("responsavel", "nome", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  value={formData.responsavel.cpf}
                  onChange={(e) => handleNestedChange("responsavel", "cpf", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">RG</label>
                <input
                  type="text"
                  value={formData.responsavel.rg}
                  onChange={(e) => handleNestedChange("responsavel", "rg", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Parentesco</label>
                <select
                  value={formData.responsavel.parentesco}
                  onChange={(e) => handleNestedChange("responsavel", "parentesco", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                >
                  <option value="">Selecione...</option>
                  {PARENTESCO_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  value={formData.responsavel.telefone}
                  onChange={(e) => handleNestedChange("responsavel", "telefone", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input
                  type="date"
                  value={formData.responsavel.dataNascimento}
                  onChange={(e) => handleNestedChange("responsavel", "dataNascimento", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Ocupação</label>
                <input
                  type="text"
                  value={formData.responsavel.ocupacao}
                  onChange={(e) => handleNestedChange("responsavel", "ocupacao", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Outras Informações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Auxílios</label>
                <select
                  value={formData.auxilio}
                  onChange={(e) => handleChange("auxilio", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                >
                  <option value="">Selecione...</option>
                  {AUXILIOS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.celularInternet}
                    onChange={(e) => handleChange("celularInternet", e.target.checked)}
                  />
                  Celular com internet
                </label>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Data do Cadastro</label>
                <input
                  type="date"
                  value={formData.dataCadastro}
                  onChange={(e) => handleChange("dataCadastro", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
                <span className="text-xs text-gray-500 mt-1">
                  Esta data corresponde ao dia em que o paciente foi cadastrado.
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Documento</label>
                <input
                  type="file"
                  onChange={(e) => handleChange("documento", e.target.files?.[0] || null)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition-colors transform hover:scale-105"
            >
              Salvar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
