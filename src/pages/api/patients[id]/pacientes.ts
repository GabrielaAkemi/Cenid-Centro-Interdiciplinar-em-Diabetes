import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;
      console.log("Paciente recebido:", data);
      // Salvar no banco aqui
      res.status(200).json({ message: "Paciente cadastrado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao cadastrar paciente" });
    }
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
