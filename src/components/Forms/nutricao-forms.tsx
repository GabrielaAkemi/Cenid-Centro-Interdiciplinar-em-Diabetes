"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Check, Plus, Minus } from 'lucide-react';

const Card = ({ className, children }: any) => (
    <div className={`max-w-5xl mx-auto w-full bg-white p-8 space-y-8 rounded-xl shadow-2xl border border-gray-100 ${className}`}>
        {children}
    </div>
);
const CardHeader = ({ children }: { children: React.ReactNode }) => <div className="p-0">{children}</div>;
const CardTitle = ({ children }: { children: React.ReactNode }) => <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-8">{children}</h1>;
const CardContent = ({ children }: { children: React.ReactNode }) => <div className="p-0">{children}</div>;
const Separator = ({ className }: any) => <div className={`h-[1px] my-6 bg-gray-200 ${className}`} />;


const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={`p-3.5 w-full border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 text-gray-800 ${className}`}
        {...props}
    />
));
Input.displayName = 'Input';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={`p-3.5 focus:ring-4 focus:ring-blue-300 min-h-[120px] w-full border border-gray-600 rounded-md shadow-sm transition-colors duration-200 text-gray-800 ${className}`}
        {...props}
    />
));
Textarea.displayName = 'Textarea';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, variant = 'default', ...props }, ref) => {
    let baseClasses = 'px-6 py-3 font-bold rounded-lg shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none';
    let variantClasses = '';

    switch (variant) {
        case 'default':
            variantClasses = 'bg-red-600 text-white hover:bg-red-700 hover:scale-[1.01]';
            break;
        case 'outline':
            variantClasses = 'bg-white border border-gray-400 text-gray-700 hover:bg-gray-50 shadow-none';
            break;
        case 'ghost':
            variantClasses = 'bg-transparent text-gray-700 hover:bg-gray-100 shadow-none';
            break;
        case 'icon':
            baseClasses = 'p-2 rounded-full transition-all duration-200';
            variantClasses = 'bg-blue-500 text-white hover:bg-blue-600 shadow-md';
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
        className={`h-4 w-4 text-red-600 border-gray-400 focus:ring-red-500 cursor-pointer ${className}`}
        {...props}
    />
));
RadioGroupItem.displayName = 'RadioGroupItem';

const RadioGroup = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (value: string) => void, defaultValue?: string, value?: string }) => (
    <div className={`flex flex-col space-y-2 ${className}`} {...props}>
        {children}
    </div>
);

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => <table className={`min-w-full overflow-hidden border-collapse rounded-lg border border-gray-600 ${className}`} {...props} />;
const TableHeader = ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-gray-50" {...props} />;
const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`} {...props} />;
const TableBody = ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className="bg-white divide-y divide-gray-200" {...props} />;
const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => <tr className={`hover:bg-gray-50 transition-colors ${className}`} {...props} />;
const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-900 ${className}`} {...props} />;

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

// Mocks para simular componentes externos (FileList, FileInput)
const CheckIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check" {...props}><path d="M20 6 9 17l-5-5"/></svg>;

const ListaAnexos = ({ attachments }: { attachments: any[] }) => (
    <div className='space-y-2 pt-2'>
        {attachments.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum exame anexado.</p>
        ) : (
            attachments.map((file, index) => (
                <div key={index} className="p-3 border border-gray-300 rounded-md bg-white shadow-sm flex items-center justify-between">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <CheckIcon className='h-4 w-4 text-green-600' />
                </div>
            ))
        )}
    </div>
);

const FileInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ multiple, ...props }, ref) => (
    <div >
        <input
            ref={ref}
            type="file"
            multiple={multiple}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            {...props}
        />
    </div>
));
FileInput.displayName = 'FileInput';


// --- Dados e Schema do Formulário (Mantidos) ---

const ComorbidadeSchema = z.object({
    nome: z.string().min(1, 'O nome da comorbidade é obrigatório'),
});

const RatioTimeSchema = z.object({
    valor: z.string().min(1, 'Valor obrigatório'),
    horaInicial: z.string().min(1, 'Hora inicial obrigatória'),
    horaFinal: z.string().min(1, 'Hora final obrigatória'),
});

const RespostaQualidadeAlimentarSchema = z.enum(['A', 'B', 'C', 'D']);
const RespostaFrequencia7DiasSchema = z.string().min(1, 'Obrigatório selecionar o dia'); // 1 a 7
const RespostaSimNaoSchema = z.enum(['Sim', 'Não']);
const RespostaRefeicaoSchema = z.boolean();

