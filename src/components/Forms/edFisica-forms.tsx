import React, { useState } from 'react';

// Constantes para o formulário
const diasSemana = [
  { key: "segunda", label: "2ª feira" },
  { key: "terca", label: "3ª feira" },
  { key: "quarta", label: "4ª feira" },
  { key: "quinta", label: "5ª feira" },
  { key: "sexta", label: "6ª feira" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const App = () => {
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('formulario');

  // Estados do formulário
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
    mesesPraticando: "",
    relatorioInterrupcoes: "",
    prescricaoExercicio: "",
    forcaMaoDominante: { medida1: "", medida2: "", medida3: "" },
    forcaMaoNaoDominante: { medida1: "", medida2: "", medida3: "" },
    forcaLombar: { medida1: "", medida2: "", medida3: "" },
    cronograma: diasSemana.reduce((acc, dia) => {
      acc[dia.key] = { horario: "", tipo: "" };
      return acc;
    }, {}),
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleStrengthChange = (measureName, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [measureName]: {
        ...prev[measureName],
        [field]: value,
      },
    }));
  };

  const handleCronogramaChange = (dayKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      cronograma: {
        ...prev.cronograma,
        [dayKey]: {
          ...prev.cronograma[dayKey],
          [field]: value,
        },
      },
    }));
  };

  const calculateNAF = () => {
    const total = Number(formData.atividadeLeve || 0) + Number(formData.atividadeModerada || 0) + Number(formData.atividadeVigorosa || 0);
    if (total <= 0) return 'Sedentário';
    if (total > 0 && total < 150) return 'Pouco ativo';
    if (total >= 150 && total <= 300) return 'Ativo';
    return 'Muito ativo';
  };

  const calculateStrength = (measures, peso) => {
    const validMeasures = [measures.medida1, measures.medida2, measures.medida3].map(m => parseFloat(m)).filter(m => !isNaN(m));
    const media = validMeasures.length > 0 ? (validMeasures.reduce((a, b) => a + b, 0) / validMeasures.length).toFixed(2) : '0.00';
    const maiorValor = validMeasures.length > 0 ? Math.max(...validMeasures).toFixed(2) : '0.00';
    const forcaRelativa = peso > 0 ? (parseFloat(maiorValor) / peso).toFixed(2) : '0.00';
    return { media, forcaRelativa };
  };

  const { media: mediaDominante, forcaRelativa: forcaRelativaDominante } = calculateStrength(formData.forcaMaoDominante, formData.peso);
  const { media: mediaNaoDominante, forcaRelativa: forcaRelativaNaoDominante } = calculateStrength(formData.forcaMaoNaoDominante, formData.peso);
  const { media: mediaLombar, forcaRelativa: forcaRelativaLombar } = calculateStrength(formData.forcaLombar, formData.peso);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dataConsulta) {
      setMessage('A Data da Consulta é obrigatória.');
      setShowModal(true);
      return;
    }
    console.log("Dados do formulário:", formData);
    setMessage('Formulário enviado com sucesso!');
    setShowModal(true);
    setCurrentPage('consultas');
    // Limpar o formulário após o envio
    setFormData({
      dataConsulta: "", nomeCompleto: "", dataAvaliacao: "", sexo: "", idade: "", peso: "", estatura: "", metodoInsulina: "",
      atividadeLeve: "", atividadeModerada: "", atividadeVigorosa: "", tempoSentado: "", tempoDormindo: "",
      mesesPraticando: "", relatorioInterrupcoes: "", prescricaoExercicio: "",
      forcaMaoDominante: { medida1: "", medida2: "", medida3: "" }, forcaMaoNaoDominante: { medida1: "", medida2: "", medida3: "" },
      forcaLombar: { medida1: "", medida2: "", medida3: "" },
      cronograma: diasSemana.reduce((acc, dia) => {
        acc[dia.key] = { horario: "", tipo: "" };
        return acc;
      }, {}),
    });
  };

  // Classes comuns para inputs
  const inputClass = "p-3.5 border border-gray-600 rounded-md shadow-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 w-full";
  const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans p-6 text-gray-800">
      <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Avaliação de Educação Física</h1>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg text-center shadow-2xl">
              <p className="text-xl font-bold text-blue-900">{message}</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {currentPage === 'formulario' && (
          <form onSubmit={handleSubmit} className="space-y-10 text-blue-900">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-900">Dados do Paciente</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Data da Consulta <span className="text-red-500">*</span>:</label>
                  <input
                    type="date"
                    value={formData.dataConsulta}
                    onChange={(e) => handleChange("dataConsulta", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Nome completo:</label>
                  <input
                    type="text"
                    value={formData.nomeCompleto}
                    onChange={(e) => handleChange("nomeCompleto", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Data da Avaliação:</label>
                  <input
                    type="date"
                    value={formData.dataAvaliacao}
                    onChange={(e) => handleChange("dataAvaliacao", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sexo:</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => handleChange("sexo", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Idade (anos):</label>
                  <input
                    type="number"
                    value={formData.idade}
                    onChange={(e) => handleChange("idade", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Peso (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.peso}
                    onChange={(e) => handleChange("peso", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estatura (metros):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estatura}
                    onChange={(e) => handleChange("estatura", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <label className={labelClass}>Método de administração de insulina:</label>
                  <div className="flex flex-wrap gap-6 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="metodoInsulina"
                        value="SICI"
                        checked={formData.metodoInsulina === 'SICI'}
                        onChange={(e) => handleChange("metodoInsulina", e.target.value)}
                        className="form-radio h-5 w-5 text-blue-600 transition-colors"
                      />
                      <span className="ml-2 text-gray-700">SICI</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="metodoInsulina"
                        value="MDI"
                        checked={formData.metodoInsulina === 'MDI'}
                        onChange={(e) => handleChange("metodoInsulina", e.target.value)}
                        className="form-radio h-5 w-5 text-blue-600 transition-colors"
                      />
                      <span className="ml-2 text-gray-700">MDI</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-900">Questionário de Nível de Atividade Física (NAF)</h2>
              <div className="mt-6 space-y-6">
                <p className="text-sm italic text-gray-600">Considerar o comportamento de atividade física atual (Minutos/semana)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>Atividade Leve:</label>
                    <input
                      type="number"
                      value={formData.atividadeLeve}
                      onChange={(e) => handleChange("atividadeLeve", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Atividade Moderada:</label>
                    <input
                      type="number"
                      value={formData.atividadeModerada}
                      onChange={(e) => handleChange("atividadeModerada", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Atividade Vigorosa:</label>
                    <input
                      type="number"
                      value={formData.atividadeVigorosa}
                      onChange={(e) => handleChange("atividadeVigorosa", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700 block">Análise do NAF:</span>
                  <span className="text-xl font-bold text-blue-900">{calculateNAF()}</span>
                  <span className="text-sm text-gray-500">Total de Exercício Físico: {(Number(formData.atividadeLeve) || 0) + (Number(formData.atividadeModerada) || 0) + (Number(formData.atividadeVigorosa) || 0)} min/semana</span>
                </div>
                
                <p className="text-sm italic text-gray-600">Parâmetros de comportamento sedentário (Horas/dia)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Tempo sentado/deitado:</label>
                    <input
                      type="number"
                      value={formData.tempoSentado}
                      onChange={(e) => handleChange("tempoSentado", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tempo de sono:</label>
                    <input
                      type="number"
                      value={formData.tempoDormindo}
                      onChange={(e) => handleChange("tempoDormindo", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Relatos de exercício físico (tabela semanal):</label>
                  <div className="overflow-x-auto mt-2 rounded-md border border-gray-600">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dia</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {diasSemana.map((day) => (
                          <tr key={day.key}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.label}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={formData.cronograma[day.key].horario}
                                onChange={(e) => handleCronogramaChange(day.key, "horario", e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                value={formData.cronograma[day.key].tipo}
                                onChange={(e) => handleCronogramaChange(day.key, "tipo", e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>O comportamento de atividade física relatado está ocorrendo há quantos meses?</label>
                  <input
                    type="number"
                    value={formData.mesesPraticando}
                    onChange={(e) => handleChange("mesesPraticando", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Relate sobre períodos de interrupção e retomada da atividade física:</label>
                  <textarea
                    value={formData.relatorioInterrupcoes}
                    onChange={(e) => handleChange("relatorioInterrupcoes", e.target.value)}
                    className={`${inputClass} min-h-[120px]`}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-900">Avaliação do Condicionamento Físico</h2>
              <div className="mt-6 overflow-x-auto rounded-md border border-gray-600">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medida</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medida 1</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medida 2</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medida 3</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Força relativa (kg/peso)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Força da mão dominante (kg)</td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaMaoDominante.medida1} onChange={(e) => handleStrengthChange("forcaMaoDominante", "medida1", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaMaoDominante.medida2} onChange={(e) => handleStrengthChange("forcaMaoDominante", "medida2", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaMaoDominante.medida3} onChange={(e) => handleStrengthChange("forcaMaoDominante", "medida3", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4 font-semibold text-sm text-gray-900">{mediaDominante}</td>
                      <td className="px-6 py-4 font-semibold text-sm text-gray-900">{forcaRelativaDominante}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Força da mão não dominante (kg)</td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaMaoNaoDominante.medida1} onChange={(e) => handleStrengthChange("forcaMaoNaoDominante", "medida1", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaMaoNaoDominante.medida2} onChange={(e) => handleStrengthChange("forcaMaoNaoDominante", "medida2", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaMaoNaoDominante.medida3} onChange={(e) => handleStrengthChange("forcaMaoNaoDominante", "medida3", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4 font-semibold text-sm text-gray-900">{mediaNaoDominante}</td>
                      <td className="px-6 py-4 font-semibold text-sm text-gray-900">{forcaRelativaNaoDominante}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Força Lombar (kg)</td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaLombar.medida1} onChange={(e) => handleStrengthChange("forcaLombar", "medida1", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaLombar.medida2} onChange={(e) => handleStrengthChange("forcaLombar", "medida2", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4"><input type="number" step="0.1" value={formData.forcaLombar.medida3} onChange={(e) => handleStrengthChange("forcaLombar", "medida3", e.target.value)} className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200" /></td>
                      <td className="px-6 py-4 font-semibold text-sm text-gray-900">{mediaLombar}</td>
                      <td className="px-6 py-4 font-semibold text-sm text-gray-900">{forcaRelativaLombar}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-900">Prescrição de Exercício</h2>
              <div className="mt-6">
                <label className={labelClass}>Relato sobre as orientações e prescrições fornecidas:</label>
                <textarea
                  value={formData.prescricaoExercicio}
                  onChange={(e) => handleChange("prescricaoExercicio", e.target.value)}
                  className={`${inputClass} min-h-[120px]`}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 bg-red-600 text-white font-bold rounded-md shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105"
              >
                Salvar Avaliação
              </button>
            </div>
          </form>
        )}

        {currentPage === 'consultas' && (
          <div className="p-6 mt-8 text-center flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Página de Consultas</h2>
            <p className="text-gray-700 mb-6">Aqui estaria a sua página de consultas. Você pode adicionar a tabela de dados ou outras informações aqui.</p>
            <button
              onClick={() => setCurrentPage('formulario')}
              className="px-10 py-4 bg-blue-900 text-white font-bold rounded-md shadow-lg hover:bg-blue-800 transition-colors transform hover:scale-105"
            >
              Voltar para Avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
