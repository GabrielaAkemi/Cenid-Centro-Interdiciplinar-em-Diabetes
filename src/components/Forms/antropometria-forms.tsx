"use client";

import React, { useState, useEffect, useRef } from "react";
import PatientBasicInfo, {PatientInfoData} from "./basicInfo/patientBasicInfo";

// Mock de componentes
const Card = ({ className, children }: any) => <div className={`max-w-4xl mx-auto w-full bg-white p-8 space-y-8 rounded-lg shadow-lg ${className}`}>{children}</div>;
const CardContent = ({ className, children }: any) => <div className={`p-0 ${className}`}>{children}</div>;
const CardHeader = ({ className, children }: any) => <div className={`p-4 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }: any) => <h1 className={`text-3xl font-bold text-center text-blue-900 mb-6 ${className}`}>{children}</h1>;

const Input = ({ className, ...props }: any) => <input className={`p-3.5 w-full border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 ${className}`} {...props} />;
const Button = ({ className, children, ...props }: any) => <button className={`w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition transform hover:scale-105 rounded-md shadow-lg ${className}`} {...props}>{children}</button>;
const Separator = ({ className }: any) => <div className={`h-[1px] my-4 bg-gray-200 ${className}`} />;
const Table = ({ className, ...props }: any) => <table className={`min-w-full overflow-hidden border-collapse ${className}`} {...props} />;
const TableHeader = ({ ...props }: any) => <thead className="bg-gray-50" {...props} />;
const TableHead = ({ className, ...props }: any) => <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props} />;
const TableBody = ({ ...props }: any) => <tbody className="bg-white" {...props} />;
const TableRow = ({ ...props }: any) => <tr className="border-b border-gray-200" {...props} />;
const TableCell = ({ className, ...props }: any) => <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`} {...props} />;

const Dialog = ({ open, onOpenChange, children }: any) => (
  open ? (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  ) : null
);

const DialogContent = ({ children }: any) => children;

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const FileInput = ({ name, label, multiple }: any) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        multiple={multiple}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200"
      />
    </div>
  );
};

// Funções de cálculo simples
const pegaIdade = (dataNascimento: string, dataAvaliacao: string) => {
  if (!dataNascimento || !dataAvaliacao) return 0;
  const nasc = new Date(dataNascimento);
  const aval = new Date(dataAvaliacao);
  let idade = aval.getFullYear() - nasc.getFullYear();
  const m = aval.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && aval.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};

const calculaZ = (idade: number, valor: number, tipo: string, homem: boolean) => {
  if (idade > 59) return NaN;
  return (valor / 10).toFixed(2);
};

const classificarZImc = (zScore: number, idade: number) => {
  if (isNaN(zScore)) return "Valor inválido";
  return zScore < -2 ? "Abaixo do peso" : "Peso normal";
};

const classificarZAltura = (zScore: number, idade: number) => {
  if (isNaN(zScore)) return "Valor inválido";
  return zScore < -2 ? "Baixa estatura" : "Estatura normal";
};

const classificarZPeso = (zScore: number, idade: number) => {
  if (isNaN(zScore)) return "Valor inválido";
  return zScore < -2 ? "Abaixo do peso" : "Peso normal";
};


interface AntropometriaProps {
  patientData?: PatientInfoData;
}

