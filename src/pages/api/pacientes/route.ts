// app/api/pacientes/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs"; // garante acesso a fs

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Monta objeto paciente com os campos de texto/JSON
    const paciente: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        try {
          paciente[key] = JSON.parse(value);
        } catch {
          paciente[key] = value;
        }
      }
    }

    // Pastas de upload
    const uploadBaseDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadBaseDir, { recursive: true });

    const patientDir = path.join(
      uploadBaseDir,
      String(paciente.cpf || Date.now())
    );
    await fs.mkdir(patientDir, { recursive: true });

    // Lê 1..N arquivos do campo "documento"
    const files = formData
      .getAll("documento")
      .filter((v) => v instanceof File) as File[];

    const savedFiles: string[] = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // nome de arquivo seguro
      const safeName = `${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const filePath = path.join(patientDir, safeName);

      await fs.writeFile(filePath, buffer);
      // caminho público (opcional)
      savedFiles.push(`/uploads/${paciente.cpf || ""}/${safeName}`);
    }

    return NextResponse.json({
      message: "Paciente cadastrado com sucesso!",
      paciente,
      arquivos: savedFiles,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
