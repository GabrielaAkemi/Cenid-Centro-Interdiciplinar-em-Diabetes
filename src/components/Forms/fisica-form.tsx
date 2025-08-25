"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

const FormularioEducacaoFisica: React.FC = () => {
  const [formData, setFormData] = useState({
    dataConsulta: "",
    nomeCompleto: "",
    dataAvaliacao: "",
    sexo: "",
    idade: "",
    peso: "",
    estatura: "",
    metodoInsulina: "",
    atividadeLeve: "",
    atividadeModerada: "",
    atividadeVigorosa: "",
    tempoSentado: "",
    tempoDormindo: "",
    tempoAtividade: "",
    relatorioInterrupcoes: "",
    prescricaoExercicio: "",
    forcaMaoDominante: { medida1: "", medida2: "", medida3: "" },
    forcaMaoNaoDominante: { medida1: "", medida2: "", medida3: "" },
    forcaLombar: { medida1: "", medida2: "", medida3: "" },
    cronograma: {
      segunda: { horario: "", tipo: "" },
      terca: { horario: "", tipo: "" },
      quarta: { horario: "", tipo: "" },
      quinta: { horario: "", tipo: "" },
      sexta: { horario: "", tipo: "" },
      sabado: { horario: "", tipo: "" },
      domingo: { horario: "", tipo: "" },
    },
  })

  const calcularNAF = () => {
    const leve = Number(formData.atividadeLeve) || 0
    const moderada = Number(formData.atividadeModerada) || 0
    const vigorosa = Number(formData.atividadeVigorosa) || 0
    const total = leve + moderada + vigorosa

    if (total === 0) return "Sedentário"
    if (total > 0 && total < 150) return "Pouco ativo"
    if (total >= 150 && total <= 300) return "Ativo"
    if (total > 300) return "Muito ativo"
    return "Sedentário"
  }

  const calcularMedia = (medidas: { medida1: string; medida2: string; medida3: string }) => {
    const valores = [Number(medidas.medida1), Number(medidas.medida2), Number(medidas.medida3)].filter((v) => v > 0)
    return valores.length > 0 ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1) : "0"
  }

  const calcularForcaRelativa = (medidas: { medida1: string; medida2: string; medida3: string }) => {
    const peso = Number(formData.peso) || 1
    const valores = [Number(medidas.medida1), Number(medidas.medida2), Number(medidas.medida3)].filter((v) => v > 0)
    if (valores.length === 0 || peso === 0) return "0"
    const maiorValor = Math.max(...valores)
    return (maiorValor / peso).toFixed(3)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do formulário:", formData)
    alert("Formulário enviado com sucesso!")
  }

  const diasSemana = [
    { key: "segunda", label: "2ª feira" },
    { key: "terca", label: "3ª feira" },
    { key: "quarta", label: "4ª feira" },
    { key: "quinta", label: "5ª feira" },
    { key: "sexta", label: "6ª feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-teal-600">EDUCAÇÃO FÍSICA</CardTitle>
          <CardDescription className="text-center">
            A avaliação da Educação Física completa deverá ser realizada com intervalo mínimo de 6 meses e máximo de 12
            meses. Porém neste intervalo de tempo a avaliação poderá ser complementada com orientações de sobre
            exercício físico.
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">DATA DA CONSULTA (OBRIGATÓRIO)</CardTitle>
            <CardDescription className="text-red-500">
              NÃO ABRIR OUTROS CAMPOS SE ESTE NÃO FOR PREENCHIDO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="dataConsulta">Data da consulta</Label>
              <Input
                id="dataConsulta"
                type="date"
                value={formData.dataConsulta}
                onChange={(e) => setFormData({ ...formData, dataConsulta: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">Dados do paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome completo</Label>
              <Input
                id="nomeCompleto"
                placeholder="Digite o nome completo"
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataAvaliacao">Data da avaliação</Label>
                <Input
                  id="dataAvaliacao"
                  type="date"
                  value={formData.dataAvaliacao}
                  onChange={(e) => setFormData({ ...formData, dataAvaliacao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idade">Idade (anos)</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="0"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estatura">Estatura (metros)</Label>
                <Input
                  id="estatura"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.estatura}
                  onChange={(e) => setFormData({ ...formData, estatura: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodoInsulina">Método de administração de insulina</Label>
              <Select
                value={formData.metodoInsulina}
                onValueChange={(value) => setFormData({ ...formData, metodoInsulina: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SICI">SICI</SelectItem>
                  <SelectItem value="MDI">MDI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">
              2. Questionário de avaliação do comportamento e do nível de atividade física (NAF)
            </CardTitle>
            <CardDescription>
              Considerar o comportamento de atividade física atual. Registrar o tempo em minutos por semana de acordo
              com a intensidade da atividade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="atividadeLeve" className="text-teal-600 font-medium">
                Atividade Leve (minutos/semana)
              </Label>
              <p className="text-sm text-muted-foreground">
                Caminhada como forma de lazer, exercício físico e ou deslocamento para atividades cotidianas com
                frequência respiratória pouco acima dos níveis de repouso (considerar apenas ações com duração mínima de
                10 minutos contínua)
              </p>
              <Input
                id="atividadeLeve"
                type="number"
                placeholder="0"
                value={formData.atividadeLeve}
                onChange={(e) => setFormData({ ...formData, atividadeLeve: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atividadeModerada" className="text-teal-600 font-medium">
                Atividade Moderada (minutos/semana)
              </Label>
              <p className="text-sm text-muted-foreground">
                Prática de exercício físico e ou atividades esportivas em intensidade moderada como pedalar ou nadar a
                velocidade regular, jogar bola, vôlei, basquete, tênis ou outro esporte com frequência respiratória
                moderada (considerar apenas ações com duração mínima de 10 minutos contínuo)
              </p>
              <Input
                id="atividadeModerada"
                type="number"
                placeholder="0"
                value={formData.atividadeModerada}
                onChange={(e) => setFormData({ ...formData, atividadeModerada: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atividadeVigorosa" className="text-teal-600 font-medium">
                Atividade Vigorosa (minutos/semana)
              </Label>
              <p className="text-sm text-muted-foreground">
                Prática de exercício físico e ou atividades esportivas em intensidade elevada como treinamento de força
                (musculação, crossfit, funcional), treinamento esportivo competitivo ou corrida, ciclismo ou natação com
                alta frequência respiratória (considerar apenas ações com duração mínima de 10 minutos contínua)
              </p>
              <Input
                id="atividadeVigorosa"
                type="number"
                placeholder="0"
                value={formData.atividadeVigorosa}
                onChange={(e) => setFormData({ ...formData, atividadeVigorosa: e.target.value })}
              />
            </div>

            <Separator />

            <h4 className="font-semibold text-teal-600">Parâmetros de comportamento sedentário</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tempoSentado" className="text-teal-600 font-medium">
                  Tempo sentado (horas/dia)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tempo que costuma permanecer na posição sentada estudando, enquanto descansa, fazendo lição de casa,
                  visitando um amigo, lendo, sentado ou deitado assistindo TV, fazendo uso do computador ou celular
                  durante um dia normal.
                </p>
                <Input
                  id="tempoSentado"
                  type="number"
                  step="0.5"
                  placeholder="0"
                  value={formData.tempoSentado}
                  onChange={(e) => setFormData({ ...formData, tempoSentado: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempoDormindo" className="text-teal-600 font-medium">
                  Tempo dormindo (horas/dia)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Tempo que costuma permanecer na posição deitada para dormir
                </p>
                <Input
                  id="tempoDormindo"
                  type="number"
                  step="0.5"
                  placeholder="0"
                  value={formData.tempoDormindo}
                  onChange={(e) => setFormData({ ...formData, tempoDormindo: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Análise do NAF</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Exercício Físico (min/semana)</p>
                  <p className="text-2xl font-bold">
                    {(Number(formData.atividadeLeve) || 0) +
                      (Number(formData.atividadeModerada) || 0) +
                      (Number(formData.atividadeVigorosa) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NAF</p>
                  <p className="text-2xl font-bold">{calcularNAF()}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>0 = sedentário | &gt;0 e &lt;150 = pouco ativo | 150 a 300 = ativo | &gt;300 = muito ativo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">
              Relatos de exercício físico atual relacionado com o questionário de atividade física
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-semibold border-b pb-2">
                <div>Dia da semana</div>
                <div>Horário</div>
                <div>Tipo (indicação do esporte, academia ou outro)</div>
              </div>

              {diasSemana.map((dia) => (
                <div key={dia.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <span className="text-sm font-medium">{dia.label}</span>
                  </div>
                  <Input
                    placeholder="Horário"
                    value={formData.cronograma[dia.key as keyof typeof formData.cronograma].horario}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cronograma: {
                          ...formData.cronograma,
                          [dia.key]: {
                            ...formData.cronograma[dia.key as keyof typeof formData.cronograma],
                            horario: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Tipo (esporte, academia, etc.)"
                    value={formData.cronograma[dia.key as keyof typeof formData.cronograma].tipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cronograma: {
                          ...formData.cronograma,
                          [dia.key]: {
                            ...formData.cronograma[dia.key as keyof typeof formData.cronograma],
                            tipo: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tempoAtividade" className="text-teal-600 font-medium">
                  O comportamento de atividade física relatado está ocorrendo a quantos meses?
                </Label>
                <Input
                  id="tempoAtividade"
                  type="number"
                  placeholder="0"
                  value={formData.tempoAtividade}
                  onChange={(e) => setFormData({ ...formData, tempoAtividade: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatorioInterrupcoes" className="text-teal-600 font-medium">
                  Relate abaixo sobre períodos de interrupção e retomada da atividade física:
                </Label>
                <Textarea
                  id="relatorioInterrupcoes"
                  placeholder="Descreva os períodos de interrupção e retomada..."
                  value={formData.relatorioInterrupcoes}
                  onChange={(e) => setFormData({ ...formData, relatorioInterrupcoes: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">3 - Avaliação do condicionamento físico</CardTitle>
            <CardDescription>Medidas de desempenho de Força</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-4 font-semibold border-b pb-2 text-sm min-w-max">
                <div>Medida</div>
                <div>Medida 1</div>
                <div>Medida 2</div>
                <div>Medida 3</div>
                <div>Média</div>
                <div>Força relativa (kg/peso)</div>
              </div>

              <div className="grid grid-cols-6 gap-4 items-center py-2 min-w-max">
                <div className="font-medium text-sm">Força da mão dominante (kg)</div>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaMaoDominante.medida1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaMaoDominante: { ...formData.forcaMaoDominante, medida1: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaMaoDominante.medida2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaMaoDominante: { ...formData.forcaMaoDominante, medida2: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaMaoDominante.medida3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaMaoDominante: { ...formData.forcaMaoDominante, medida3: e.target.value },
                    })
                  }
                />
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                  {calcularMedia(formData.forcaMaoDominante)}
                </div>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                  {calcularForcaRelativa(formData.forcaMaoDominante)}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 items-center py-2 min-w-max">
                <div className="font-medium text-sm">Força da mão não dominante (kg)</div>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaMaoNaoDominante.medida1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaMaoNaoDominante: { ...formData.forcaMaoNaoDominante, medida1: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaMaoNaoDominante.medida2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaMaoNaoDominante: { ...formData.forcaMaoNaoDominante, medida2: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaMaoNaoDominante.medida3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaMaoNaoDominante: { ...formData.forcaMaoNaoDominante, medida3: e.target.value },
                    })
                  }
                />
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                  {calcularMedia(formData.forcaMaoNaoDominante)}
                </div>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                  {calcularForcaRelativa(formData.forcaMaoNaoDominante)}
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 items-center py-2 min-w-max">
                <div className="font-medium text-sm">Força Lombar (kg)</div>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaLombar.medida1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaLombar: { ...formData.forcaLombar, medida1: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaLombar.medida2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaLombar: { ...formData.forcaLombar, medida2: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  value={formData.forcaLombar.medida3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      forcaLombar: { ...formData.forcaLombar, medida3: e.target.value },
                    })
                  }
                />
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                  {calcularMedia(formData.forcaLombar)}
                </div>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center text-sm">
                  {calcularForcaRelativa(formData.forcaLombar)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">4- Prescrição de exercício físico:</CardTitle>
            <CardDescription>
              Realizar o breve relato sobre as orientações e prescrições de exercício fornecidas ao pacientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="prescricaoExercicio" className="text-teal-600 font-medium">
                Prescrição de exercício
              </Label>
              <Textarea
                id="prescricaoExercicio"
                placeholder="Descreva as orientações e prescrições de exercício físico..."
                className="min-h-32"
                value={formData.prescricaoExercicio}
                onChange={(e) => setFormData({ ...formData, prescricaoExercicio: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">5 – Anexo de exames completares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Espaço reservado para anexar exames complementares</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit">Salvar Avaliação</Button>
        </div>
      </form>
    </div>
  )
}

export { FormularioEducacaoFisica }
export default FormularioEducacaoFisica
