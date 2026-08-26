import { NextResponse } from "next/server";
import { LeadSchema } from "@/lib/schema";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.bot_field && body.bot_field.trim() !== "") {
      return NextResponse.json({ success: true, message: "Lead processado com sucesso" });
    }

    const validatedData = LeadSchema.parse(body);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { error } = await supabase.from("leads").insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          company: validatedData.company,
          data_volume: validatedData.dataVolume,
          challenge: validatedData.pipelineChallenge,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Erro Supabase:", error);
      }
    } else {
      console.log("Lead recebido em modo local (Mock):", validatedData);
    }

    return NextResponse.json({ success: true, message: "Lead processado com sucesso" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, errors: error.errors || error.message || "Dados inválidos" },
      { status: 400 }
    );
  }
}
