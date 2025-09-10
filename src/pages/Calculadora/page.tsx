"use client"

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
import { calculaZ, pegaIdade } from "./calculos"
import { classificarZImc, classificarZAltura, classificarZPeso } from "./classificacao"
import { toast } from "sonner";
import FileInput from "@/components/files/file_input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calculadora } from "./medidas_json"
import { Check } from "lucide-react";

const AntropometriaSchema = z.object({
  pacienteId: z.string().min(1, "ID do paciente é obrigatório"),
  nomePaciente: z.string().min(1, "Nome do paciente é obrigatório"),
  dataAvaliacao: z.string().min(1, "Data da avaliação é obrigatória"),
  dataNascimento: z
    .string({ required_error: "A data de nascimento deve ser preenchida" })
    .min(1, "A data de nascimento deve ser preenchida"),
  idade: z
    .number({ required_error: "A idade deve ser preenchida" })
    .refine(val => val !== undefined, { message: "A idade deve ser preenchida" }),
  sexo: z.string().min(1, "O sexo é obrigatório"),

  // medidas
  dobra_tricipal: z.number().optional(),
  peso_corporal: z
    .number({ required_error: "O peso deve ser preenchido" })
    .refine(val => val !== undefined, { message: "O peso deve ser preenchido" }),
  estatura_metros: z
    .number({ required_error: "A estatura deve ser preenchida" })
    .refine(val => val !== undefined, { message: "A estatura deve ser preenchida" }),
  circunferencia_braco: z.number().optional(),
  circunferencia_cintura: z.number().optional(),

  // medidas tabela
  dobra_tricipal_tabela: z.number().optional(),
  peso_tabela: z.number().optional(),
  estatura_tabela: z.number().optional(),
  circunferencia_braco_tabela: z.number().optional(),
  circunferencia_cintura_tabela: z.number().optional(),

  // escore-z
  estatura_escore_z: z.number().optional(),
  circunferencia_cintura_escore_z: z.number().optional(),
  imc_escore_z: z.number().optional(),
  circunferencia_braco_escore_z: z.number().optional(),
  dobra_tricipal_escore_z: z.number().optional(),
  peso_escore_z: z.number().optional(),

  // Resultados calculados
  imc: z.number().optional(),
  massa_magra: z.number().optional(),
  area_muscular_braco: z.number().optional(),

  // Bioimpedância
  gordura_corporal_bioimpedância_porcentagem_valor: z.string().optional(),
  gordura_corporal_bioimpedância_porcentagem_diagnostico: z.string().optional(),
  gordura_corporal_bioimpedância_kg_valor: z.string().optional(),
  gordura_corporal_bioimpedância_kg_diagnostico: z.string().optional(),
  massa_magra_bioimpedância_kg_valor: z.string().optional(),
  massa_magra_bioimpedância_kg_diagnostico: z.string().optional(),
  massa_magra_bioimpedância_porcentagem_valor: z.string().optional(),
  massa_magra_bioimpedância_porcentagem_diagnostico: z.string().optional(),
  agua_corporal_bioimpedância_litros_valor: z.string().optional(),
  agua_corporal_bioimpedância_litros_diagnostico: z.string().optional(),
  agua_corporal_bioimpedância_porcentagem_valor: z.string().optional(),
  agua_corporal_bioimpedância_porcentagem_diagnostico: z.string().optional(),
  agua_na_massa_magra_porcentagem_valor: z.string().optional(),
  agua_na_massa_magra_porcentagem_diagnostico: z.string().optional(),
  resistencia_r_ohms_valor: z.string().optional(),
  resistencia_r_ohms_diagnostico: z.string().optional(),
  reatancia_xc_ohms_valor: z.string().optional(),
  reatancia_xc_ohms_diagnostico: z.string().optional(),

  
  anexar: z.array(z.instanceof(File)).optional(),
  

  // Classificações
  classificacao_peso: z.string().optional(),
  classificacao_estatura: z.string().optional(),
  classificacao_imc: z.string().optional(),

  circunferencia_braco_classificacao: z.string().optional(),
  dobra_tricipal_classificacao: z.string().optional(),
  circunferencia_cintura_classificacao: z.string().optional(),

  // Observações
  observacoes: z.string().optional(),
})

type AntropometriaData = z.infer<typeof AntropometriaSchema>

