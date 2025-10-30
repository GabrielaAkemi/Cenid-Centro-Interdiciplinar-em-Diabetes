import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Check } from 'lucide-react';


const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto w-full bg-white p-8 space-y-8 rounded-lg shadow-xl border border-gray-100">
    {children}
  </div>
);
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="p-0">{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-8">{children}</h1>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div className="p-0">{children}</div>;
const Separator = () => <div className="h-[2px] my-6 bg-blue-100" />;


const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={`p-3.5 w-full border border-gray-400 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 text-gray-800 ${className}`}
    {...props}
  />
));
Input.displayName = 'Input';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`p-3.5 focus:ring-4 focus:ring-blue-300 min-h-[120px] w-full border border-gray-400 rounded-md shadow-sm transition-colors duration-200 text-gray-800 ${className}`}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, variant = 'default', ...props }, ref) => {
  let baseClasses = 'w-full sm:w-auto px-8 py-3.5 font-bold rounded-lg shadow-lg transition-all duration-300 transform active:scale-95';
  let variantClasses = '';

  switch (variant) {
    case 'default':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02]';
      break;
    case 'outline':
      variantClasses = 'bg-white border border-gray-400 text-gray-700 hover:bg-gray-50';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent text-gray-700 hover:bg-gray-100 shadow-none';
      break;
  }

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="radio"
    className={`h-4 w-4 text-blue-900 border-gray-400 focus:ring-blue-500 cursor-pointer ${className}`}
    {...props}
  />
));
RadioGroupItem.displayName = 'RadioGroupItem';

const RadioGroup = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (value: string) => void, defaultValue?: string, value?: string }) => (
    <div className={`flex flex-col space-y-2 ${className}`} {...props}>
        {children}
    </div>
);


