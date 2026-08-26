import { NextResponse } from "next/server";
import { LeadSchema } from "@/lib/schema";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = LeadSchema.parse(body);

    if (validatedData.honeypot) {
      return NextResponse.json({ error: "Spam detectado" }, { status: 400 });
    }

    console.log(">> [PIPELINE DE DADOS] Novo Lead Validado:", {
      timestamp: new Date().toISOString(),
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company,
      volume: validatedData.dataVolume,
    });

    return NextResponse.json(
      { message: "Lead recebido e validado com sucesso" },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 422 });
    }
    return NextResponse.json(
      { error: "Erro interno no processamento do payload" },
      { status: 500 },
    );
  }
}