export default function AntropometriaForm() {
  const [calculando, setCalculando] = useState(false)
  const [tabelaCalculada, setTabelaCalculada] = useState(false);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [buscaNome, setBuscaNome] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const nomeContainerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { control, watch, setValue } = useForm();
  const gordura = watch('gordura_corporal_bioimpedância_porcentagem_valor');
  const userId = session?.user?.id;
  

  useEffect(() => {
    if (!gordura || gordura === '') {
      setValue('gordura_corporal_bioimpedância_porcentagem_diagnostico', '');
      return
    }
    

    const sexo = form.getValues('sexo')
    const valor = Number(gordura)

    let diagnostico = ''

    if (sexo === 'Masculino') {
      diagnostico = valor >= 25 ? 'Obeso' : 'Não obeso'
    } else {
      diagnostico = valor >= 30 ? 'Obeso' : 'Não obeso'
    }

    setValue('gordura_corporal_bioimpedância_porcentagem_diagnostico', diagnostico)
  }, [gordura, setValue])

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
      const res = await fetch(`/api/patients/search?nome=${encodeURIComponent(buscaNome)}`);
      const data = await res.json();
      setPacientes(data);
    }, 400);
    return () => clearTimeout(timeout);
  }, [buscaNome]);


  const form = useForm<AntropometriaData>({
    resolver: zodResolver(AntropometriaSchema),
    defaultValues: {
      pacienteId: "",
      nomePaciente: "",
      dataAvaliacao: new Date().toISOString().split("T")[0],
      peso_corporal: undefined,
      estatura_metros: undefined,
      circunferencia_braco: undefined,
      dobra_tricipal: undefined,
      imc: undefined,
      sexo: "",
      dataNascimento: "",
      classificacao_peso: "",
      classificacao_estatura: "",
      classificacao_imc: "",
      observacoes: "",
      anexar: [],
      gordura_corporal_bioimpedância_porcentagem_valor: undefined,
      gordura_corporal_bioimpedância_porcentagem_diagnostico: undefined,
      gordura_corporal_bioimpedância_kg_valor: undefined,
      gordura_corporal_bioimpedância_kg_diagnostico: undefined,
      massa_magra_bioimpedância_kg_valor: undefined,
      massa_magra_bioimpedância_kg_diagnostico: undefined,
      massa_magra_bioimpedância_porcentagem_valor: undefined,
      massa_magra_bioimpedância_porcentagem_diagnostico: undefined,
      agua_corporal_bioimpedância_litros_valor: undefined,
      agua_corporal_bioimpedância_litros_diagnostico: undefined,
      agua_corporal_bioimpedância_porcentagem_valor: undefined,
      agua_corporal_bioimpedância_porcentagem_diagnostico: undefined,
      agua_na_massa_magra_porcentagem_valor: undefined,
      agua_na_massa_magra_porcentagem_diagnostico: undefined,
      resistencia_r_ohms_valor: undefined,
      resistencia_r_ohms_diagnostico: undefined,
      reatancia_xc_ohms_valor: undefined,
      reatancia_xc_ohms_diagnostico: undefined,
      estatura_escore_z: undefined,
      circunferencia_cintura_escore_z: undefined,
      imc_escore_z: undefined,
      circunferencia_braco_escore_z: undefined,
      dobra_tricipal_escore_z: undefined,
      peso_escore_z: undefined,
      peso_tabela: undefined,
      estatura_tabela: undefined,
      circunferencia_braco_tabela: undefined,
      circunferencia_cintura_tabela: undefined,
      dobra_tricipal_tabela: undefined,
      massa_magra: undefined,
      area_muscular_braco: undefined,

    },
  })

  const calcularIMC = () => {
    const peso = form.getValues("peso_corporal")
    const altura = form.getValues("estatura_metros")

    if (peso && altura) {
      const imc = peso / (altura * altura)
      form.setValue("imc", Number.parseFloat(imc.toFixed(2)))

      // Classificação básica de IMC
      let classificacao = ""
      if (imc < 18.5) classificacao = "Abaixo do peso"
      else if (imc < 25) classificacao = "Peso normal"
      else if (imc < 30) classificacao = "Sobrepeso"
      else if (imc < 35) classificacao = "Obesidade Grau I"
      else if (imc < 40) classificacao = "Obesidade Grau II"
      else classificacao = "Obesidade Grau III"

      form.setValue("classificacao_imc", classificacao)
    }
  }


  function limparNaN(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(limparNaN);
    } else if (obj && typeof obj === "object") {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, limparNaN(value)])
      );
    } else if (typeof obj === "number" && isNaN(obj)) {
      return undefined;
    }
    return obj;
  }

  const calcularDadosTabela = () => {
    setTabelaCalculada(true);

    const peso = form.getValues("peso_corporal");
    const estatura_metros = form.getValues("estatura_metros");
    const idade = pegaIdade(form.getValues("dataNascimento"), form.getValues("dataAvaliacao"));
    const homem = form.getValues("sexo") == 'Masculino';

    var imc = peso / (estatura_metros * estatura_metros);
    var imcStr = imc.toFixed(1);
    imc = parseFloat(imcStr);



    form.setValue("imc", imc);
    form.setValue("imc_escore_z", calculaZ(idade, imc, 'imc', homem) || undefined);
    form.setValue("classificacao_imc", classificarZImc(1, idade, imc) ?? "");

    var zPeso = calculaZ(idade, peso, 'peso', homem);
    var classificacaoPeso = classificarZPeso(zPeso, idade);

    form.setValue("peso_tabela", peso);
    form.setValue("peso_escore_z", zPeso || undefined);
    form.setValue("classificacao_peso", classificacaoPeso || "");

    var zEstatura = calculaZ(idade, estatura_metros * 100, 'altura', homem);
    var classificacaoEstatura = classificarZAltura(zEstatura, idade);

    form.setValue("estatura_tabela", estatura_metros);
    form.setValue("estatura_escore_z", zEstatura || undefined);
    form.setValue("classificacao_estatura", classificacaoEstatura || "");


    form.setValue("circunferencia_braco_tabela", form.getValues("circunferencia_braco"));
    form.setValue("circunferencia_cintura_tabela", form.getValues("circunferencia_cintura"));
    form.setValue("dobra_tricipal_tabela", form.getValues("dobra_tricipal"));
  }

  const preencherDadosPaciente = async (id: string, setBusca: boolean = true) => {

    const response = await fetch(`/api/patients/${id}`);
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    const nascimento = data.dataNascimento?.slice(0, 10) ?? "";
    form.setValue("pacienteId", String(data.id));
    form.setValue("nomePaciente", data.nome);

    if (setBusca) {
      setBuscaNome(data.nome);
    }

    form.setValue("dataNascimento", nascimento);
    form.setValue(
      "sexo",
      data.sexo
        ? data.sexo.toLowerCase().charAt(0).toUpperCase() + data.sexo.toLowerCase().slice(1)
        : ""
    );


    if (nascimento) {
      const hoje = new Date();
      const nasc = new Date(nascimento);
      let idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
      }
      form.setValue("idade", idade);
    }

  }

  const onSubmit = async (data: AntropometriaData) => {
    try {
      const toastId = toast.loading("Salvando informações...");
      const dataLimpa = limparNaN(data);
      if (!tabelaCalculada) {
        calcularDadosTabela();
      }

      const calculadoraPayload: Calculadora = {
        id: crypto.randomUUID(),
        patientId: Number(dataLimpa.pacienteId) || undefined,
        userId: userId,
        observacoes: dataLimpa.observacoes || "",
        medidasAntropometricas: {
          IMC: {
            valor: dataLimpa.imc,
            escoreZ: dataLimpa.imc_escore_z,
            classificacao: dataLimpa.classificacao_imc
          },
          Peso: {
            valor: dataLimpa.peso_corporal,
            escoreZ: dataLimpa.peso_escore_z,
            classificacao: dataLimpa.classificacao_peso
          },
          Estatura: {
            valor: dataLimpa.estatura_metros,
            escoreZ: dataLimpa.estatura_escore_z,
            classificacao: dataLimpa.classificacao_estatura
          },
          CircunferenciaBraco: {
            valor: dataLimpa.circunferencia_braco,
            escoreZ: dataLimpa.circunferencia_braco_escore_z,
            classificacao: dataLimpa.circunferencia_braco_classificacao
          },
          CircunferenciaCintura: {
            valor: dataLimpa.circunferencia_cintura,
            escoreZ: dataLimpa.circunferencia_cintura_escore_z,
            classificacao: dataLimpa.circunferencia_cintura_classificacao
          },
          DobraTricipital: {
            valor: dataLimpa.dobra_tricipal,
            escoreZ: dataLimpa.dobra_tricipal_escore_z,
            classificacao: dataLimpa.dobra_tricipal_classificacao
          },

        },
        bioimpedancia: {
          percentualGordura: Number(dataLimpa.gordura_corporal_bioimpedância_porcentagem_valor) || undefined,
          massaGorda: Number(dataLimpa.gordura_corporal_bioimpedância_kg_valor) || undefined,
          massaMagra: Number(dataLimpa.massa_magra_bioimpedância_kg_valor) || undefined,
          percentualMassaMagra: Number(dataLimpa.massa_magra_bioimpedância_porcentagem_valor) || undefined,
          aguaCorporal: Number(dataLimpa.agua_corporal_bioimpedância_litros_valor) || undefined,
          aguaCorporalPorcentagem: Number(dataLimpa.agua_corporal_bioimpedância_porcentagem_valor) || undefined,
          aguaMassaMagra: Number(dataLimpa.agua_na_massa_magra_porcentagem_valor) || undefined,
          resistencia: Number(dataLimpa.resistencia_r_ohms_valor) || undefined,
          reatancia: Number(dataLimpa.reatancia_xc_ohms_valor) || undefined,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/calculadora", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calculadoraPayload),
      });
      
      if (!response.ok) {
        const erro = await response.json();
        alert("Erro ao salvar: " + (erro.error || "Erro desconhecido"));
        return;
      }

      const dadosCalculadora = await response.json();
      const arquivos = Array.isArray(data.anexar) ? data.anexar : [data.anexar];
      
      if(arquivos.length >= 1) {
        const formData = new FormData();

        arquivos.forEach((arquivo) => {
          if (arquivo) formData.append("files", arquivo);
        });

        const arquivoRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        

        if (!arquivoRes.ok) {
         
          const erro = await arquivoRes.json();
          alert("Erro ao fazer upload: " + (erro.error || "Erro desconhecido"));
          return;
        }

        const arquivosUpload = await arquivoRes.json();

        const arquivosId = arquivosUpload.files.map((arquivo : any) => arquivo.id);

        const calculadoraAnexosPayload = {
          calculadoraId: dadosCalculadora.id,
          arquivoIds: arquivosId
        };

        const anexosCalculadoraRes = await fetch("/api/calculadora-arquivos", {
          method: "POST",
          body: JSON.stringify(calculadoraAnexosPayload),
          headers: {
            "Content-Type": "application/json"
          },
        });

        if(!anexosCalculadoraRes.ok) {
          const erro = await anexosCalculadoraRes.json();
          alert("Erro ao salvar anexos: " + (erro.error || "Erro desconhecido"));
        }
      }

      
      toast.success("Informações salvas com sucesso!", { id: toastId });
      form.reset();
      setShowSuccessDialog(true)
    } catch (error) {
      alert("Erro ao salvar os dados!");
    }
  }

  return (
    <Card className="max-w-4xl mx-auto my-8 shadow-md">
      <CardHeader className="bg-teal-50">
        <CardTitle className="text-xl font-semibold text-teal-800">Avaliação Antropométrica</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Dados do Paciente */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Dados do Paciente</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <FormField
                  control={form.control}
                  name="nomePaciente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Nome do Paciente</FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }} ref={nomeContainerRef}>
                          <Input
                            placeholder="Digite o nome do paciente"
                            className="border-teal-300"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setBuscaNome(e.target.value);
                            }}
                          />

                          {pacientes.length > 0 && (
                            <ul
                              className="absolute z-10 w-full bg-white border border-teal-300 rounded-md shadow-md max-h-52 overflow-y-auto p-0 mt-0.5"
                              style={{ borderTop: "2px solid transparent" }}
                            >
                              {pacientes.map((p) => (
                                <li
                                  key={p.id}
                                  className="px-4 py-2 cursor-pointer border-b border-gray-200 hover:bg-teal-50 transition"
                                  onClick={() => {
                                    setPacientes([]);
                                    field.onChange(p.nome);
                                    preencherDadosPaciente(p.id, false);
                                  }}
                                >
                                  {p.nome}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pacienteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">ID do Paciente</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o ID do paciente"
                          className="border-teal-300"
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value) {
                              preencherDadosPaciente(e.target.value)
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataAvaliacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Data da Avaliação</FormLabel>
                      <FormControl>
                        <Input type="date" className="border-teal-300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-teal-300"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Idade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Idade"
                          className="border-teal-300 focus:ring-teal-500"
                          {...field}
                          readOnly
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseInt(e.target.value, 10) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Sexo</FormLabel>
                      <FormControl>
                        <Input placeholder="Sexo" className="border-teal-300" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Medidas Antropométricas */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Medidas Antropométricas</h2>
              <Separator className="bg-teal-200" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="peso_corporal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Peso Corporal (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Digite o peso"
                          className="border-teal-300"
                          required
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estatura_metros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Estatura (metros)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Digite a estatura"
                          className="border-teal-300"
                          required
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="circunferencia_braco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Circunferência do Braço (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="circunferencia_cintura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Circunferência da Cintura (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dobra_tricipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-teal-800">Dobra Tricipital (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Digite a medida"
                          className="border-teal-300"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 transition"
                  onClick={async () => {
                    const valid = await form.trigger(["peso_corporal", "estatura_metros", "dataNascimento"]);
                    if (valid) {
                      calcularDadosTabela();
                    }
                  }}
                >
                  Calcular
                </button>
              </div>

            </section>


            <section className="space-y-4">

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-teal-800">Medida</TableHead>
                    <TableHead className="font-medium text-teal-800">Valor</TableHead>
                    <TableHead className="font-medium text-teal-800">Valor escore-z</TableHead>
                    <TableHead className="font-medium text-teal-800">Diagnóstico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Circunferência da Cintura (cm)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="circunferencia_cintura_tabela"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="circunferencia_cintura_escore_z"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="circunferencia_cintura_classificacao"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Circunferência do Braço (cm)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="circunferencia_braco_tabela"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="circunferencia_braco_escore_z"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="circunferencia_braco_classificacao"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Dobra Tricipital (mm)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="dobra_tricipal_tabela"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="dobra_tricipal_escore_z"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="dobra_tricipal_classificacao"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>IMC (kg/m²)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="imc"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="imc_escore_z"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined || isNaN(field.value) ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="classificacao_imc"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Peso (kg) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="peso_tabela"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="peso_escore_z"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="classificacao_peso"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Estatura</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="estatura_tabela"
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.01"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="estatura_escore_z"
                        render={({ field }) => (
                          <Input
                            type="number"
                            className="border-teal-300 h-8"
                            readOnly
                            {...field}
                            value={field.value === undefined ? "" : field.value}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="classificacao_estatura"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" readOnly {...field} />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>


            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700"> Bioimpedância </h2>
              <Separator className="bg-teal-200" />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-teal-800">Medida</TableHead>
                    <TableHead className="font-medium text-teal-800">Valor</TableHead>
                    <TableHead className="font-medium text-teal-800">Diagnóstico</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {/* % gordura corporal */}
                  <TableRow>
                    <TableCell>% gordura corporal bioimpedância (%) </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name="gordura_corporal_bioimpedância_porcentagem_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name="gordura_corporal_bioimpedância_porcentagem_diagnostico"

                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Gordura corporal (kg) */}
                  <TableRow>
                    <TableCell>Gordura corporal bioimpedância (kg) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="gordura_corporal_bioimpedância_kg_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="gordura_corporal_bioimpedância_kg_diagnostico"
                        render={({ field }) => (
                          <Input type="number" step="0.01" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Massa magra (kg) */}
                  <TableRow>
                    <TableCell>Massa magra bioimpedância (kg) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="massa_magra_bioimpedância_kg_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="massa_magra_bioimpedância_kg_diagnostico"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* % massa magra */}
                  <TableRow>
                    <TableCell>% massa magra bioimpedância (%) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="massa_magra_bioimpedância_porcentagem_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="massa_magra_bioimpedância_porcentagem_diagnostico"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Água corporal (litros) */}
                  <TableRow>
                    <TableCell>Água corporal bioimpedância (litros) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="agua_corporal_bioimpedância_litros_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="agua_corporal_bioimpedância_litros_diagnostico"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* % água corporal */}
                  <TableRow>
                    <TableCell>% água corporal bioimpedância (%) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="agua_corporal_bioimpedância_porcentagem_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="agua_corporal_bioimpedância_porcentagem_diagnostico"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* % água na massa magra */}
                  <TableRow>
                    <TableCell>% água na massa magra (%) </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="agua_na_massa_magra_porcentagem_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="agua_na_massa_magra_porcentagem_diagnostico"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Resistência */}
                  <TableRow>
                    <TableCell>Resistência (R) (Ohms)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="resistencia_r_ohms_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="resistencia_r_ohms_diagnostico"
                        render={({ field }) => (
                          <Input type="number" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>

                  {/* Reatância */}
                  <TableRow>
                    <TableCell>Reatância (Xc) (Ohms)</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="reatancia_xc_ohms_valor"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="reatancia_xc_ohms_diagnostico"
                        render={({ field }) => (
                          <Input type="text" className="border-teal-300 h-8" {...field} readOnly />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>


            {/* Observações */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-teal-700">Observações</h2>
              <Separator className="bg-teal-200" />
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Observações Adicionais</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[100px] p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Digite observações adicionais sobre a avaliação antropométrica"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FileInput
                name="anexar"
                control={form.control}
                label="Anexar Documentos"
                multiple
              />


            </section>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                Salvar Avaliação Antropométrica
              </Button>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    As informações foram salvas com sucesso.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}