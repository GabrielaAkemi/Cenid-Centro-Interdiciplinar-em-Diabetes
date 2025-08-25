// src/constants/paciente-options.ts

export const DIAGNOSTICO_OPTIONS = [
  { value: "DM1", label: "Diabetes Mellitus Tipo 1 (DM1)" },
  { value: "DM2", label: "Diabetes Mellitus Tipo 2 (DM2)" },
  { value: "LADA", label: "Diabetes Autoimune Latente do Adulto (LADA)" },
  { value: "MODY", label: "Maturity Onset Diabetes of the Young (MODY)" },
  { value: "GESTACIONAL", label: "Diabetes Gestacional" },
  { value: "OUTRO", label: "Outro" },
];

export const METODO_INSULINA_OPTIONS = [
  { value: "CANETA", label: "Caneta de Insulina" },
  { value: "SERINGA", label: "Seringa" },
  { value: "BOMBA", label: "Bomba de Insulina" },
  { value: "NAO_USA", label: "Não Utiliza Insulina" },
];

export const METODO_MONITORAMENTO_OPTIONS = [
  { value: "GLICOMETRO", label: "Glicômetro Tradicional" },
  { value: "SENSOR_FGM", label: "Sensor Flash (FGM)" },
  { value: "SENSOR_CGM", label: "Sensor Contínuo (CGM)" },
  { value: "MULTI", label: "Múltiplos Métodos" },
];

export const TIPO_ATENDIMENTO_OPTIONS = [
  { value: "SUS", label: "Sistema Único de Saúde (SUS)" },
  { value: "CONVENIO", label: "Convênio/Plano de Saúde" },
  { value: "PARTICULAR", label: "Particular" },
  { value: "MISTO", label: "Misto (SUS + Outros)" },
];

export const AUXILIO_OPTIONS = [
  { value: "BPC", label: "Benefício de Prestação Continuada (BPC)" },
  { value: "BOLSA_FAMILIA", label: "Bolsa Família" },
  { value: "AUXILIO_DOENCA", label: "Auxílio Doença" },
  { value: "APOSENTADORIA", label: "Aposentadoria por Invalidez" },
  { value: "OUTRO", label: "Outro Auxílio" },
  { value: "NENHUM", label: "Nenhum Auxílio" },
];

export const APP_GLICEMIA_OPTIONS = [
  { value: "LIBRE", label: "LibreLink" },
  { value: "DEXCOM", label: "Dexcom" },
  { value: "MEDTRONIC", label: "Medtronic" },
  { value: "ACCU_CHEK", label: "Accu-Chek" },
  { value: "ONETOUCH", label: "OneTouch" },
  { value: "GLICOSOURCE", label: "GlicoSource" },
  { value: "OUTRO", label: "Outro App" },
  { value: "NAO_USA", label: "Não Utiliza App" },
];

export const MARCAS_BOMBAS_OPTIONS = [
  { value: "MEDTRONIC_MINIMED", label: "Medtronic MiniMed" },
  { value: "ACCU_CHEK_COMBO", label: "Accu-Chek Combo" },
  { value: "ACCU_CHEK_INSIGHT", label: "Accu-Chek Insight" },
  { value: "OMNIPOD", label: "Omnipod" },
  { value: "TANDEM", label: "Tandem t:slim X2" },
  { value: "OUTRO", label: "Outro" },
];

export const MARCAS_GLICOMETROS_SENSORES_OPTIONS = [
  { value: "FREESTYLE_LIBRE", label: "FreeStyle Libre" },
  { value: "FREESTYLE_LIBRE_2", label: "FreeStyle Libre 2" },
  { value: "DEXCOM_G6", label: "Dexcom G6" },
  { value: "DEXCOM_G7", label: "Dexcom G7" },
  { value: "MEDTRONIC_GUARDIAN", label: "Medtronic Guardian" },
  { value: "ACCU_CHEK_ACTIVE", label: "Accu-Chek Active" },
  { value: "ACCU_CHEK_GUIDE", label: "Accu-Chek Guide" },
  { value: "ONETOUCH_SELECT", label: "OneTouch Select Plus" },
  { value: "ONETOUCH_ULTRA", label: "OneTouch Ultra" },
  { value: "CONTOUR_PLUS", label: "Contour Plus" },
  { value: "OUTRO", label: "Outro" },
];

export const TIPO_DEFICIENCIA_OPTIONS = [
  { value: "FISICA", label: "Física" },
  { value: "VISUAL", label: "Visual" },
  { value: "AUDITIVA", label: "Auditiva" },
  { value: "INTELECTUAL", label: "Intelectual" },
  { value: "MULTIPLA", label: "Múltipla" },
  { value: "OUTRO", label: "Outro" },
];

export const PARENTESCO_OPTIONS = [
  { value: "MAE", label: "Mãe" },
  { value: "PAI", label: "Pai" },
  { value: "IRMAO", label: "Irmão/Irmã" },
  { value: "AVO", label: "Avô/Avó" },
  { value: "TIO", label: "Tio/Tia" },
  { value: "PRIMO", label: "Primo/Prima" },
  { value: "OUTRO", label: "Outro" },
];