const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => <table className={`min-w-full overflow-hidden border-collapse rounded-lg border border-gray-400 ${className}`} {...props} />;
const TableHeader = ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-blue-50" {...props} />;
const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => <th className={`px-4 py-3 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider ${className}`} {...props} />;
const TableBody = ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className="bg-white divide-y divide-gray-200" {...props} />;
const TableRow = ({ ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr className="hover:bg-gray-50 transition-colors" {...props} />;
const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-800 ${className}`} {...props} />;

const Dialog = ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => (
    open ? (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => onOpenChange(false)}>
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    ) : null
);
const DialogContent = ({ children }: { children: React.ReactNode }) => children;


const AlimentoSchema = z.object({
  tipo: z.enum(["nunca", "mensal", "semanal", "diario", ""]),
  valor: z.string().optional(),
});

const NutricaoSchema = z
  .object({
    nome: z.string().min(1, 'O nome do paciente deve ser preenchido'),
    idade: z.string().optional(),
    idadeMeses: z.string().optional(),
    metodoContagem: z.string().optional(),
    nomeAplicativo: z.string().optional(),
    frequenciaAlimentar: z.record(z.string(), AlimentoSchema).optional(),
    recordatorioAlimentar: z.string().optional(),
    anexoRecordatorio: z.any().optional(),
    avaliacaoNutricional: z.string().optional(),
    recomendacoes: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.metodoContagem ||
      data.metodoContagem !== 'aplicativos' ||
      (data.nomeAplicativo && data.nomeAplicativo !== ''),
    {
      message:
        'O nome do aplicativo deve ser especificado quando o método de contagem é por aplicativos',
      path: ['nomeAplicativo'],
    }
  );

type NutricaoFormValues = z.infer<typeof NutricaoSchema>;
type AlimentoKey = keyof NonNullable<NutricaoFormValues['frequenciaAlimentar']>;
type FrequenciaAlimentar = NonNullable<NutricaoFormValues['frequenciaAlimentar']>;

const alimentosFrequenciaMap = [
    { id: 'paoMassas', nome: 'Pão e massas' },
    { id: 'arrozCereais', nome: 'Arroz e cereais' },
    { id: 'tuberculos', nome: 'Tubérculos' },
    { id: 'frutasSucosNaturais', nome: 'Frutas e sucos naturais' },
    { id: 'verduras', nome: 'Verduras' },
    { id: 'legumes', nome: 'Legumes' },
    { id: 'carneVermelha', nome: 'Carne Vermelha' },
    { id: 'aves', nome: 'Aves' },
    { id: 'peixes', nome: 'Peixes' },
    { id: 'ovos', nome: 'Ovos' },
    { id: 'leiteDerivados', nome: 'Leite e produtos lácteos' },
    { id: 'leguminosas', nome: 'Leguminosas (ex: feijão, soja, grão-de-bico, etc.)' },
    { id: 'embutidos', nome: 'Embutidos (ex: salsicha, linguiça, etc.)' },
    { id: 'frituras', nome: 'Frituras' },
    { id: 'lanches', nome: 'Lanches' },
    { id: 'doces', nome: 'Doces' },
    { id: 'refrigerante', nome: 'Refrigerante' },
    { id: 'chips', nome: 'Salgadinho tipo "chips"' },
    { id: 'adocantes', nome: 'Adoçantes' },
    { id: 'sucoPo', nome: 'Suco em pó' },
    { id: 'alimentosProntos', nome: 'Alimentos prontos (ex: miojo)' },
];

const macronutrientes = [
    { nome: 'Carboidrato' },
    { nome: 'Açucar' },
    { nome: 'Proteína' },
    { nome: 'Gordura Total' },
    { nome: 'Saturada' },
    { nome: 'Monoinsaturada' },
    { nome: 'Polinsaturada' },
    { nome: 'Fibras', min: '25', max: '38', vet: 'não se aplica' },
];

export default function App() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const defaultFrequencia = useMemo(() => {
    return alimentosFrequenciaMap.reduce((acc, current) => {
      acc[current.id as AlimentoKey] = { tipo: '', valor: '' };
      return acc;
    }, {} as FrequenciaAlimentar);
  }, []);

  const form = useForm<NutricaoFormValues>({
    resolver: zodResolver(NutricaoSchema),
    defaultValues: {
      nome: '',
      idade: '',
      idadeMeses: '',
      metodoContagem: 'nao-realiza',
      nomeAplicativo: '',
      frequenciaAlimentar: defaultFrequencia,
      recordatorioAlimentar: '',
      avaliacaoNutricional: '',
      recomendacoes: '',
    },
    mode: 'onBlur'
  });

  const { control, handleSubmit, setValue, getValues, formState: { errors } } = form;
  
  const metodoContagemWatch = useWatch({ control, name: 'metodoContagem' });


  const onSubmit = (data: NutricaoFormValues) => {
    console.log('Dados do Formulário Submetidos:', data);
    setShowSuccessDialog(true);
  };

  const atualizarFrequenciaAlimentar = useCallback(
    (alimento: AlimentoKey, campo: 'tipo' | 'valor', valor: string) => {
      const currentFrequencia = getValues('frequenciaAlimentar') || {};
      
      const newFrequencia = {
        ...currentFrequencia,
        [alimento]: {
          ...currentFrequencia[alimento],
          [campo]: valor,
        },
      };

      if (campo === 'tipo') {
        if (valor === 'nunca' || valor === 'diario') {
            newFrequencia[alimento].valor = '';
        } else if (valor === 'mensal' || valor === 'semanal') {
            newFrequencia[alimento].tipo = valor;
        } else {
            newFrequencia[alimento].tipo = '';
            newFrequencia[alimento].valor = '';
        }
      }

      if (campo === 'valor' && valor !== '') {
        const currentType = currentFrequencia[alimento]?.tipo;
        if (currentType !== 'mensal' && currentType !== 'semanal') {
        }
      }


      setValue('frequenciaAlimentar', newFrequencia, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setValue('anexoRecordatorio', file, { shouldValidate: true });
  };


  return (
    <div className="flex flex-col min-h-screen bg-white font-sans p-6 md:p-10 text-gray-800">
      <Card>
        <CardTitle>Avaliação de Nutrição</CardTitle>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">Dados do Paciente</h3>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                    <label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-1 block">Nome do Paciente *</label>
                    <Controller
                        name="nome"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="nome"
                                placeholder="Digite o nome completo"
                                {...field}
                            />
                        )}
                    />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                    <label htmlFor="idade" className="text-sm font-medium text-gray-700 mb-1 block">Idade (anos)</label>
                    <Controller
                        name="idade"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="idade"
                                type="number"
                                placeholder="0"
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                                {...field}
                            />
                        )}
                    />
                </div>
                <div>
                    <label htmlFor="idadeMeses" className="text-sm font-medium text-gray-700 mb-1 block">Idade (meses)</label>
                    <Controller
                        name="idadeMeses"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="idadeMeses"
                                type="number"
                                placeholder="0"
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                                {...field}
                            />
                        )}
                    />
                </div>
              </div>
            </section>
            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">Razão de CHO</h3>
              <Separator />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Gramas/unidade de insulina</TableHead>
                      <TableHead className="w-1/3">Horário inicial</TableHead>
                      <TableHead className="w-1/3">Horário final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Input type="number" placeholder="Ex: 15" /></TableCell>
                        <TableCell><Input type="time" /></TableCell>
                        <TableCell><Input type="time" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">Fator de sensibilidade (FS)</h3>
              <Separator />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">mg/dL por unidade de insulina</TableHead>
                      <TableHead className="w-1/3">Horário inicial</TableHead>
                      <TableHead className="w-1/3">Horário final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Input type="number" placeholder="Ex: 50" /></TableCell>
                        <TableCell><Input type="time" /></TableCell>
                        <TableCell><Input type="time" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">MÉTODO DE CONTAGEM DE CARBOIDRATO</h3>
              <Separator />
              
              <Controller
                name="metodoContagem"
                control={control}
                render={({ field }) => (
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="space-y-4"
                    >
                        {['nao-realiza', 'tabelas', 'aplicativos'].map((value) => (
                            <div key={value} className="flex items-center space-x-3">
                                <RadioGroupItem
                                    value={value}
                                    id={`metodo-${value}`}
                                    checked={field.value === value}
                                    onChange={() => field.onChange(value)}
                                />
                                <label htmlFor={`metodo-${value}`} className="font-medium text-gray-800 uppercase cursor-pointer">
                                    {value.replace('-', ' ').toUpperCase()}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                )}
              />
              
              {errors.metodoContagem && <p className="text-red-500 text-xs mt-1">{errors.metodoContagem.message}</p>}
              
              {metodoContagemWatch === 'aplicativos' && (
                <div className="mt-4 max-w-md">
                    <label htmlFor="nomeAplicativo" className="text-sm font-medium text-gray-700 mb-1 block">SE APLICATIVO, QUAL?</label>
                    <Controller
                        name="nomeAplicativo"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="nomeAplicativo"
                                placeholder="Digite o nome do aplicativo"
                                {...field}
                            />
                        )}
                    />
                    {errors.nomeAplicativo && <p className="text-red-500 text-xs mt-1">{errors.nomeAplicativo.message}</p>}
                </div>
              )}
            </section>

            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">
                ESTIMATIVA da NECESSIDADE ENERGÉTICA DIÁRIA (NED) (Kcal/dia)
              </h3>
              <Separator />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">IDADE/SEXO</TableHead>
                      <TableHead className="w-1/2">NED (Kcal/dia)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="h-10">Ex: 10-14 Anos, Masculino</TableCell>
                      <TableCell className="h-10"><Input type="number" placeholder="Ex: 2279" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">ANÁLISE DA FREQUÊNCIA ALIMENTAR</h3>
              <Separator />
              <h4 className="text-base font-medium text-gray-700">
                FREQUÊNCIA ALIMENTAR (para mensal e semanal registar número de dias)
              </h4>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4 min-w-[200px]">Tipos de alimento</TableHead>
                      <TableHead className="text-center">Nunca</TableHead>
                      <TableHead className="text-center min-w-[100px]">Mensal</TableHead>
                      <TableHead className="text-center min-w-[100px]">Semanal</TableHead>
                      <TableHead className="text-center">Diário</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alimentosFrequenciaMap.map((alimento) => (
                        <Controller
                            key={alimento.id}
                            name={`frequenciaAlimentar.${alimento.id}`}
                            control={control}
                            render={({ field }) => {
                                const currentValue = field.value || { tipo: '', valor: '' };
                                
                                const handleRadioChange = (tipo: 'nunca' | 'diario') => {
                                    atualizarFrequenciaAlimentar(alimento.id as AlimentoKey, 'tipo', tipo);
                                };

                                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'mensal' | 'semanal') => {
                                    const valor = e.target.value;
                                    atualizarFrequenciaAlimentar(alimento.id as AlimentoKey, 'tipo', tipo);
                                    atualizarFrequenciaAlimentar(alimento.id as AlimentoKey, 'valor', valor);
                                };
                                
                                return (
                                    <TableRow>
                                        <TableCell className="font-medium text-blue-900">{alimento.nome}</TableCell>
                                        
                                        <TableCell className="text-center">
                                            <RadioGroup
                                                value={currentValue.tipo === 'nunca' ? 'nunca' : ''}
                                                onValueChange={() => handleRadioChange('nunca')}
                                                className="flex justify-center"
                                            >
                                                <RadioGroupItem value="nunca" id={`${alimento.id}-nunca`} onChange={() => handleRadioChange('nunca')} checked={currentValue.tipo === 'nunca'}/>
                                            </RadioGroup>
                                        </TableCell>
                                        
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder='dias'
                                                value={currentValue.tipo === 'mensal' ? currentValue.valor : ''}
                                                onChange={(e) => handleInputChange(e, 'mensal')}
                                            />
                                        </TableCell>
                                        
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder='dias'
                                                value={currentValue.tipo === 'semanal' ? currentValue.valor : ''}
                                                onChange={(e) => handleInputChange(e, 'semanal')}
                                            />
                                        </TableCell>
                                        
                                        <TableCell className="text-center">
                                            <RadioGroup
                                                value={currentValue.tipo === 'diario' ? 'diario' : ''}
                                                onValueChange={() => handleRadioChange('diario')}
                                                className="flex justify-center"
                                            >
                                                <RadioGroupItem value="diario" id={`${alimento.id}-diario`} onChange={() => handleRadioChange('diario')} checked={currentValue.tipo === 'diario'}/>
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                );
                            }}
                        />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>

            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">RECORDATÓRIO ALIMENTAR</h3>
              <Separator />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">ANEXAR ARQUIVO</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-4 text-center">Arraste e solte arquivos aqui ou clique para selecionar</p>
                  <Controller
                    name="anexoRecordatorio"
                    control={control}
                    render={() => (
                      <Input
                        type="file"
                        accept=".pdf"
                        className="max-w-xs block w-full border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-900 hover:file:bg-blue-200 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    )}
                  />
                  {getValues('anexoRecordatorio') && (
                      <p className='text-xs mt-2 text-green-600 font-semibold'>Arquivo anexado: {getValues('anexoRecordatorio').name}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="recordatorioAlimentar" className="text-sm font-medium text-gray-700 mb-1 block">REGISTRAR DADOS DO RECORDATÓRIO ALIMENTAR</label>
                <Controller
                  name="recordatorioAlimentar"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="recordatorioAlimentar"
                      placeholder="Descreva o recordatório alimentar do paciente..."
                      {...field}
                    />
                  )}
                />
                {errors.recordatorioAlimentar && <p className="text-red-500 text-xs mt-1">{errors.recordatorioAlimentar.message}</p>}
              </div>
            </section>
            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">RESUMO DO RECORDATÓRIO ALIMENTAR</h3>
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center font-bold text-blue-900 text-lg border-b-2 border-gray-200 pb-2">INGERIDO</div>
                <div className="text-center font-bold text-blue-900 text-lg border-b-2 border-gray-200 pb-2">RECOMENDADO</div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MACRONUTRIENTES</TableHead>
                      <TableHead>Gramas/dia</TableHead>
                      <TableHead>Kcal/dia</TableHead>
                      <TableHead>Total Kcal/dia</TableHead>
                      <TableHead>Gramas/dia (mínimo)</TableHead>
                      <TableHead>Gramas/dia (máximo)</TableHead>
                      <TableHead>% do VET</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {macronutrientes.map((macro, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold text-blue-900">{macro.nome}</TableCell>
                        <TableCell><Input type='number' /></TableCell>
                        <TableCell><Input type='number' /></TableCell>
                        <TableCell><Input type='number' /></TableCell>
                        <TableCell>{macro.min || <Input type='number' />}</TableCell>
                        <TableCell>{macro.max || <Input type='number' />}</TableCell>
                        <TableCell>{macro.vet || <Input type='number' />}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className='mt-6 border border-gray-400 rounded-lg'>
                  <Table className='border-none'>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold text-blue-900 w-2/3">
                          Total de ingestão (Kcal/dia) estimada pelo recordatório alimentar (TIC)
                        </TableCell>
                        <TableCell className='w-1/3'><Input type='number' readOnly className='bg-gray-100 cursor-not-allowed' /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
              </div>
            </section>
            

            <section className="p-4 space-y-6">
              <h3 className="text-xl font-bold text-blue-900">AVALIAÇÃO CLÍNICA E PRESCRIÇÃO DIETÉTICA NUTRIÇÃO</h3>
              <Separator />
              
              <div>
                <label htmlFor="avaliacaoNutricional" className="text-sm font-medium text-gray-700 mb-1 block">HIPÓTESE DIAGNÓSTICA NUTRICIONAL</label>
                <p className="text-sm text-gray-500 mb-2">
                  Apresentação da avaliação nutricional em relação ao padrão alimentar observado
                </p>
                <Controller
                  name="avaliacaoNutricional"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="avaliacaoNutricional"
                      placeholder="Apresentação:"
                      {...field}
                    />
                  )}
                />
                {errors.avaliacaoNutricional && <p className="text-red-500 text-xs mt-1">{errors.avaliacaoNutricional.message}</p>}
              </div>
              
              <div>
                <label htmlFor="recomendacoes" className="text-sm font-medium text-gray-700 mb-1 block">CONDUTA NUTRICIONAL</label>
                <p className="text-sm text-gray-500 mb-2">
                  Descrição das recomendações dietéticas sugeridas aos pacientes
                </p>
                <Controller
                  name="recomendacoes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="recomendacoes"
                      placeholder="Descreva:"
                      {...field}
                    />
                  )}
                />
                {errors.recomendacoes && <p className="text-red-500 text-xs mt-1">{errors.recomendacoes.message}</p>}
              </div>
            </section>
            
            <div className="flex justify-center pt-4">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Salvar Avaliação
              </Button>
            </div>
            
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className='h-8 w-8 text-green-600'/>
              </div>
              <p className="text-xl font-bold text-blue-900 text-center mb-4">
                Avaliação salva com sucesso!
              </p>
              <Button 
                type="button" 
                className="bg-blue-900 hover:bg-blue-800" 
                onClick={() => setShowSuccessDialog(false)}
              >
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
