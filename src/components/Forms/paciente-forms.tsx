import { apiFetch } from "@/lib/api";
import React, { FormEvent, useState } from "react";
import { z } from "zod"; // Importar Zod

// ================= FUNÇÕES HELPER DE VALIDAÇÃO =================
/**
 * Valida um CPF (remove formatação).
 */
const validateCPF = (cpf: string) => {
  if (typeof cpf !== 'string') return false; // Garante que é string
  const cpfLimpo = cpf.replace(/[^\d]+/g, '');
  if (cpfLimpo === '' || cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpfLimpo.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpfLimpo.charAt(10))) return false;
  return true;
};

/**
 * Verifica se o paciente é menor de 18 anos.
 */
const isMinor = (dataNascimento: string): boolean => {
    if (!dataNascimento) return false;
    try {
        const birthDate = new Date(dataNascimento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age < 18;
    } catch(e) {
        return false;
    }
}

// ================= ESQUEMA DE VALIDAÇÃO ZOD =================
const formSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório (mínimo 3 caracteres)"),
  cpf: z.string().refine(validateCPF, "CPF inválido"),
  cartaoSUS: z.string().optional(),
  rg: z.string().optional(),
  telefone: z.string().min(10, "Telefone é obrigatório (com DDD)"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  dataNascimento: z.string().date("Data de Nascimento é obrigatória"),
  sexo: z.string().min(1, "Sexo é obrigatório"),
  ocupacao: z.string().optional(),
  cep: z.string().min(8, "CEP é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório (preenchido pelo CEP)"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório (preenchido pelo CEP)"),
  municipio: z.string().min(1, "Município é obrigatório (preenchido pelo CEP)"),
  tipoAtendimento: z.string().min(1, "Tipo de Atendimento é obrigatório"),
  diagnostico: z.string().min(1, "Diagnóstico é obrigatório"),
  dataDiagnostico: z.string().date("Data inválida").optional().or(z.literal("")),
  gestante: z.boolean(),
  amamentando: z.boolean(),
  deficiencia: z.string().optional(),
  historicoFamiliar: z.object({
      dm1: z.boolean(),
      dm2: z.boolean(),
      outros: z.string().optional(),
  }),
  tratamento: z.object({
      metodoInsulina: z.string().min(1, "Método de Insulina é obrigatório"),
      metodoMonitoramento: z.string().min(1, "Método de Monitoramento é obrigatório"),
      marcaSensor: z.string().optional(), // Pode ser opcional dependendo do método
      appGlicemia: z.string().optional(),
  }),
  responsavel: z.object({
    nome: z.string().optional(),
    cpf: z.string().optional(),
    rg: z.string().optional(),
    parentesco: z.string().optional(),
    telefone: z.string().optional(),
    dataNascimento: z.string().optional(),
    ocupacao: z.string().optional(),
  }),
  auxilio: z.string().min(1, "Seleção de auxílio é obrigatória"),
  celularInternet: z.boolean(),
  dataCadastro: z.string().date("Data de Cadastro é obrigatória"),
  documento: z.any().optional(), // Validação de 'File' no Zod é mais complexa, 'any' por enquanto
})
.superRefine((data, ctx) => {
    // Validação condicional: Se for menor de idade, dados do responsável são obrigatórios
    if (isMinor(data.dataNascimento)) {
        if (!data.responsavel.nome?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["responsavel", "nome"],
                message: "Nome do responsável é obrigatório para menores",
            });
        }
        if (!data.responsavel.cpf?.trim() || !validateCPF(data.responsavel.cpf)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["responsavel", "cpf"],
                message: "CPF do responsável é inválido ou obrigatório",
            });
        }
        if (!data.responsavel.parentesco) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["responsavel", "parentesco"],
                message: "Parentesco é obrigatório",
            });
        }
    }
});

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
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  // Estado para armazenar os erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Limpa o erro ao digitar
  const handleChange = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Limpa o erro específico deste campo
    if (errors[key as string]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[key as string];
            return newErrors;
        });
    }
  };

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
    
    // Limpa o erro específico (ex: "responsavel.nome")
    const errorKey = `${String(parent)}.${String(key)}`;
    if (errors[errorKey]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
        });
    }
  };

  // Função para buscar o endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    setLoadingCep(true);
    setCepError("");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        setFormData((prev) => ({
            ...prev,
            endereco: "",
            bairro: "",
            municipio: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          municipio: data.localidade,
        }));
        
        // Limpa erros de endereço caso o CEP preencha
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors.endereco;
            delete newErrors.bairro;
            delete newErrors.municipio;
            return newErrors;
        })
      }
    } catch (error) {
      setCepError("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setLoadingCep(false);
    }
  };

  // Limpa o erro do CEP ao digitar
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    // Remove caracteres não numéricos para a busca
    const cleanedCep = cep.replace(/\D/g, "");

    // Atualiza o valor no formulário (com máscara, se houver)
    setFormData(prev => ({ ...prev, cep: cep }));

    // Limpa o erro do CEP
    if (errors.cep) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.cep;
            return newErrors;
        });
    }

    // Se o CEP limpo tiver 8 dígitos, busca o endereço
    if (cleanedCep.length === 8) {
      fetchAddressByCep(cleanedCep);
    } else {
      // Limpa o erro se o usuário estiver corrigindo o CEP
      setCepError("");
    }
  };

  // Função que executa a validação
  const validateForm = (): boolean => {
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      // Formata os erros para o estado
      const newErrors: Record<string, string> = {};
      
      // =======================================================
      // CORREÇÃO: Trocado 'errors' por 'issues'
      // =======================================================
      result.error.issues.forEach(err => {
        // Pega o caminho (ex: "responsavel.nome") e a mensagem
        const path = err.path.join('.');
        newErrors[path] = err.message;
      });
      // =======================================================
      
      setErrors(newErrors);
      
      // Foca no primeiro campo com erro (opcional, mas boa UX)
      const firstErrorKey = Object.keys(newErrors)[0];
      // Tenta encontrar por 'name' primeiro
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
          element.focus();
      }
      
      return false; // Falha na validação
    }

    setErrors({}); // Limpa os erros se for sucesso
    return true; // Sucesso na validação
  };

  // handleSubmit agora chama a validação
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Etapa de Validação
    const isValid = validateForm();
    if (!isValid) {
      setMessage("Por favor, corrija os erros no formulário.");
      setShowModal(true);
      return; // Interrompe o envio
    }

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
      // Aqui você pode limpar o formulário se desejar
      // setFormData({ ...valoresIniciais... });
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate> {/* noValidate desabilita validação HTML nativa */}
          
          {/* ================= DADOS PESSOAIS ================= */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Campo NOME com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Nome completo</label>
                <input
                  type="text"
                  name="nome" // name é importante para focar no erro
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.nome ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  required
                />
                {/* Exibe a mensagem de erro */}
                {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
              </div>
              
              {/* Campo CPF com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleChange("cpf", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.cpf ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  required
                />
                {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf}</p>}
              </div>

              {/* Cartão SUS */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Cartão SUS</label>
                <input
                  type="text"
                  name="cartaoSUS"
                  value={formData.cartaoSUS}
                  onChange={(e) => handleChange("cartaoSUS", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>

              {/* RG */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">RG</label>
                <input
                  type="text"
                  name="rg"
                  value={formData.rg}
                  onChange={(e) => handleChange("rg", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
              
              {/* Campo TELEFONE com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  required
                />
                {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
              </div>
              
              {/* Campo E-MAIL com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              
              {/* Campo DATA NASCIMENTO com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={(e) => handleChange("dataNascimento", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.dataNascimento ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  required
                />
                {errors.dataNascimento && <p className="text-xs text-red-500 mt-1">{errors.dataNascimento}</p>}
              </div>
              
              {/* Campo SEXO com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={(e) => handleChange("sexo", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.sexo ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                >
                  <option value="">Selecione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="OUTRO">Outro</option>
                </select>
                {errors.sexo && <p className="text-xs text-red-500 mt-1">{errors.sexo}</p>}
              </div>

              {/* Ocupação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Ocupação</label>
                <input
                  type="text"
                  name="ocupacao"
                  value={formData.ocupacao}
                  onChange={(e) => handleChange("ocupacao", e.target.value)}
                  className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* ================= ENDEREÇO ================= */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Campo CEP com validação */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCepChange}
                  className={`rounded-lg p-3 border ${errors.cep ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  placeholder="00000-000"
                />
                {loadingCep && <p className="text-xs text-blue-500 mt-1">Buscando CEP...</p>}
                {cepError && <p className="text-xs text-red-500 mt-1">{cepError}</p>}
                {errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
              </div>
              
              {/* Outros campos de endereço... */}
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.endereco ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200 disabled:bg-gray-100`}
                  disabled={loadingCep}
                />
                {errors.endereco && <p className="text-xs text-red-500 mt-1">{errors.endereco}</p>}
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.numero ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                />
                {errors.numero && <p className="text-xs text-red-500 mt-1">{errors.numero}</p>}
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleChange("bairro", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.bairro ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200 disabled:bg-gray-100`}
                  disabled={loadingCep}
                />
                {errors.bairro && <p className="text-xs text-red-500 mt-1">{errors.bairro}</p>}
              </div>
              
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Município</label>
                <input
                  type="text"
                  name="municipio"
                  value={formData.municipio}
                  onChange={(e) => handleChange("municipio", e.target.value)}
                  className={`rounded-lg p-3 border ${errors.municipio ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200 disabled:bg-gray-100`}
                  disabled={loadingCep}
                />
                {errors.municipio && <p className="text-xs text-red-500 mt-1">{errors.municipio}</p>}
              </div>
            </div>
          </div>
          
          {/* ================= DADOS CLÍNICOS ================= */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Dados Clínicos e Tratamento</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Tipo de Atendimento */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tipo de Atendimento</label>
                  <select
                    name="tipoAtendimento"
                    value={formData.tipoAtendimento}
                    onChange={(e) => handleChange("tipoAtendimento", e.target.value)}
                    className={`rounded-lg p-3 border ${errors.tipoAtendimento ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  >
                    <option value="">Selecione...</option>
                    {TIPO_ATENDIMENTO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.tipoAtendimento && <p className="text-xs text-red-500 mt-1">{errors.tipoAtendimento}</p>}
                </div>
                
                {/* Diagnóstico */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Diagnóstico</label>
                  <select
                    name="diagnostico"
                    value={formData.diagnostico}
                    onChange={(e) => handleChange("diagnostico", e.target.value)}
                    className={`rounded-lg p-3 border ${errors.diagnostico ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  >
                    <option value="">Selecione...</option>
                    {DIAGNOSTICO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.diagnostico && <p className="text-xs text-red-500 mt-1">{errors.diagnostico}</p>}
                </div>
                
                {/* Data Diagnóstico */}
                 <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Data do Diagnóstico</label>
                  <input
                    type="date"
                    name="dataDiagnostico"
                    value={formData.dataDiagnostico}
                    onChange={(e) => handleChange("dataDiagnostico", e.target.value)}
                    className={`rounded-lg p-3 border ${errors.dataDiagnostico ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  />
                  {errors.dataDiagnostico && <p className="text-xs text-red-500 mt-1">{errors.dataDiagnostico}</p>}
                </div>

                {/* Gestante/Amamentando */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={formData.gestante} onChange={(e) => handleChange("gestante", e.target.checked)} /> Gestante</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={formData.amamentando} onChange={(e) => handleChange("amamentando", e.target.checked)} /> Amamentando</label>
                </div>

                {/* Tipo de Deficiência */}
                 <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tipo de Deficiência</label>
                  <select
                    name="deficiencia"
                    value={formData.deficiencia}
                    onChange={(e) => handleChange("deficiencia", e.target.value)}
                    className={`rounded-lg p-3 border ${errors.deficiencia ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  >
                    <option value="">Selecione...</option>
                    {TIPO_DEFICIENCIA_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.deficiencia && <p className="text-xs text-red-500 mt-1">{errors.deficiencia}</p>}
                </div>

                {/* Histórico Familiar */}
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
                        name="historicoFamiliar.outros"
                        value={formData.historicoFamiliar.outros}
                        onChange={(e) => handleNestedChange("historicoFamiliar", "outros", e.target.value)}
                        className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tratamento */}
                <div className="col-span-2 space-y-2">
                  <h3 className="text-md font-semibold text-gray-700">Tratamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Método de Insulina */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-700">Método de Insulina</label>
                        <select
                          name="tratamento.metodoInsulina"
                          value={formData.tratamento.metodoInsulina}
                          onChange={(e) => handleNestedChange("tratamento", "metodoInsulina", e.target.value)}
                          className={`rounded-lg p-3 border ${errors["tratamento.metodoInsulina"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                        >
                          <option value="">Selecione...</option>
                          {METODO_INSULINA_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {errors["tratamento.metodoInsulina"] && <p className="text-xs text-red-500 mt-1">{errors["tratamento.metodoInsulina"]}</p>}
                    </div>

                    {/* Método de Monitoramento */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-medium text-gray-700">Método de Monitoramento</label>
                        <select
                          name="tratamento.metodoMonitoramento"
                          value={formData.tratamento.metodoMonitoramento}
                          onChange={(e) => handleNestedChange("tratamento", "metodoMonitoramento", e.target.value)}
                          className={`rounded-lg p-3 border ${errors["tratamento.metodoMonitoramento"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                        >
                          <option value="">Selecione...</option>
                          {METODO_MONITORAMENTO_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {errors["tratamento.metodoMonitoramento"] && <p className="text-xs text-red-500 mt-1">{errors["tratamento.metodoMonitoramento"]}</p>}
                    </div>

                    {/* Marca Sensor */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-700">Marca do Sensor</label>
                      <select
                        name="tratamento.marcaSensor"
                        value={formData.tratamento.marcaSensor}
                        onChange={(e) => handleNestedChange("tratamento", "marcaSensor", e.target.value)}
                        className={`rounded-lg p-3 border ${errors["tratamento.marcaSensor"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                      >
                        <option value="">Selecione...</option>
                        {MARCA_SENSOR_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors["tratamento.marcaSensor"] && <p className="text-xs text-red-500 mt-1">{errors["tratamento.marcaSensor"]}</p>}
                    </div>

                    {/* App Glicemia */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-700">App Glicemia</label>
                      <select
                        name="tratamento.appGlicemia"
                        value={formData.tratamento.appGlicemia}
                        onChange={(e) => handleNestedChange("tratamento", "appGlicemia", e.target.value)}
                        className={`rounded-lg p-3 border ${errors["tratamento.appGlicemia"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                      >
                        <option value="">Selecione...</option>
                        {APP_GLICEMIA_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                       {errors["tratamento.appGlicemia"] && <p className="text-xs text-red-500 mt-1">{errors["tratamento.appGlicemia"]}</p>}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* ================= DADOS DO RESPONSÁVEL ================= */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Dados do Responsável</h2>
             <p className="text-sm text-gray-600">Obrigatório apenas se o paciente for menor de 18 anos.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nome do Responsável */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nome do Responsável</label>
                  <input
                    type="text"
                    name="responsavel.nome"
                    value={formData.responsavel.nome}
                    onChange={(e) => handleNestedChange("responsavel", "nome", e.target.value)}
                    className={`rounded-lg p-3 border ${errors["responsavel.nome"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  />
                  {errors["responsavel.nome"] && <p className="text-xs text-red-500 mt-1">{errors["responsavel.nome"]}</p>}
                </div>
                
                {/* CPF do Responsável */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">CPF</label>
                  <input
                    type="text"
                    name="responsavel.cpf"
                    value={formData.responsavel.cpf}
                    onChange={(e) => handleNestedChange("responsavel", "cpf", e.target.value)}
                    className={`rounded-lg p-3 border ${errors["responsavel.cpf"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  />
                  {errors["responsavel.cpf"] && <p className="text-xs text-red-500 mt-1">{errors["responsavel.cpf"]}</p>}
                </div>

                {/* RG do Responsável */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">RG</label>
                  <input
                    type="text"
                    name="responsavel.rg"
                    value={formData.responsavel.rg}
                    onChange={(e) => handleNestedChange("responsavel", "rg", e.target.value)}
                    className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  />
                </div>

                {/* Parentesco */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Parentesco</label>
                  <select
                    name="responsavel.parentesco"
                    value={formData.responsavel.parentesco}
                    onChange={(e) => handleNestedChange("responsavel", "parentesco", e.target.value)}
                    className={`rounded-lg p-3 border ${errors["responsavel.parentesco"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  >
                    <option value="">Selecione...</option>
                    {PARENTESCO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors["responsavel.parentesco"] && <p className="text-xs text-red-500 mt-1">{errors["responsavel.parentesco"]}</p>}
                </div>

                {/* Telefone do Responsável */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    type="tel"
                    name="responsavel.telefone"
                    value={formData.responsavel.telefone}
                    onChange={(e) => handleNestedChange("responsavel", "telefone", e.target.value)}
                    className={`rounded-lg p-3 border ${errors["responsavel.telefone"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  />
                  {errors["responsavel.telefone"] && <p className="text-xs text-red-500 mt-1">{errors["responsavel.telefone"]}</p>}
                </div>

                {/* Data Nascimento do Responsável */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <input
                    type="date"
                    name="responsavel.dataNascimento"
                    value={formData.responsavel.dataNascimento}
                    onChange={(e) => handleNestedChange("responsavel", "dataNascimento", e.target.value)}
                    className={`rounded-lg p-3 border ${errors["responsavel.dataNascimento"] ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  />
                   {errors["responsavel.dataNascimento"] && <p className="text-xs text-red-500 mt-1">{errors["responsavel.dataNascimento"]}</p>}
                </div>

                {/* Ocupação do Responsável */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ocupação</label>
                  <input
                    type="text"
                    name="responsavel.ocupacao"
                    value={formData.responsavel.ocupacao}
                    onChange={(e) => handleNestedChange("responsavel", "ocupacao", e.target.value)}
                    className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  />
                </div>

             </div>
          </div>

          {/* ================= OUTRAS INFORMAÇÕES ================= */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-900 border-b-2 border-blue-200 pb-2">Outras Informações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Auxílios */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Auxílios</label>
                  <select
                    name="auxilio"
                    value={formData.auxilio}
                    onChange={(e) => handleChange("auxilio", e.target.value)}
                    className={`rounded-lg p-3 border ${errors.auxilio ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  >
                    <option value="">Selecione...</option>
                    {AUXILIOS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.auxilio && <p className="text-xs text-red-500 mt-1">{errors.auxilio}</p>}
                </div>
                
                {/* Celular com Internet */}
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

                {/* Data do Cadastro */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Data do Cadastro</label>
                  <input
                    type="date"
                    name="dataCadastro"
                    value={formData.dataCadastro}
                    onChange={(e) => handleChange("dataCadastro", e.target.value)}
                    className={`rounded-lg p-3 border ${errors.dataCadastro ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-blue-200`}
                  />
                  {errors.dataCadastro && <p className="text-xs text-red-500 mt-1">{errors.dataCadastro}</p>}
                  <span className="text-xs text-gray-500 mt-1">
                    Esta data corresponde ao dia em que o paciente foi cadastrado.
                  </span>
                </div>
                
                {/* Documento */}
                <div className="flex flex-col space-y-1">
                  <label className="text-sm font-medium text-gray-700">Documento</label>
                  <input
                    type="file"
                    name="documento"
                    onChange={(e) => handleChange("documento", e.target.files?.[0] || null)}
                    className="rounded-lg p-3 border border-gray-300 focus:ring focus:ring-blue-200"
                  />
                </div>

            </div>
          </div>
          
          {/* ================= BOTÃO DE SUBMIT ================= */}
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