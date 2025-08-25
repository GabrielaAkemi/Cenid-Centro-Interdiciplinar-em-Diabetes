

"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AvaliacaoFarmaciaSchema = z.object({
  // Dados básicos
  data: z.date().optional(),
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  idade: z.string().optional(),

  // Método de administração de insulina
  metodoAdministracao: z.string().optional(),
  insulinaBasal: z.string().optional(),
  insulinaBolus: z.string().optional(),

  // Adesão ao tratamento com insulina
  adesaoInsulina1: z.string().default("0"),
  adesaoInsulina2: z.string().default("0"),
  adesaoInsulina3: z.string().default("0"),
  adesaoInsulina4: z.string().default("0"),

  // Medicamentos (array de 5 medicamentos)
  medicamentos: z
    .array(
      z.object({
        nomeComercial: z.string().optional(),
        principioAtivo: z.string().optional(),
        comPrescricao: z.string().optional(),
        tempoUso: z.string().optional(),
        dataInicio: z.date().optional(),
        dataTermino: z.date().optional(),
        finalidadeUso: z.string().optional(),
        posologias: z
          .array(
            z.object({
              dose: z.string().optional(),
              horario: z.string().optional(),
              jejum: z.string().optional(),
            }),
          )
          .length(4),
        adesao1: z.string().default("0"),
        adesao2: z.string().default("0"),
        adesao3: z.string().default("0"),
        adesao4: z.string().default("0"),
      }),
    )
    .length(5),
})

type AvaliacaoFarmaciaFormValues = z.infer<typeof AvaliacaoFarmaciaSchema>