const NutricaoSchema = z
    .object({
        dataConsulta: z.string().min(1, 'Data da consulta é obrigatória'),
        // Campos preenchidos automaticamente/read-only (apenas para exibição)
        nome: z.string().optional(),
        sexo: z.string().optional(),
        peso: z.string().optional(),
        estatura: z.string().optional(),

        comorbidades: z.array(ComorbidadeSchema).optional(),

        idadeAnos: z.string().optional(),
        idadeMeses: z.string().optional(),
        
        // rCHOi e FS
        rCHOi: z.array(RatioTimeSchema).min(1, 'Razão de CHO é obrigatória'),
        fs: z.array(RatioTimeSchema).min(1, 'Fator de Sensibilidade é obrigatório'),

        // Método de Contagem
        metodoContagem: z.enum(['Não Realiza', 'Tabelas', 'Aplicativos']),
        nomeAplicativo: z.string().optional(),
        adesaoAplicativo: z.enum(['Total', 'Parcial']).optional(),

        // Necessidade Energética Diária
        naf: z.enum(['inativo', 'pouco ativo', 'ativo', 'muito ativo']),
        gestante: z.enum(['sim', 'nao']),
        lactante: z.enum(['sim', 'nao']),
        
        // Qualidade Alimentar - Usual (24 perguntas A/B/C/D)
        qualidadeUsual: z.record(z.string(), RespostaQualidadeAlimentarSchema),
        
        // Frequência Alimentar (5 perguntas de 7 dias)
        freqFrutas: RespostaFrequencia7DiasSchema,
        freqSucoNatural: RespostaFrequencia7DiasSchema,
        freqVerduraLegume: RespostaFrequencia7DiasSchema,
        freqFeijao: RespostaFrequencia7DiasSchema,
        freqRefrigeranteSucoArtificial: RespostaFrequencia7DiasSchema,

        // Quadro A - Comeu Ontem (7 perguntas Sim/Não)
        qaVerduras: RespostaSimNaoSchema,
        qaAboCenoura: RespostaSimNaoSchema,
        qaMamaoManga: RespostaSimNaoSchema,
        qaTomatePepino: RespostaSimNaoSchema,
        qaLaranjaBanana: RespostaSimNaoSchema,
        qaFeijao: RespostaSimNaoSchema,
        qaAmendoim: RespostaSimNaoSchema,

        // Quadro B - Comeu Ontem (13 perguntas Sim/Não)
        qbRefrigerante: RespostaSimNaoSchema,
        qbSucoCaixa: RespostaSimNaoSchema,
        qbRefrescoPo: RespostaSimNaoSchema,
        qbAchocolatado: RespostaSimNaoSchema,
        qbIogurteSabor: RespostaSimNaoSchema,
        qbSalgadinhoBiscoitoSalgado: RespostaSimNaoSchema,
        qbBiscoitoDoce: RespostaSimNaoSchema,
        qbChocolateSorvete: RespostaSimNaoSchema,
        qbSalsichaLinguica: RespostaSimNaoSchema,
        qbPaoForma: RespostaSimNaoSchema,
        qbMaionese: RespostaSimNaoSchema,
        qbMargarina: RespostaSimNaoSchema,
        qbMacarraoInstantaneo: RespostaSimNaoSchema,

        // Hábitos
        refeicaoDistraida: z.enum(['Sim', 'Não', 'Às vezes']),
        refeicoesDia: z.record(z.string(), RespostaRefeicaoSchema), // Map de refeições (true/false)

        // Anexo e Avaliação
        anexoExame: z.any().optional(), // Anexar EXAME
        hipoteseDiagnostica: z.string().min(1, 'Hipótese diagnóstica é obrigatória'),
        condutaNutricional: z.string().min(1, 'Conduta nutricional é obrigatória'),
    })
    .refine(
        (data) =>
            data.metodoContagem !== 'aplicativos' ||
            (data.nomeAplicativo && data.nomeAplicativo !== ''),
        {
            message: 'O nome do aplicativo deve ser especificado.',
            path: ['nomeAplicativo'],
        }
    )
    .refine(
        (data) =>
            data.metodoContagem !== 'aplicativos' ||
            data.adesaoAplicativo,
        {
            message: 'A adesão ao aplicativo é obrigatória.',
            path: ['adesaoAplicativo'],
        }
    );

type NutricaoFormValues = z.infer<typeof NutricaoSchema>;

// Mock data for initial fields (simulating automatic population)
const mockPatientData = {
    nome: 'João da Silva',
    sexo: 'Masculino',
    peso: '75.5',
    estatura: '1.78',
    idadeAnos: '25',
    idadeMeses: '3',
    // Mock para ter uma linha inicial nas tabelas
    rCHOi: [{ valor: '15', horaInicial: '06:00', horaFinal: '12:00' }],
    fs: [{ valor: '50', horaInicial: '12:00', horaFinal: '18:00' }],
    naf: 'pouco ativo' as 'pouco ativo',
    gestante: 'nao' as 'nao',
    lactante: 'nao' as 'nao',
};

