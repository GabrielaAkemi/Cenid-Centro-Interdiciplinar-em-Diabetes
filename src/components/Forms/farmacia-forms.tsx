import React, { useState, useCallback } from 'react';

const inputClasses = "mt-1 block w-full rounded-md border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
const tableInputClasses = "w-full p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900";
const sectionTitleClasses = "text-2xl font-semibold text-blue-800 mb-6";
const cardClasses = "bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6 shadow-sm";
const subTitleClasses = "text-xl font-semibold text-gray-800";

const MedicationCard = ({ medicationData, onDataChange, onRemove, showRemoveButton }) => {

  const handleFieldChange = (field, value) => {
    onDataChange({ ...medicationData, [field]: value });
  };

  const handlePosologiaChange = (posIndex, field, value) => {
    const newPosologias = [...medicationData.posologias];
    newPosologias[posIndex] = { ...newPosologias[posIndex], [field]: value };
    onDataChange({ ...medicationData, posologias: newPosologias });
  };

  const addPosologiaRow = () => {
    const newPosologias = [...medicationData.posologias, { posologia: '', frequencia: '', dose: '', horario: '', emJejum: '' }];
    onDataChange({ ...medicationData, posologias: newPosologias });
  };

  const removePosologiaRow = (posIndex) => {
    if (medicationData.posologias.length <= 1) return;
    const newPosologias = medicationData.posologias.filter((_, index) => index !== posIndex);
    onDataChange({ ...medicationData, posologias: newPosologias });
  };

  const calculateTempoDeUso = useCallback(() => {
    if (medicationData.dataInicio && medicationData.dataTermino) {
      const start = new Date(medicationData.dataInicio);
      const end = new Date(medicationData.dataTermino);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} dias`;
      }
    }
    return '';
  }, [medicationData.dataInicio, medicationData.dataTermino]);


  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Medicamento (nome comercial):</label>
          <input type="text" value={medicationData.medicamento} onChange={(e) => handleFieldChange('medicamento', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Princípio ativo:</label>
          <input type="text" value={medicationData.principioAtivo} onChange={(e) => handleFieldChange('principioAtivo', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Com prescrição médica?</label>
          <select value={medicationData.comPrescricaoMedica} onChange={(e) => handleFieldChange('comPrescricaoMedica', e.target.value)} className={inputClasses}>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data início:</label>
          <input type="date" value={medicationData.dataInicio} onChange={(e) => handleFieldChange('dataInicio', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data término ou atual:</label>
          <input type="date" value={medicationData.dataTermino} onChange={(e) => handleFieldChange('dataTermino', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tempo de uso:</label>
          <input type="text" value={calculateTempoDeUso()} readOnly className={`${inputClasses} bg-gray-100`} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Finalidade do uso:</label>
          <input type="text" value={medicationData.finalidade} onChange={(e) => handleFieldChange('finalidade', e.target.value)} className={inputClasses} />
        </div>
      </div>

      {/* Tabela de Posologia */}
      <div className="bg-gray-100 p-4 rounded-xl mt-4 border">
        <h5 className="font-semibold text-gray-700 mb-2">Posologia</h5>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-200">
              <tr className="text-left text-gray-800 uppercase">
                <th className="py-2 px-3">Posologia</th>
                <th className="py-2 px-3">Frequência</th>
                <th className="py-2 px-3">Dose</th>
                <th className="py-2 px-3">Horário</th>
                <th className="py-2 px-3">Em jejum?</th>
                <th className="py-2 px-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {medicationData.posologias.map((pos, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-1"><input type="text" value={pos.posologia} onChange={(e) => handlePosologiaChange(i, 'posologia', e.target.value)} className={tableInputClasses} /></td>
                  <td className="p-1"><input type="text" value={pos.frequencia} onChange={(e) => handlePosologiaChange(i, 'frequencia', e.target.value)} className={tableInputClasses} /></td>
                  <td className="p-1"><input type="text" value={pos.dose} onChange={(e) => handlePosologiaChange(i, 'dose', e.target.value)} className={tableInputClasses} /></td>
                  <td className="p-1"><input type="text" value={pos.horario} onChange={(e) => handlePosologiaChange(i, 'horario', e.target.value)} className={tableInputClasses} /></td>
                  <td className="p-1">
                    <select value={pos.emJejum} onChange={(e) => handlePosologiaChange(i, 'emJejum', e.target.value)} className={tableInputClasses}>
                      <option value="">Selecione</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </select>
                  </td>
                  <td className="p-1 text-center">
                    {medicationData.posologias.length > 1 && (
                      <button type="button" onClick={() => removePosologiaRow(i)} className="text-red-500 hover:text-red-700">&times;</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addPosologiaRow} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
          + Adicionar Linha
        </button>
      </div>
      {showRemoveButton && (
        <div className="flex justify-end mt-4">
          <button type="button" onClick={onRemove} className="bg-red-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-red-600 transition-colors">
            Remover Medicamento
          </button>
        </div>
      )}
    </div>
  );
};


// --- Seção: Dados do Paciente ---
const PatientInfo = ({ onChange }) => {
  const [data, setData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    <div>
      <h3 className={sectionTitleClasses}>Dados do Paciente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'nome', label: 'Nome completo:', type: 'text' },
          { name: 'dataAvaliacao', label: 'Data da avaliação:', type: 'date' },
          { name: 'sexo', label: 'Sexo:', type: 'select', options: ['Masculino', 'Feminino'] },
          { name: 'idade', label: 'Idade (anos):', type: 'number' },
          { name: 'peso', label: 'Peso (kg):', type: 'number', step: '0.1' },
          { name: 'estatura', label: 'Estatura (metros):', type: 'number', step: '0.01' },
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.type === 'select' ? (
              <select name={field.name} id={field.name} onChange={handleChange} className={inputClasses}>
                <option value="">Selecione</option>
                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                step={field.step}
                onChange={handleChange}
                className={inputClasses}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Seção: Adesão à Insulina ---
const BAASIS = ({ onChange }) => {
  const [data, setData] = useState({ p1: '', p2: '', p3: '', p4: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="questionnaire-section bg-blue-50 p-6 rounded-2xl border border-blue-200 mt-6">
      <h4 className="text-xl font-semibold text-blue-800 mb-2">BAASIS para pacientes com MDI</h4>
      <p className="text-sm text-gray-600 mb-4">Objetivo: Avaliar especificamente a adesão à insulina em pacientes com DM1 e uso de MDI.</p>
      {[
          {key: 'p1', label: 'P1. Esqueceu insulina na última semana?', options: ['Nunca', '1-2x', '3-4x', '5+']},
          {key: 'p2', label: 'P2. Reduziu/pulou doses sem orientação?', options: ['Sim', 'Não']},
          {key: 'p3', label: 'P3. Aplicou fora do horário?', options: ['Sim', 'Não']},
          {key: 'p4', label: 'P4. Dias sem insulina no último mês?', options: ['0', '1-2', '3-5', '>5']}
      ].map(q => (
         <div key={q.key} className="form-field mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{q.label}</label>
            <select name={q.key} value={data[q.key]} onChange={handleChange} className={inputClasses}>
                <option value="">Selecione</option>
                {q.options.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
         </div>
      ))}
      <p className="mt-4 text-sm text-blue-800 font-medium">CLASSIFICAÇÃO: Não aderente se: ≥1 falha (P1), "Sim" (P2/P3), ou ≥3 dias sem (P4).</p>
      <p className="mt-2 text-xs text-gray-500">Referência: Schmittdiel JA, et al. Diabetes. 2008;57(Suppl 1):A1-A2.</p>
    </div>
  );
};

const BAASIS_CSII = ({ onChange }) => {
  const [data, setData] = useState({ p1: '', p2: '', p3: '', p4: '', p5: '', p6: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...data, [name]: value };
    setData(newData);
    onChange(newData);
  };
  const questions = [
    { key: 'p1', label: 'P1. Omissão de bolus na última semana:', options: ['Nunca', '1-2x', '3-4x', '5+'] },
    { key: 'p2', label: 'P2. Redução não autorizada de bolus:', options: ['Sim', 'Não'] },
    { key: 'p3', label: 'P3. Dias sem basal por falha na bomba:', options: ['0', '1-2', '3-5', '>5'] },
    { key: 'p4', label: 'P4. Bomba desconectada >1h:', options: ['Nenhuma', '1-2x', '3-4x', '5+'] },
    { key: 'p5', label: 'P5. Troca de cateter atrasada:', options: ['Nenhuma', '1-2x', '3-4x', '5+'] },
    { key: 'p6', label: 'P6. Ignorar alarmes:', options: ['Frequentemente', 'Às vezes', 'Raramente', 'Nunca'] },
  ];

  return (
    <div className="questionnaire-section bg-green-50 p-6 rounded-2xl border border-green-200 mt-6">
      <h4 className="text-xl font-semibold text-green-800 mb-2">BAASIS-CSII para usuários de bomba de insulina (SICI)</h4>
      <p className="text-sm text-gray-600 mb-4">Objetivo: Avaliar comportamentos de não adesão específicos de usuários de CSII.</p>
      {questions.map(q => (
        <div key={q.key} className="form-field mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{q.label}</label>
          <select name={q.key} value={data[q.key]} onChange={handleChange} className={inputClasses}>
            <option value="">Selecione</option>
            {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      ))}
      <p className="mt-4 text-sm text-green-800 font-medium">CLASSIFICAÇÃO: Não aderente se: ≥1 falha (P1,4,5), "Sim" (P2), ≥3 dias (P3), ou "Frequentemente/Às vezes" (P6).</p>
      <p className="mt-2 text-xs text-gray-500">Referência: Hood et al., 2014; Barnard et al., 2015.</p>
    </div>
  );
};

const InsulinAdherence = ({ onChange }) => {
  const [method, setMethod] = useState('');
  const [questionnaireData, setQuestionnaireData] = useState({});

  const handleMethodChange = (e) => {
    const newMethod = e.target.value;
    setMethod(newMethod);
    setQuestionnaireData({});
    onChange({ method: newMethod });
  };

  const handleQuestionnaireChange = (data) => {
    setQuestionnaireData(data);
    onChange({ method, questionnaire: data });
  };

  return (
    <div>
      <h3 className={sectionTitleClasses}>Adesão ao tratamento com insulina</h3>
      <div className="form-field mb-6 max-w-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">Método de administração de insulina:</label>
        <select value={method} onChange={handleMethodChange} className={inputClasses}>
          <option value="">Selecione</option>
          <option value="SICI">SICI</option>
          <option value="MDI">MDI</option>
        </select>
      </div>
      {method === 'MDI' && <BAASIS onChange={handleQuestionnaireChange} />}
      {method === 'SICI' && <BAASIS_CSII onChange={handleQuestionnaireChange} />}
    </div>
  );
};


// --- Seção: Medicamentos Complementares ---
const medicationCategories = [
    { title: "Hipoglicemiante Oral", key: "hipoglicemianteOral" },
    { title: "Inibidores da Dipeptidil Peptidase-4 (DPP-4i - Gliptinas)", key: "dpp4i" },
    { title: "Inibidores do SGLT-2 (SGLT-2i)", key: "sglt2i" },
    { title: "Combinações Fixas (SGLT-2i + DPP-4i)", key: "combinacoesFixas" },
    { title: "Agonistas do Receptor de GLP-1 (GLP-1 RA)", key: "glp1ra" },
    { title: "Imunobiológicos", key: "imunobiologicos" },
    { title: "Anti-hipertensivos", key: "antihipertensivos" },
    { title: "Estatinas", key: "estatinas" },
    { title: "Antiagregante plaquetário", key: "antiagregantePlaquetario" },
    { title: "Tratamento para tireoide", key: "tratamentoTireoide" },
    { title: "Antidepressivos", key: "antidepressivos" },
    { title: "Vitaminas", key: "vitaminas", isParent: true },
    { title: "Vitamina D (1)", key: "vitaminaD1", parent: "vitaminas" },
    { title: "Vitamina D (2)", key: "vitaminaD2", parent: "vitaminas" }
];

const createInitialMedState = () => ({
  medicamento: '',
  principioAtivo: '',
  comPrescricaoMedica: '',
  dataInicio: '',
  dataTermino: '',
  finalidade: '',
  posologias: [{ posologia: '', frequencia: '', dose: '', horario: '', emJejum: '' }]
});

const ComplementaryMedications = ({ onChange }) => {
    const [meds, setMeds] = useState({});

    const handleToggle = (key) => {
        const newMeds = { ...meds };
        if (newMeds[key]) {
            delete newMeds[key];
        } else {
            newMeds[key] = createInitialMedState();
        }
        setMeds(newMeds);
        onChange(newMeds);
    };

    const handleDataChange = (key, data) => {
        const newMeds = { ...meds, [key]: data };
        setMeds(newMeds);
        onChange(newMeds);
    };

    return (
        <div>
            <h3 className={sectionTitleClasses}>Tratamento Medicamentoso Complementar</h3>
            {medicationCategories.filter(cat => !cat.parent).map(cat => (
                <div key={cat.key} className={cat.key === 'vitaminas' ? 'bg-white p-6 rounded-2xl border border-gray-200 mb-6 shadow-sm' : cardClasses}>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className={subTitleClasses}>{cat.title}</h4>
                        {!cat.isParent && (
                           <label className="flex items-center cursor-pointer">
                                <span className="mr-3 text-sm font-medium text-gray-900">Em uso?</span>
                                <div className="relative">
                                    <input type="checkbox" checked={!!meds[cat.key]} onChange={() => handleToggle(cat.key)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                        )}
                    </div>
                    {meds[cat.key] && !cat.isParent && (
                        <MedicationCard
                            medicationData={meds[cat.key]}
                            onDataChange={(data) => handleDataChange(cat.key, data)}
                        />
                    )}
                    {cat.isParent && (
                        <div className="pl-4 mt-4 space-y-4">
                            {medicationCategories.filter(subCat => subCat.parent === cat.key).map(subCat => (
                                <div key={subCat.key} className="bg-gray-100 p-4 rounded-xl border">
                                    <div className="flex justify-between items-center mb-4">
                                        <h5 className="font-semibold text-gray-900">{subCat.title}</h5>
                                         <label className="flex items-center cursor-pointer">
                                            <span className="mr-3 text-sm font-medium text-gray-900">Em uso?</span>
                                            <div className="relative">
                                                <input type="checkbox" checked={!!meds[subCat.key]} onChange={() => handleToggle(subCat.key)} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </div>
                                        </label>
                                    </div>
                                    {meds[subCat.key] && (
                                        <MedicationCard
                                            medicationData={meds[subCat.key]}
                                            onDataChange={(data) => handleDataChange(subCat.key, data)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// --- Seção: Outros Medicamentos ---
const OtherMedications = ({ onChange }) => {
  const [meds, setMeds] = useState([]);

  const addMedication = () => {
    const newMeds = [...meds, createInitialMedState()];
    setMeds(newMeds);
    onChange(newMeds);
  };

  const removeMedication = (index) => {
    const newMeds = meds.filter((_, i) => i !== index);
    setMeds(newMeds);
    onChange(newMeds);
  };
  
  const handleMedicationChange = (index, data) => {
    const newMeds = [...meds];
    newMeds[index] = data;
    setMeds(newMeds);
    onChange(newMeds);
  };

  return (
    <div>
      <h3 className={sectionTitleClasses}>Outros Medicamentos</h3>
      {meds.map((med, idx) => (
        <div key={idx} className={cardClasses}>
          <MedicationCard 
            medicationData={med}
            onDataChange={(data) => handleMedicationChange(idx, data)}
            onRemove={() => removeMedication(idx)}
            showRemoveButton={true}
          />
        </div>
      ))}
      <button type="button" onClick={addMedication} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors">
        + Adicionar Outro Medicamento
      </button>
    </div>
  );
};


// --- Componente Principal: App ---
const App = () => {
  const [formData, setFormData] = useState({
    patientInfo: {},
    insulinAdherence: {},
    complementaryMedications: {},
    otherMedications: [],
  });

  const handleChange = (section, data) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: data,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // Substituindo o alert por uma mensagem no console, que é uma prática melhor em apps modernos.
    console.log('Formulário enviado com sucesso! Verifique o console para os dados.');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2">Avaliação Farmácia</h2>
        <p className="text-center text-gray-600 mb-10">
          A avaliação da Farmácia deve ser feita sempre que o paciente realizar uma nova consulta médica com mudança na prescrição de medicamentos.
        </p>
        <form onSubmit={handleSubmit} className="space-y-10">
          <PatientInfo onChange={data => handleChange('patientInfo', data)} />
          <hr className="border-t-2 border-gray-200" />
          <InsulinAdherence onChange={data => handleChange('insulinAdherence', data)} />
          <hr className="border-t-2 border-gray-200" />
          <ComplementaryMedications onChange={data => handleChange('complementaryMedications', data)} />
          <hr className="border-t-2 border-gray-200" />
          <OtherMedications onChange={data => handleChange('otherMedications', data)} />
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105 duration-300"
            >
              Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