export default function FormularioAvaliacaoFarmacia() {
  const form = useForm<AvaliacaoFarmaciaFormValues>({
    resolver: zodResolver(AvaliacaoFarmaciaSchema),
    defaultValues: {
      adesaoInsulina1: "0",
      adesaoInsulina2: "0",
      adesaoInsulina3: "0",
      adesaoInsulina4: "0",
      medicamentos: Array(5).fill({
        nomeComercial: "",
        principioAtivo: "",
        comPrescricao: "",
        tempoUso: "",
        finalidadeUso: "",
        posologias: Array(4).fill({
          dose: "",
          horario: "",
          jejum: "",
        }),
        adesao1: "0",
        adesao2: "0",
        adesao3: "0",
        adesao4: "0",
      }),
    },
  })

  const onSubmit = (data: AvaliacaoFarmaciaFormValues) => {
    console.log(data)
  }

  // Função para calcular o escore de adesão à insulina
  const calcularEscoreInsulinaAdesao = () => {
    const adesao1 = form.watch("adesaoInsulina1") === "0" ? 1 : 0
    const adesao2 = form.watch("adesaoInsulina2") === "0" ? 1 : 0
    const adesao3 = form.watch("adesaoInsulina3") === "0" ? 1 : 0
    const adesao4 = form.watch("adesaoInsulina4") === "0" ? 1 : 0

    return adesao1 + adesao2 + adesao3 + adesao4
  }

  // Função para determinar o nível de adesão com base no escore
  const determinarNivelAdesao = (escore: number) => {
    if (escore === 4) return "Máxima"
    if (escore === 3) return "Alta"
    if (escore === 2) return "Média"
    if (escore === 1) return "Baixa"
    return "Mínima"
  }

  // Função para calcular o escore de adesão ao medicamento
  const calcularEscoreMedicamentoAdesao = (index: number) => {
    const adesao1 = form.watch(`medicamentos.${index}.adesao1`) === "0" ? 1 : 0
    const adesao2 = form.watch(`medicamentos.${index}.adesao2`) === "0" ? 1 : 0
    const adesao3 = form.watch(`medicamentos.${index}.adesao3`) === "0" ? 1 : 0
    const adesao4 = form.watch(`medicamentos.${index}.adesao4`) === "0" ? 1 : 0

    return adesao1 + adesao2 + adesao3 + adesao4
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-teal-700">AVALIAÇÃO FARMÁCIA</h1>
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-teal-800">Data</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          type="date"
                          className="border-teal-300 focus:ring-teal-500"
                          value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined
                            field.onChange(date)
                          }}
                        />
                      </FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" className="border-teal-300 focus:ring-teal-500">
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-teal-800">Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome completo"
                        className="border-teal-300 focus:ring-teal-500"
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
                    <FormLabel className="text-teal-800">Idade (anos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite a idade"
                        className="border-teal-300 focus:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Método de administração de insulina */}
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="metodoAdministracao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-800">Método de administração de insulina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                              <SelectValue placeholder="Selecione o método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="caneta">Caneta</SelectItem>
                            <SelectItem value="seringa">Seringa</SelectItem>
                            <SelectItem value="bomba">Bomba de insulina</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="insulinaBasal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-800">Insulina Basal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a insulina basal"
                            className="border-teal-300 focus:ring-teal-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="insulinaBolus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-teal-800">Insulina Bolus</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite a insulina bolus"
                            className="border-teal-300 focus:ring-teal-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Adesão ao tratamento da terapia com insulina */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-teal-700 mb-4">
                Adesão ao tratamento da terapia com insulina.
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-4/5">Perguntas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1. Você já se esqueceu de tomar alguma dose de insulina?</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina1"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina1-sim" />
                                  <FormLabel htmlFor="adesaoInsulina1-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina1-nao" />
                                  <FormLabel htmlFor="adesaoInsulina1-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      2. Você é negligente com o horário de aplicação das injeções de insulina conforme prescrito pelo
                      seu médico?
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina2"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina2-sim" />
                                  <FormLabel htmlFor="adesaoInsulina2-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina2-nao" />
                                  <FormLabel htmlFor="adesaoInsulina2-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3. Você às vezes para de tomar insulina quando se sente melhor?</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina3"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina3-sim" />
                                  <FormLabel htmlFor="adesaoInsulina3-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina3-nao" />
                                  <FormLabel htmlFor="adesaoInsulina3-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      4. Você às vezes aumenta ou diminui a dose de insulina quando não se sente bem sem o
                      aconselhamento do seu médico?
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="adesaoInsulina4"
                        render={({ field }) => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="1" id="adesaoInsulina4-sim" />
                                  <FormLabel htmlFor="adesaoInsulina4-sim" className="font-normal">
                                    Sim
                                  </FormLabel>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <RadioGroupItem value="0" id="adesaoInsulina4-nao" />
                                  <FormLabel htmlFor="adesaoInsulina4-nao" className="font-normal">
                                    Não
                                  </FormLabel>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-yellow-50">
                    <TableCell className="font-medium">Avaliação da adesão para insulina</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-around">
                        <div>
                          <span className="font-semibold">Escore</span>
                          <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                            {calcularEscoreInsulinaAdesao()}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold">Adesão</span>
                          <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                            {determinarNivelAdesao(calcularEscoreInsulinaAdesao())}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Informação sobre medicamentos a investigar */}
            <div className="mb-6 bg-yellow-50 p-4 rounded-md text-sm">
              <p className="text-gray-700">
                <strong>Importante, fazer a investigação sobre os seguintes medicamento:</strong> Inibidores da
                dipeptidil peptidase-4 (DPP4- gliplitinas); Inibidores do Cotransportador de Sódio-Glicose-1/2
                (SGLT-1/2i - dapaglofozina - Forxiga); Inibidores do Cotransportador de Sódio-Glicose-2 (SGLT-2i-
                empaglifozina - Jardiance); GLYXAMBI (empaglifozina e linaglipitina); GLYXAMBI (empaglifozina e
                linaglipitina); Qterm (saxaglipitina e dapaglifozina); e; agonistas do receptor de GLP-1 (liraglutida
                (Saxenda®), dulaglutida (Trulicity®), exenatida, lixisenatida e tirzepatida (Mounjaro®)).
              </p>
            </div>

            {/* Perfil de medicamentos em uso */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-teal-700 mb-4">Perfil de medicamentos em uso</h3>

              {/* Repetir para cada medicamento (5 vezes) */}
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="mb-10 border border-teal-200 rounded-md p-4">
                  <h4 className="text-md font-semibold text-teal-700 mb-4 bg-yellow-200 p-2 rounded">
                    {index + 1}. Medicamento (nome comercial)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.nomeComercial`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Nome comercial</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o nome comercial"
                              className="border-teal-300 focus:ring-teal-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.principioAtivo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-teal-800">Princípio ativo</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Digite o princípio ativo"
                                  className="border-teal-300 focus:ring-teal-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name={`medicamentos.${index}.comPrescricao`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-teal-800">Com prescrição médica</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sim">Sim</SelectItem>
                                  <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.tempoUso`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Tempo de uso</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 6 meses, 2 anos"
                              className="border-teal-300 focus:ring-teal-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.dataInicio`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Data início</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input
                                type="date"
                                className="border-teal-300 focus:ring-teal-500"
                                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : undefined
                                  field.onChange(date)
                                }}
                              />
                            </FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="border-teal-300 focus:ring-teal-500">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`medicamentos.${index}.dataTermino`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-teal-800">Data término</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input
                                type="date"
                                className="border-teal-300 focus:ring-teal-500"
                                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : undefined
                                  field.onChange(date)
                                }}
                              />
                            </FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="border-teal-300 focus:ring-teal-500">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date("1900-01-01")}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`medicamentos.${index}.finalidadeUso`}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-teal-800">Finalidade do uso (origem da prescrição ou não)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva a finalidade do uso"
                            className="border-teal-300 focus:ring-teal-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Posologia */}
                  <div className="mb-4">
                    <h5 className="text-md font-semibold text-teal-700 mb-2">Posologia</h5>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-teal-800">Posologia</TableHead>
                          <TableHead className="text-teal-800">Dose</TableHead>
                          <TableHead className="text-teal-800">Horário</TableHead>
                          <TableHead className="text-teal-800">Jejum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[0, 1, 2, 3].map((posIndex) => (
                          <TableRow key={posIndex}>
                            <TableCell>Posologia {posIndex + 1}</TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`medicamentos.${index}.posologias.${posIndex}.dose`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Dose"
                                        className="border-teal-300 focus:ring-teal-500"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`medicamentos.${index}.posologias.${posIndex}.horario`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Horário"
                                        className="border-teal-300 focus:ring-teal-500"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`medicamentos.${index}.posologias.${posIndex}.jejum`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="border-teal-300 focus:ring-teal-500">
                                          <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="sim">Sim</SelectItem>
                                        <SelectItem value="nao">Não</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Adesão ao tratamento medicamento */}
                  <div>
                    <h5 className="text-md font-semibold text-teal-700 mb-2">
                      Adesão ao tratamento medicamento adaptado de Morisky
                    </h5>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-4/5">Perguntas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>1. Você já se esqueceu de tomar alguma dose do medicamento?</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao1`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao1-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao1-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao1-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao1-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            2. Você é negligente com o horário de tomar a medicação conforme prescrito pelo seu médico?
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao2`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao2-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao2-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao2-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao2-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>3. Você às vezes para de tomar a medicação quando se sente melhor?</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao3`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao3-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao3-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao3-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao3-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            4. Você às vezes aumenta ou diminui a dose da medicação quando não se sente bem sem o
                            aconselhamento do seu médico?
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medicamentos.${index}.adesao4`}
                              render={({ field }) => (
                                <FormItem className="flex justify-center">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="1" id={`med${index}adesao4-sim`} />
                                        <FormLabel htmlFor={`med${index}adesao4-sim`} className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="0" id={`med${index}adesao4-nao`} />
                                        <FormLabel htmlFor={`med${index}adesao4-nao`} className="font-normal">
                                          Não
                                        </FormLabel>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-yellow-50">
                          <TableCell className="font-medium">Avaliação da adesão ao tratamento medicamentoso</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-around">
                              <div>
                                <span className="font-semibold">Escore</span>
                                <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                                  {calcularEscoreMedicamentoAdesao(index)}
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold">Adesão</span>
                                <div className="bg-yellow-200 px-3 py-1 rounded-md font-bold">
                                  {determinarNivelAdesao(calcularEscoreMedicamentoAdesao(index))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
                Salvar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}