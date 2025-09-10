import React, { useState } from 'react';

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

const App = () => {
  const [formData, setFormData] = useState({
    nome: "", cpf: "", cartaoSUS: "", rg: "", telefone: "", email: "", dataNascimento: "", sexo: "", ocupacao: "",
    cep: "", endereco: "", numero: "", bairro: "", municipio: "",
    tipoAtendimento: "", diagnostico: "", dataDiagnostico: "", gestante: false, amamentando: false, deficiencia: "",
    historicoFamiliar: { dm1: false, dm2: false, outros: "" },
    tratamento: { metodoInsulina: "", metodoMonitoramento: "", marcaSensor: "", appGlicemia: "" },
    responsavel: { nome: "", cpf: "", rg: "", parentesco: "", telefone: "", dataNascimento: "", ocupacao: "" },
    auxilio: "", celularInternet: false, dataCadastro: "", documento: null,
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parent, key, value) => {
    setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    setMessage('Formulário enviado com sucesso!');
    setShowModal(true);
    setFormData({
      nome: "", cpf: "", cartaoSUS: "", rg: "", telefone: "", email: "", dataNascimento: "", sexo: "", ocupacao: "",
      cep: "", endereco: "", numero: "", bairro: "", municipio: "",
      tipoAtendimento: "", diagnostico: "", dataDiagnostico: "", gestante: false, amamentando: false, deficiencia: "",
      historicoFamiliar: { dm1: false, dm2: false, outros: "" },
      tratamento: { metodoInsulina: "", metodoMonitoramento: "", marcaSensor: "", appGlicemia: "" },
      responsavel: { nome: "", cpf: "", rg: "", parentesco: "", telefone: "", dataNascimento: "", ocupacao: "" },
      auxilio: "", celularInternet: false, dataCadastro: "", documento: null,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans p-6 text-gray-800">
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