const perguntasQualidadeUsual = [
    { id: 'q1', texto: 'Quando faço pequenos lanches ao longo do dia, costumo comer frutas ou castanhas.' },
    { id: 'q2', texto: 'Quando escolho frutas, verduras e legumes, dou preferência para aqueles que são de produção local.' },
    { id: 'q3', texto: 'Quando escolho frutas, legumes e verduras, dou preferência para aqueles que são orgânicos.' },
    { id: 'q4', texto: 'Costumo levar algum alimento comigo em caso de sentir fome ao longo do dia.' },
    { id: 'q5', texto: 'Costumo planejar as refeições que farei no dia.' },
    { id: 'q6', texto: 'Costumo variar o consumo de feijão por ervilha, lentilha ou grão de bico.' },
    { id: 'q7', texto: 'Na minha casa é comum usarmos farinha de trigo integral.' },
    { id: 'q8', texto: 'Costumo comer fruta no café da manhã ou no meio da manhã.' },
    { id: 'q9', texto: 'Costumo fazer minhas refeições sentado(a) à mesa.' },
    { id: 'q10', texto: 'Procuro realizar as refeições com calma.' },
    { id: 'q11', texto: 'Costumo participar do preparo dos alimentos na minha casa.' },
    { id: 'q12', texto: 'Na minha casa compartilhamos as tarefas que envolvem o preparo e consumo das refeições.' },
    { id: 'q13', texto: 'Costumo comprar alimentos em feiras livres ou feiras de rua.' },
    { id: 'q14', texto: 'Aproveito o horário das refeições para resolver outras coisas e acabo deixando de comer.' },
    { id: 'q15', texto: 'Costumo fazer as refeições à minha mesa de trabalho ou estudo.' },
    { id: 'q16', texto: 'Costumo fazer minhas refeições sentado(a) no sofá da sala ou na cama.' },
    { id: 'q17', texto: 'Costumo pular pelo menos uma das refeições principais (almoço e/ou jantar).' },
    { id: 'q18', texto: 'Costumo comer balas, chocolates e outras guloseimas.' },
    { id: 'q19', texto: 'Costumo beber sucos industrializados, como de caixinha, em pó, garrafa ou lata.' },
    { id: 'q20', texto: 'Costumo frequentar restaurantes fast-food ou lanchonetes.' },
    { id: 'q21', texto: 'Tenho o hábito de “beliscar” no intervalo entre as refeições.' },
    { id: 'q22', texto: 'Costumo beber refrigerante.' },
    { id: 'q23', texto: 'Costumo trocar a comida do almoço ou jantar por sanduíches, salgados ou pizza.' },
    { id: 'q24', texto: 'Quando bebo café ou chá, costumo colocar açúcar.' },
];

const refeicoesOpcoes = ['CafeDaManha', 'LancheDaManha', 'Almoco', 'LancheDaTarde', 'Jantar', 'LancheDaNoite'];

// --- Componente Principal ---