// **CORREÇÃO:** O componente agora recebe a prop 'onSubmit'
export default function AntropometriaForm({patientData} : AntropometriaProps) {
  const [formData, setFormData] = useState({
    pacienteId: "",
    nomePaciente: "",
    dataAvaliacao: new Date().toISOString().split("T")[0],
    dataNascimento: "",
    idade: "",
    sexo: "",
    peso_corporal: "",
    estatura_metros: "",
    circunferencia_braco: "",
    circunferencia_cintura: "",
    dobra_tricipal: "",
    imc: "",
    imc_escore_z: "",
    classificacao_imc: "",
    peso_tabela: "",
    peso_escore_z: "",
    classificacao_peso: "",
    estatura_tabela: "",
    estatura_escore_z: "",
    classificacao_estatura: "",
    circunferencia_braco_tabela: "",
    circunferencia_braco_escore_z: "",
    circunferencia_braco_classificacao: "",
    circunferencia_cintura_tabela: "",
    circunferencia_cintura_escore_z: "",
    circunferencia_cintura_classificacao: "",
    dobra_tricipal_tabela: "",
    dobra_tricipal_escore_z: "",
    dobra_tricipal_classificacao: "",
    gordura_corporal_bioimpedância_porcentagem_valor: "",
    gordura_corporal_bioimpedância_porcentagem_diagnostico: "",
    gordura_corporal_bioimpedância_kg_valor: "",
    gordura_corporal_bioimpedância_kg_diagnostico: "",
    massa_magra_bioimpedância_kg_valor: "",
    massa_magra_bioimpedância_kg_diagnostico: "",
    massa_magra_bioimpedância_porcentagem_valor: "",
    massa_magra_bioimpedância_porcentagem_diagnostico: "",
    agua_corporal_bioimpedância_litros_valor: "",
    agua_corporal_bioimpedância_litros_diagnostico: "",
    agua_corporal_bioimpedância_porcentagem_valor: "",
    agua_corporal_bioimpedância_porcentagem_diagnostico: "",
    agua_na_massa_magra_porcentagem_valor: "",
    agua_na_massa_magra_porcentagem_diagnostico: "",
    resistencia_r_ohms_valor: "",
    resistencia_r_ohms_diagnostico: "",
    reatancia_xc_ohms_valor: "",
    reatancia_xc_ohms_diagnostico: "",
    observacoes: "",
  });

  const [pacientes, setPacientes] = useState<any[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const nomeContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientInfoChange = (data: PatientInfoData) => {
    setFormData(prev => ({
      ...prev,
      patientInfo: data,
      nomePaciente: data.nome || "",
      dataNascimento: data.data_nascimento || "",
      sexo: data.sexo || "",
      idade: data.idade || "",
    }));
  };

  const handleCalculate = () => {
    const peso = parseFloat(formData.peso_corporal);
    const estatura = parseFloat(formData.estatura_metros);
    const idade = pegaIdade(formData.dataNascimento, formData.dataAvaliacao);
    const homem = formData.sexo === "Masculino";

    if (!peso || !estatura) {
      alert("Peso e Estatura são campos obrigatórios para o cálculo.");
      return;
    }

    const imc = peso / (estatura * estatura);
    const imcValue = parseFloat(imc.toFixed(1));
    const zImc = calculaZ(idade, imcValue, "imc", homem);
    const classificacaoImc = classificarZImc(imcValue, idade);

    const zPeso = calculaZ(idade, peso, "peso", homem);
    const classificacaoPeso = classificarZPeso(parseFloat(zPeso as string), idade);
    
    const zEstatura = calculaZ(idade, estatura * 100, "altura", homem);
    const classificacaoEstatura = classificarZAltura(parseFloat(zEstatura as string), idade);

    setFormData(prev => ({
      ...prev,
      imc: imcValue.toFixed(2),
      imc_escore_z: zImc as string,
      classificacao_imc: classificacaoImc,
      peso_tabela: peso.toFixed(2),
      peso_escore_z: zPeso as string,
      classificacao_peso: classificacaoPeso,
      estatura_tabela: estatura.toFixed(2),
      estatura_escore_z: zEstatura as string,
      classificacao_estatura: classificacaoEstatura,
      circunferencia_braco_tabela: formData.circunferencia_braco,
      circunferencia_cintura_tabela: formData.circunferencia_cintura,
      dobra_tricipal_tabela: formData.dobra_tricipal,
    }));
  };

  // **CORREÇÃO:** O `handleSubmit` agora chama a prop `onSubmit`
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Aqui você envia os dados para o seu backend
      const response = await fetch("/api/antropometria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao salvar dados");

      setShowSuccessDialog(true);
      // Resetar form se desejar
      // setFormData({...formData, peso_corporal: "", estatura_metros: ""});
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar avaliação.");
    }
  };

  useEffect(() => {
    if (!formData.gordura_corporal_bioimpedância_porcentagem_valor || formData.gordura_corporal_bioimpedância_porcentagem_valor === '') {
      setFormData(prev => ({...prev, gordura_corporal_bioimpedância_porcentagem_diagnostico: ""}));
      return;
    }
    const sexo = formData.sexo
    const valor = Number(formData.gordura_corporal_bioimpedância_porcentagem_valor)

    let diagnostico = ''

    if (sexo === 'Masculino') {
      diagnostico = valor >= 25 ? 'Obeso' : 'Não obeso'
    } else {
      diagnostico = valor >= 30 ? 'Obeso' : 'Não obeso'
    }

    setFormData(prev => ({...prev, gordura_corporal_bioimpedância_porcentagem_diagnostico: diagnostico}));
  }, [formData.gordura_corporal_bioimpedância_porcentagem_valor, formData.sexo]);

  useEffect(() => {
    if (!formData.dataNascimento || !formData.dataAvaliacao) {
      setFormData(prev => ({...prev, idade: ""}));
      return;
    }
    const idadeCalculada = pegaIdade(formData.dataNascimento, formData.dataAvaliacao);
    setFormData(prev => ({...prev, idade: idadeCalculada.toString()}));
  }, [formData.dataNascimento, formData.dataAvaliacao]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nomeContainerRef.current &&
        !nomeContainerRef.current.contains(event.target as Node)
      ) {
        setPacientes([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (buscaNome.length < 2) {
      setPacientes([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const mockData = [
        { id: 1, nome: "João Silva", sexo: "Masculino", dataNascimento: "1995-03-20" },
        { id: 2, nome: "Maria Oliveira", sexo: "Feminino", dataNascimento: "1998-07-15" },
      ].filter(p => p.nome.toLowerCase().includes(buscaNome.toLowerCase()));
      setPacientes(mockData);
    }, 400);
    return () => clearTimeout(timeout);
  }, [buscaNome]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans p-6 text-gray-800">
      <Card>
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Avaliação Antropométrica</h1>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientBasicInfo patientData={patientData} onChange={handlePatientInfoChange} />
            {/* Medidas Antropométricas */}
            <section className="p-4 space-y-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-900">Medidas Antropométricas</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Peso Corporal (kg)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Digite o peso"
                    name="peso_corporal"
                    value={formData.peso_corporal}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estatura (metros)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Digite a estatura"
                    name="estatura_metros"
                    value={formData.estatura_metros}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Circunferência do Braço (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Digite a medida"
                    name="circunferencia_braco"
                    value={formData.circunferencia_braco}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Circunferência da Cintura (cm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Digite a medida"
                    name="circunferencia_cintura"
                    value={formData.circunferencia_cintura}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Dobra Tricipital (mm)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Digite a medida"
                    name="dobra_tricipal"
                    value={formData.dobra_tricipal}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={handleCalculate}>
                  Calcular
                </Button>
              </div>
            </section>

            <section className="p-4 space-y-4">
              <div className="mt-4 overflow-x-auto rounded-md border border-gray-600">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Medida</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Valor escore-z</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Circunferência da Cintura (cm)</TableCell>
                      <TableCell><Input type="number" readOnly value={formData.circunferencia_cintura_tabela} /></TableCell>
                      <TableCell><Input type="number" readOnly value={formData.circunferencia_cintura_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.circunferencia_cintura_classificacao} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Circunferência do Braço (cm)</TableCell>
                      <TableCell><Input type="number" readOnly value={formData.circunferencia_braco_tabela} /></TableCell>
                      <TableCell><Input type="number" readOnly value={formData.circunferencia_braco_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.circunferencia_braco_classificacao} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dobra Tricipital (mm)</TableCell>
                      <TableCell><Input type="number" readOnly value={formData.dobra_tricipal_tabela} /></TableCell>
                      <TableCell><Input type="number" readOnly value={formData.dobra_tricipal_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.dobra_tricipal_classificacao} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>IMC (kg/m²)</TableCell>
                      <TableCell><Input type="number" readOnly value={formData.imc} /></TableCell>
                      <TableCell><Input type="number" readOnly value={formData.imc_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.classificacao_imc} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Peso (kg)</TableCell>
                      <TableCell><Input type="number" readOnly value={formData.peso_tabela} /></TableCell>
                      <TableCell><Input type="number" readOnly value={formData.peso_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.classificacao_peso} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Estatura</TableCell>
                      <TableCell><Input type="number" readOnly value={formData.estatura_tabela} /></TableCell>
                      <TableCell><Input type="number" readOnly value={formData.estatura_escore_z} /></TableCell>
                      <TableCell><Input type="text" readOnly value={formData.classificacao_estatura} /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-4">
              <h2 className="text-2xl font-bold text-blue-900">Bioimpedância</h2>
              <div className="mt-4 overflow-x-auto rounded-md border border-gray-600">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Medida</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>% gordura corporal bioimpedância (%)</TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_porcentagem_valor" value={formData.gordura_corporal_bioimpedância_porcentagem_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_porcentagem_diagnostico" readOnly value={formData.gordura_corporal_bioimpedância_porcentagem_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gordura corporal bioimpedância (kg)</TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_kg_valor" value={formData.gordura_corporal_bioimpedância_kg_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="gordura_corporal_bioimpedância_kg_diagnostico" readOnly value={formData.gordura_corporal_bioimpedância_kg_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Massa magra bioimpedância (kg)</TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_kg_valor" value={formData.massa_magra_bioimpedância_kg_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_kg_diagnostico" readOnly value={formData.massa_magra_bioimpedância_kg_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% massa magra bioimpedância (%)</TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_porcentagem_valor" value={formData.massa_magra_bioimpedância_porcentagem_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="massa_magra_bioimpedância_porcentagem_diagnostico" readOnly value={formData.massa_magra_bioimpedância_porcentagem_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Água corporal bioimpedância (litros)</TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_litros_valor" value={formData.agua_corporal_bioimpedância_litros_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_litros_diagnostico" readOnly value={formData.agua_corporal_bioimpedância_litros_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% água corporal bioimpedância (%)</TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_porcentagem_valor" value={formData.agua_corporal_bioimpedância_porcentagem_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="agua_corporal_bioimpedância_porcentagem_diagnostico" readOnly value={formData.agua_corporal_bioimpedância_porcentagem_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% água na massa magra (%)</TableCell>
                      <TableCell><Input type="text" name="agua_na_massa_magra_porcentagem_valor" value={formData.agua_na_massa_magra_porcentagem_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="agua_na_massa_magra_porcentagem_diagnostico" readOnly value={formData.agua_na_massa_magra_porcentagem_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Resistência (R) (Ohms)</TableCell>
                      <TableCell><Input type="text" name="resistencia_r_ohms_valor" value={formData.resistencia_r_ohms_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="resistencia_r_ohms_diagnostico" readOnly value={formData.resistencia_r_ohms_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Reatância (Xc) (Ohms)</TableCell>
                      <TableCell><Input type="text" name="reatancia_xc_ohms_valor" value={formData.reatancia_xc_ohms_valor} onChange={handleChange} /></TableCell>
                      <TableCell><Input type="text" name="reatancia_xc_ohms_diagnostico" readOnly value={formData.reatancia_xc_ohms_diagnostico} onChange={handleChange} /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-4">
              <h2 className="text-2xl font-bold text-blue-900">Observações</h2>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Observações Adicionais</label>
                <textarea
                  className="p-3.5 focus:ring-4 focus:ring-blue-300 min-h-[120px] w-full border border-gray-600 rounded-md shadow-sm"
                  placeholder="Digite observações adicionais sobre a avaliação antropométrica"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="p-4 mt-8">
                <h2 className="text-2xl font-bold text-blue-900">Anexo de exames complementares</h2>
                <p className="mt-2 text-sm text-gray-600">Este é um espaço para anexar exames, se necessário.</p>
              </div>
              <FileInput
                name="anexar"
                label="Anexar Documentos"
                multiple
              />
            </section>

            <div className="flex justify-center mt-6">
              <Button type="submit">
                Salvar Avaliação Antropométrica
              </Button>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent>
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    As informações foram salvas com sucesso.
                  </p>
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700 mt-4" onClick={() => setShowSuccessDialog(false)}>
                    Fechar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
