import { NextApiRequest, NextApiResponse } from "next";

const patients = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "123.456.789-00",
    dataNascimento: "1990-01-01",
    diagnostico: "DM1",
    telefone: "1111-1111",
    email: "joao@email.com",
    dateCadastro: "2025-08-21",
  },
  {
    id: "2",
    nome: "Maria Souza",
    cpf: "987.654.321-00",
    dataNascimento: "1985-05-10",
    diagnostico: "DM2",
    telefone: "2222-2222",
    email: "maria@email.com",
    dateCadastro: "2025-08-20",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const patientId = Array.isArray(id) ? id[0] : id;
  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return res.status(404).json({ error: "Paciente não encontrado" });
  }

  res.status(200).json(patient);
}