export default function App() {
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    
    // Simulação de estados externos necessários para a lógica de anexo
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [somenteLeitura, setSomenteLeitura] = useState(false); // Simulação de modo leitura (Pode ser true/false para testar a renderização condicional)
    const [attachments, setAttachments] = useState([{ name: 'exame_laboratorial_01.pdf' }, { name: 'glicemia_2023.jpg' }]); // Simulação de anexos

    // Inicialização do defaultValues para as perguntas de Qualidade Usual e Refeições
    const defaultQualidadeUsual = useMemo(() => {
        return perguntasQualidadeUsual.reduce((acc, current) => {
            acc[current.id] = 'A'; // Padrão "Nunca"
            return acc;
        }, {} as Record<string, 'A' | 'B' | 'C' | 'D'>);
    }, []);

    const defaultRefeicoes = useMemo(() => {
        return refeicoesOpcoes.reduce((acc, current) => {
            acc[current] = false;
            return acc;
        }, {} as Record<string, boolean>);
    }, []);


    const form = useForm<NutricaoFormValues>({
        resolver: zodResolver(NutricaoSchema),
        defaultValues: {
            dataConsulta: new Date().toISOString().substring(0, 10),
            ...mockPatientData,
            comorbidades: [{ nome: 'Diabetes Mellitus Tipo 1' }],
            metodoContagem: 'nao-realiza',
            rCHOi: mockPatientData.rCHOi,
            fs: mockPatientData.fs,
            naf: mockPatientData.naf,
            gestante: mockPatientData.gestante,
            lactante: mockPatientData.lactante,
            qualidadeUsual: defaultQualidadeUsual,
            freqFrutas: '7',
            freqSucoNatural: '7',
            freqVerduraLegume: '7',
            freqFeijao: '7',
            freqRefrigeranteSucoArtificial: '1',
            qaVerduras: 'Sim',
            qaAboCenoura: 'Sim',
            qaMamaoManga: 'Sim',
            qaTomatePepino: 'Sim',
            qaLaranjaBanana: 'Sim',
            qaFeijao: 'Sim',
            qaAmendoim: 'Sim',
            qbRefrigerante: 'Não',
            qbSucoCaixa: 'Não',
            qbRefrescoPo: 'Não',
            qbAchocolatado: 'Não',
            qbIogurteSabor: 'Não',
            qbSalgadinhoBiscoitoSalgado: 'Não',
            qbBiscoitoDoce: 'Não',
            qbChocolateSorvete: 'Não',
            qbSalsichaLinguica: 'Não',
            qbPaoForma: 'Não',
            qbMaionese: 'Não',
            qbMargarina: 'Não',
            qbMacarraoInstantaneo: 'Não',
            refeicaoDistraida: 'Não',
            refeicoesDia: defaultRefeicoes,
            hipoteseDiagnostica: '',
            condutaNutricional: '',
        },
        mode: 'onBlur'
    });

    const { control, handleSubmit, setValue, getValues, formState: { errors } } = form;
    
    // Watchers
    const metodoContagemWatch = useWatch({ control, name: 'metodoContagem' });
    const adesaoAplicativoWatch = useWatch({ control, name: 'adesaoAplicativo' });
    const anexoExameWatch = useWatch({ control, name: 'anexoExame' });

    // Field Arrays para tabelas dinâmicas (rCHOi e FS)
    const { fields: rCHOiFields, append: appendRCHOi, remove: removeRCHOi } = useFieldArray({ control, name: "rCHOi" });
    const { fields: fsFields, append: appendFS, remove: removeFS } = useFieldArray({ control, name: "fs" });
    const { fields: comorbidadeFields, append: appendComorbidade, remove: removeComorbidade } = useFieldArray({ control, name: "comorbidades" });

    const onSubmit = (data: NutricaoFormValues) => {
        console.log('Dados do Formulário Submetidos:', data);
        setShowSuccessDialog(true);
        // Simulação de como o fileInputRef seria usado em um app real:
        if (fileInputRef.current?.files) {
            console.log('Arquivos para upload:', fileInputRef.current.files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Esta função está agora ligada ao ref dentro do FileInput para fins de simulação
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            console.log('Arquivo selecionado (via ref simulado):', file.name);
        }
        // Nota: Em um formulário com react-hook-form, você geralmente usaria setValue aqui, 
        // mas estamos usando o ref para simular o componente externo FileInput.
    };

    // Função para calcular a pontuação da Qualidade Alimentar
    const calcularPontuacaoQualidadeUsual = useCallback((data: NutricaoFormValues) => {
        let pontuacao = 0;
        perguntasQualidadeUsual.forEach(({ id }, index) => {
            const resposta = data.qualidadeUsual[id];
            
            // Regra de pontuação consistente (A=3, B=2, C=1, D=0) para todas as 24 questões conforme o documento
            if (resposta === 'A') pontuacao += 3;
            else if (resposta === 'B') pontuacao += 2;
            else if (resposta === 'C') pontuacao += 1;
            // D = 0 (default)
        });
        return pontuacao;
    }, []);

    // Simulação do cálculo de pontuação para o usuário ver
    const totalPontuacao = useWatch({ control, name: 'qualidadeUsual' }) ? calcularPontuacaoQualidadeUsual(getValues()) : 0;
    
    // Função para renderizar o resultado da pontuação
    const renderResultadoPontuacao = (score: number) => {
        if (score > 41) {
            return <p className="text-green-800 font-bold">Excelente! Parece que você tem uma alimentação saudável, em diversos aspectos. Continue engajado, leia as quatro recomendações apresentadas a seguir e identifique os aspectos que você pode melhorar.</p>;
        }
        if (score >= 31 && score <= 41) {
            return <p className="text-yellow-700 font-bold">Siga em frente! Você está no meio do caminho para uma alimentação saudável. Leia as quatro recomendações apresentadas a seguir e identifique os aspectos que você pode melhorar.</p>;
        }
        return <p className="text-red-700 font-bold">Para ter uma alimentação saudável e prazerosa, você precisa mudar. Atenção às quatro recomendações apresentadas a seguir.</p>;
    };

    const DaySelector = ({ name, control, label }: { name: keyof NutricaoFormValues, control: any, label: string }) => (
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <label className="text-sm font-medium text-gray-700 block">{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                        {['1', '2', '3', '4', '5', '6', '7'].map((day) => (
                            <label key={day} className="flex items-center space-x-1.5 cursor-pointer p-2 rounded-md transition-colors duration-150"
                                style={{
                                    backgroundColor: field.value === day ? 'rgb(22 36 71)' : 'rgb(243 244 246)',
                                    color: field.value === day ? 'white' : 'rgb(55 65 81)',
                                    fontWeight: field.value === day ? 'bold' : 'normal',
                                }}
                            >
                                <RadioGroupItem
                                    value={day}
                                    id={`${name}-${day}`}
                                    checked={field.value === day}
                                    onChange={() => field.onChange(day)}
                                    className="hidden"
                                />
                                <span className="text-sm">{day}</span>
                            </label>
                        ))}
                    </div>
                )}
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{String(errors[name]?.message)}</p>}
        </div>
    );

    const SimNaoSelector = ({ name, control, label }: { name: keyof NutricaoFormValues, control: any, label: string }) => (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-800 font-medium sm:w-2/3 mb-2 sm:mb-0">{label}</p>
                    <div className="flex space-x-4 sm:w-1/3 justify-end">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                            <RadioGroupItem
                                value="Sim"
                                id={`${name}-sim`}
                                checked={field.value === 'Sim'}
                                onChange={() => field.onChange('Sim')}
                            />
                            <span className="text-sm text-gray-700">Sim</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                            <RadioGroupItem
                                value="Não"
                                id={`${name}-nao`}
                                checked={field.value === 'Não'}
                                onChange={() => field.onChange('Não')}
                            />
                            <span className="text-sm text-gray-700">Não</span>
                        </label>
                    </div>
                </div>
            )}
        />
    );


    return (
        <div className="flex flex-col min-h-screen bg-white font-sans p-6 md:p-10 text-gray-800">
            <Card>
            <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Avaliação Nutrição</h1>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                        
                        {/* --- Seção de Dados do Paciente (Pré-preenchidos) --- */}
                        <section className="p-4 space-y-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-bold text-blue-900">Dados da Consulta e Paciente (Pré-preenchidos)</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="dataConsulta" className="text-sm font-medium text-gray-700 mb-1 block">DATA DA CONSULTA *</label>
                                    <Controller
                                        name="dataConsulta"
                                        control={control}
                                        render={({ field }) => (
                                            <Input id="dataConsulta" type="date" {...field} />
                                        )}
                                    />
                                    {errors.dataConsulta && <p className="text-red-500 text-xs mt-1">{errors.dataConsulta.message}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="nome" className="text-sm font-medium text-gray-700 mb-1 block">Nome do Paciente</label>
                                    <Input id="nome" type="text" placeholder="Nome preenchido automaticamente" value={getValues('nome')} readOnly className="bg-gray-200 cursor-not-allowed border-gray-300" />
                                </div>
                                <div>
                                    <label htmlFor="sexo" className="text-sm font-medium text-gray-700 mb-1 block">Sexo</label>
                                    <Input id="sexo" type="text" placeholder="Preenchido automaticamente" value={getValues('sexo')} readOnly className="bg-gray-200 cursor-not-allowed border-gray-300" />
                                </div>
                                <div>
                                    <label htmlFor="idadeAnos" className="text-sm font-medium text-gray-700 mb-1 block">Idade (ANOS)</label>
                                    <Input id="idadeAnos" type="text" placeholder="Calculado" value={getValues('idadeAnos')} readOnly className="bg-gray-200 cursor-not-allowed border-gray-300" />
                                </div>
                                <div>
                                    <label htmlFor="idadeMeses" className="text-sm font-medium text-gray-700 mb-1 block">Idade (MESES)</label>
                                    <Input id="idadeMeses" type="text" placeholder="Calculado" value={getValues('idadeMeses')} readOnly className="bg-gray-200 cursor-not-allowed border-gray-300" />
                                </div>
                                <div>
                                    <label htmlFor="peso" className="text-sm font-medium text-gray-700 mb-1 block">PESO (KG)</label>
                                    <Input id="peso" type="text" placeholder="Preenchido automaticamente" value={getValues('peso')} readOnly className="bg-gray-200 cursor-not-allowed border-gray-300" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="estatura" className="text-sm font-medium text-gray-700 mb-1 block">ESTATURA (METROS)</label>
                                    <Input id="estatura" type="text" placeholder="Preenchido automaticamente" value={getValues('estatura')} readOnly className="bg-gray-200 cursor-not-allowed border-gray-300" />
                                </div>
                            </div>
                            
                            {/* Comorbidades */}
                            <div className="space-y-4 pt-4">
                                <h4 className="text-lg font-bold text-blue-900">Comorbidades (Opcional)</h4>
                                <div className="space-y-3">
                                    {comorbidadeFields.map((field, index) => (
                                        <div key={field.id} className="flex space-x-3 items-center">
                                            <Controller
                                                name={`comorbidades.${index}.nome`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        placeholder="Ex: Diabetes Mellitus Tipo 1"
                                                        {...field}
                                                        className="flex-grow"
                                                    />
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="icon"
                                                onClick={() => removeComorbidade(index)}
                                                className="bg-red-500 hover:bg-red-600 w-10 h-10 shadow-md"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => appendComorbidade({ nome: '' })}
                                        className="w-full text-blue-900 border-blue-400 hover:bg-blue-50"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Adicionar Comorbidade
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* --- Seção de Razão de CHO e Fator de Sensibilidade --- */}
                        <section className="p-4 space-y-6">
                            <h3 className="text-xl font-bold text-blue-900">Razão de CHO e Fator de Sensibilidade</h3>
                            <Separator />

                            {/* Razão de Carboidrato/Insulina (rCHOi) */}
                            <h4 className="text-lg font-bold text-gray-800 flex justify-between items-center">
                                Razão de carboidrato/insulina (rCHOi)
                                <Button type="button" variant="icon" onClick={() => appendRCHOi({ valor: '', horaInicial: '', horaFinal: '' })} className="h-8 w-8 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </h4>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/4 text-gray-700">Gramas/unidade de insulina</TableHead>
                                            <TableHead className="w-1/4 text-gray-700">Horário inicial</TableHead>
                                            <TableHead className="w-1/4 text-gray-700">Horário final</TableHead>
                                            <TableHead className="w-1/4 text-center text-gray-700">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rCHOiFields.map((field, index) => (
                                            <TableRow key={field.id}>
                                                <TableCell>
                                                    <Controller
                                                        name={`rCHOi.${index}.valor`}
                                                        control={control}
                                                        render={({ field }) => <Input type="number" placeholder="Ex: 15" {...field} />}
                                                    />
                                                    {errors.rCHOi?.[index]?.valor && <p className="text-red-500 text-xs mt-1">{errors.rCHOi[index]?.valor?.message}</p>}
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={`rCHOi.${index}.horaInicial`}
                                                        control={control}
                                                        render={({ field }) => <Input type="time" {...field} />}
                                                    />
                                                    {errors.rCHOi?.[index]?.horaInicial && <p className="text-red-500 text-xs mt-1">{errors.rCHOi[index]?.horaInicial?.message}</p>}
                                                </TableCell>
                                                <TableCell>
                                                    <Controller
                                                        name={`rCHOi.${index}.horaFinal`}
                                                        control={control}
                                                        render={({ field }) => <Input type="time" {...field} />}
                                                    />
                                                    {errors.rCHOi?.[index]?.horaFinal && <p className="text-red-500 text-xs mt-1">{errors.rCHOi[index]?.horaFinal?.message}</p>}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button type="button" variant="icon" onClick={() => removeRCHOi(index)} className="bg-gray-400 hover:bg-gray-500 w-8 h-8">
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Observação: permitir a inserção de linhas para variações de Razão de CHO por horários.</p>
                        </section>

                        {/* --- Seção Método de Contagem de Carboidrato --- */}
                        <section className="p-4 space-y-6">
                            <h3 className="text-xl font-bold text-blue-900">Método De Contagem De Carboidrato</h3>
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
                                                    {value.replace('-', ' ').toUpperCase()} {value === 'aplicativos' ? '. SE APLICATIVO, QUAL?' : ''}
                                                </label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                            {errors.metodoContagem && <p className="text-red-500 text-xs mt-1">{errors.metodoContagem.message}</p>}
                            
                            {(metodoContagemWatch === 'aplicativos') && (
                                <div className="mt-4 max-w-lg space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                                    <Controller
                                        name="nomeAplicativo"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <label htmlFor="nomeAplicativo" className="text-sm font-medium text-gray-700 mb-1 block">Nome do Aplicativo *</label>
                                                <Input
                                                    id="nomeAplicativo"
                                                    placeholder="Digite o nome do aplicativo"
                                                    {...field}
                                                />
                                                {errors.nomeAplicativo && <p className="text-red-500 text-xs mt-1">{errors.nomeAplicativo.message}</p>}
                                            </div>
                                        )}
                                    />
                                    
                                    <Controller
                                        name="adesaoAplicativo"
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex space-x-6 pt-2'>
                                                <label className="text-sm font-medium text-gray-700 block">Adesão ao uso do aplicativo: *</label>
                                                <div className='flex space-x-4'>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <RadioGroupItem
                                                            value="Total"
                                                            id="adesao-total"
                                                            checked={field.value === 'Total'}
                                                            onChange={() => field.onChange('Total')}
                                                        />
                                                        <span className="text-sm text-gray-800">Total</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <RadioGroupItem
                                                            value="Parcial"
                                                            id="adesao-parcial"
                                                            checked={field.value === 'Parcial'}
                                                            onChange={() => field.onChange('Parcial')}
                                                        />
                                                        <span className="text-sm text-gray-800">Parcial</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    />
                                    {errors.adesaoAplicativo && <p className="text-red-500 text-xs mt-1">{errors.adesaoAplicativo.message}</p>}
                                </div>
                            )}
                        </section>

                        {/* --- Seção de Necessidade Energética Diária (NED) --- */}
                        <section className="p-4 space-y-6">
                            <h3 className="text-xl font-bold text-blue-900">Estimativa da Necessidade Rnergética Diária (NED) (Kcal/dia)</h3>
                            <Separator />
                            <p className="text-sm text-gray-600">Utilizar dados da Ficha Antropométrica e NAF da ficha de Eduação Física</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nível de Atividade Física (NAF) */}
                                <Controller
                                    name="naf"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 block">Nível de atividade física:</label>
                                            <select
                                                {...field}
                                                className="p-3.5 w-full border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 text-gray-800 bg-white"
                                            >
                                                <option value="inativo">Inativo</option>
                                                <option value="pouco ativo">Pouco Ativo</option>
                                                <option value="ativo">Ativo</option>
                                                <option value="muito ativo">Muito Ativo</option>
                                            </select>
                                        </div>
                                    )}
                                />

                                {/* Gestante e Lactante */}
                                <div className='flex space-x-6'>
                                    <Controller
                                        name="gestante"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 block">Gestante:</label>
                                                <div className='flex space-x-4'>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <RadioGroupItem value="sim" checked={field.value === 'sim'} onChange={() => field.onChange('sim')} />
                                                        <span className="text-sm text-gray-800">Sim</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <RadioGroupItem value="nao" checked={field.value === 'nao'} onChange={() => field.onChange('nao')} />
                                                        <span className="text-sm text-gray-800">Não</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name="lactante"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 block">Lactante:</label>
                                                <div className='flex space-x-4'>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <RadioGroupItem value="sim" checked={field.value === 'sim'} onChange={() => field.onChange('sim')} />
                                                        <span className="text-sm text-gray-800">Sim</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <RadioGroupItem value="nao" checked={field.value === 'nao'} onChange={() => field.onChange('nao')} />
                                                        <span className="text-sm text-gray-800">Não</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            {/* Campo de NED (simulado) */}
                            <div className="max-w-md pt-4">
                                <label className="text-sm font-medium text-gray-700 mb-1 block">NED Calculada (Kcal/dia)</label>
                                <Input type="text" placeholder="Cálculo automático pela planilha do Excel/fórmulas" readOnly className='bg-gray-200 cursor-not-allowed border-gray-300' />
                            </div>

                        </section>

                        {/* --- Seção de Análise da Qualidade Alimentar - USUAL (Questionário) --- */}
                        <section className="p-4 space-y-6">
                            <h3 className="text-xl font-bold text-blue-900">Análise da Qualidade Alimentar - USUAL</h3>
                            <Separator />
                            <h4 className="text-base font-bold text-gray-800">Como está sua alimentação?</h4>
                            <div className="text-sm text-gray-700 flex justify-between px-2 font-mono border-b border-gray-300 pb-2">
                                <p>A= Nunca</p>
                                <p>B= Raramente</p>
                                <p>C= Muitas vezes</p>
                                <p>D= Sempre</p>
                            </div>

                            <div className="space-y-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
                                {perguntasQualidadeUsual.map((pergunta) => (
                                    <Controller
                                        key={pergunta.id}
                                        name={`qualidadeUsual.${pergunta.id}`}
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-200 last:border-b-0">
                                                <p className="text-sm text-gray-800 font-medium sm:w-2/3 mb-2 sm:mb-0">{pergunta.texto}</p>
                                                <div className="flex space-x-4 sm:w-1/3 justify-end">
                                                    {['A', 'B', 'C', 'D'].map((opcao) => (
                                                        <label key={opcao} className="flex items-center space-x-1.5 cursor-pointer">
                                                            <RadioGroupItem
                                                                value={opcao}
                                                                id={`${pergunta.id}-${opcao}`}
                                                                checked={field.value === opcao}
                                                                onChange={() => field.onChange(opcao)}
                                                            />
                                                            <span className="text-sm text-gray-700">{opcao}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                            
                            <div className="mt-8 p-4 border-4 border-double border-red-300 bg-red-50 rounded-lg">
                                <h4 className="text-lg font-bold text-red-800 mb-2">RESULTADO DA PONTUAÇÃO: {totalPontuacao} pontos</h4>
                                {renderResultadoPontuacao(totalPontuacao)}
                            </div>

                        </section>

                        {/* --- Seção de Análise da Frequência Alimentar (4.1 e 4.2) --- */}
                        <section className="p-4 space-y-6">
                            <h3 className="text-xl font-bold text-blue-900">Análise da Frequencia Alimentar</h3>
                            <Separator />

                            {/* 4.1 Frequência 7 dias */}
                            <h4 className="text-lg font-bold text-gray-800 mb-4">4.1 - Frequência em Dias da Semana</h4>
                            <div className='space-y-4'>
                                <DaySelector
                                    name="freqFrutas"
                                    control={control}
                                    label="1. Em quantos dias da semana você costuma comer frutas?"
                                />
                                <DaySelector
                                    name="freqSucoNatural"
                                    control={control}
                                    label="2. Em quantos dias da semana você costuma tomar suco de frutas natural?*"
                                />
                                <DaySelector
                                    name="freqVerduraLegume"
                                    control={control}
                                    label="3. Em quantos dias da semana você costuma comer pelo menos um tipo de verdura ou legume (alface, tomate, couve, cenoura, chuchu, berinjela, abobrinha – não considerando batata, mandioca ou inhame)?*"
                                />
                                <DaySelector
                                    name="freqFeijao"
                                    control={control}
                                    label="4. Em quantos dias da semana você costuma comer feijão?**"
                                />
                                <DaySelector
                                    name="freqRefrigeranteSucoArtificial"
                                    control={control}
                                    label="5. Em quantos dias da semana você costuma tomar refrigerante ou suco artificial?"
                                />
                                <p className="text-xs text-gray-500 mt-2">*independentemente da quantidade e do tipo. **substituível por ervilha, lentilha ou grão de bico.</p>
                                <div className="p-3 bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-800 font-semibold">
                                    Resultado 4.1: (Exemplo: 80% de respostas adequadas)
                                </div>
                            </div>

                            {/* 4.2 Comeu Ontem */}
                            <h4 className="text-lg font-bold text-gray-800 pt-6">4.2 - Você comeu algum desses alimentos ONTEM?</h4>
                            
                            {/* Quadro A (Protetor) */}
                            <div className="space-y-1 p-4 border border-green-300 rounded-lg bg-green-50">
                                <h5 className="font-bold text-green-800 mb-2">Quadro A (Alimentos Protetores)</h5>
                                <SimNaoSelector name="qaVerduras" control={control} label="Verduras (exemplo: alface, couve, brócolis, agrião ou espinafre):" />
                                <SimNaoSelector name="qaAboCenoura" control={control} label="Abóbora, cenoura, batata-doce ou quiabo/caruru:" />
                                <SimNaoSelector name="qaMamaoManga" control={control} label="Mamão, manga, melão amarelo ou pequi:" />
                                <SimNaoSelector name="qaTomatePepino" control={control} label="Tomate, pepino, abobrinha, berinjela, chuchu ou beterraba:" />
                                <SimNaoSelector name="qaLaranjaBanana" control={control} label="Laranja, banana, maçã ou abacaxi:" />
                                <SimNaoSelector name="qaFeijao" control={control} label="Feijão, ervilha, lentilha ou grão-de-bico:" />
                                <SimNaoSelector name="qaAmendoim" control={control} label="Amendoim, castanha de caju ou castanha-do-Brasil/Pará:" />
                                <div className="mt-4 p-2 bg-green-100 rounded text-sm font-semibold text-green-800">
                                    Resultado Quadro A: (Exemplo: 6/7 Sim. Adequado para proteção de doenças crônicas)
                                </div>
                            </div>

                            {/* Quadro B (Risco) */}
                            <div className="space-y-1 p-4 border border-red-300 rounded-lg bg-red-50">
                                <h5 className="font-bold text-red-800 mb-2">Quadro B (Alimentos de Risco)</h5>
                                <SimNaoSelector name="qbRefrigerante" control={control} label="Refrigerante:" />
                                <SimNaoSelector name="qbSucoCaixa" control={control} label="Suco de fruta em caixa, caixinha ou lata:" />
                                <SimNaoSelector name="qbRefrescoPo" control={control} label="Refresco em pó:" />
                                <SimNaoSelector name="qbAchocolatado" control={control} label="Bebida achocolatada:" />
                                <SimNaoSelector name="qbIogurteSabor" control={control} label="Iogurte com sabor:" />
                                <SimNaoSelector name="qbSalgadinhoBiscoitoSalgado" control={control} label="Salgadinho de pacote (ou chips) ou biscoito/bolacha salgado:" />
                                <SimNaoSelector name="qbBiscoitoDoce" control={control} label="Biscoito/bolacha doce, biscoito recheado ou bolinho de pacote:" />
                                <SimNaoSelector name="qbChocolateSorvete" control={control} label="Chocolate, sorvete, gelatina, flan ou outra sobremesa industrializada:" />
                                <SimNaoSelector name="qbSalsichaLinguica" control={control} label="Salsicha, linguiça, mortadela ou presunto:" />
                                <SimNaoSelector name="qbPaoForma" control={control} label="Pão de forma, de cachorro-quente ou de hamburguer:" />
                                <SimNaoSelector name="qbMaionese" control={control} label="Maionese, ketchup ou mostarda:" />
                                <SimNaoSelector name="qbMargarina" control={control} label="Margarina:" />
                                <SimNaoSelector name="qbMacarraoInstantaneo" control={control} label="Macarrão instantâneo, sopa de pacote, lasanha congelada ou outro prato pronto comprado congelado:" />
                                <div className="mt-4 p-2 bg-red-100 rounded text-sm font-semibold text-red-800">
                                    Resultado Quadro B: (Exemplo: 3/13 Sim. Consumo alimentar de baixo risco)
                                </div>
                            </div>

                            {/* Outros Hábitos */}
                            <h4 className="text-lg font-bold text-gray-800 pt-6">Outros Hábitos Alimentares</h4>
                            <Controller
                                name="refeicaoDistraida"
                                control={control}
                                render={({ field }) => (
                                    <div className='flex items-center space-x-6 pt-2'>
                                        <label className="text-sm font-medium text-gray-700 block">Você tem o costume de realizar as refeições assistindo à TV, mexendo no computador e/ou celular?</label>
                                        <div className='flex space-x-4'>
                                            {['Sim', 'Não', 'Às vezes'].map(value => (
                                                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                                                    <RadioGroupItem value={value} checked={field.value === value} onChange={() => field.onChange(value)} />
                                                    <span className="text-sm text-gray-800">{value}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            />

                            <Controller
                                name="refeicoesDia"
                                control={control}
                                render={({ field }) => (
                                    <div className='space-y-2'>
                                        <label className="text-sm font-medium text-gray-700 block">Quais refeições você faz ao longo do dia?</label>
                                        <div className='flex flex-wrap gap-4'>
                                            {refeicoesOpcoes.map(refeicaoKey => (
                                                <label key={refeicaoKey} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.value[refeicaoKey]}
                                                        onChange={(e) => field.onChange({ ...field.value, [refeicaoKey]: e.target.checked })}
                                                        className="h-4 w-4 text-red-600 border-gray-400 rounded focus:ring-red-500 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-gray-800">{refeicaoKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            />

                        </section>
                        <section className="p-4 space-y-6">
                            <h3 className="text-xl font-bold text-blue-900">Avaliação Clínica e Prescrição Dietética Nutrição</h3>
                            <Separator />

                            {/* Hipótese Diagnóstica */}
                            <div>
                                <label htmlFor="hipoteseDiagnostica" className="text-sm font-medium text-gray-700 mb-1 block">HIPÓTESE DIAGNÓSTICA NUTRICIONAL *</label>
                                <p className="text-sm text-gray-500 mb-2">
                                    Apresentação da avaliação nutricional em relação ao padrão alimentar observado.
                                </p>
                                <Controller
                                    name="hipoteseDiagnostica"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            id="hipoteseDiagnostica"
                                            placeholder="Deixar um espaço para o profissional colocar aqui o diagnóstico nutricional."
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.hipoteseDiagnostica && <p className="text-red-500 text-xs mt-1">{errors.hipoteseDiagnostica.message}</p>}
                            </div>
                            
                            {/* Conduta Nutricional */}
                            <div>
                                <label htmlFor="condutaNutricional" className="text-sm font-medium text-gray-700 mb-1 block">CONDUTA NUTRICIONAL *</label>
                                <p className="text-sm text-gray-500 mb-2">
                                    Descrição das recomendações dietéticas realizadas ao paciente.
                                </p>
                                <Controller
                                    name="condutaNutricional"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            id="condutaNutricional"
                                            placeholder="Descreva as recomendações aqui:"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                                 <div className="p-4 mt-8">
                                    <h2 className="text-2xl font-bold text-blue-900">Anexo de exames complementares</h2>
                                      {somenteLeitura ? (
                                      <ListaAnexos attachments={attachments} />
                                      ) : (
                                        <FileInput
                                          ref={fileInputRef}
                                          name="anexar"
                                          multiple
                                        />
                                      )}
                                </div>
                        </section>
                        <div className="flex justify-center pt-4">
                            <Button type="submit" className="w-full sm:w-auto">
                                <CheckIcon className="h-5 w-5 mr-2" /> Salvar Avaliação
                            </Button>
                        </div>
                        
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent>
                    <div className="flex flex-col items-center py-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckIcon className='h-8 w-8 text-green-600'/>
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