import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TELEGRAM_BOT_TOKEN = '8207055928:AAH7xGjubUfbRr9LqSwcPxff7I5-a-cGZUs';
const TELEGRAM_CHAT_ID = '5191019660';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, data_volume, bottleneck } = body;

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Nome, e-mail e empresa são obrigatórios.' },
        { status: 400 }
      );
    }

    // 1. Gravar lead no Supabase
    const { data, error: dbError } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          company,
          data_volume: data_volume || 'Não informado',
          bottleneck: bottleneck || 'Não informado',
          status: 'Novo'
        }
      ])
      .select();

    if (dbError) {
      console.error('Erro no Supabase:', dbError);
    }

    // 2. Disparar notificação formatada para o Telegram
    const message = `🚀 *NOVO LEAD CAPTURADO - NEXUSDATA* 🚀\n\n` +
      `👤 *Nome:* ${name}\n` +
      `🏢 *Empresa:* ${company}\n` +
      `📧 *E-mail:* ${email}\n` +
      `📊 *Volume de Dados:* ${data_volume || 'N/A'}\n` +
      `⚠️ *Gargalo / Desafio:* ${bottleneck || 'N/A'}\n\n` +
      `⚡ _Acesse o painel Nexus Admin para gerenciar._`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro na rota /api/lead:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar lead.' },
      { status: 500 }
    );
  }
}
