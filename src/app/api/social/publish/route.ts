import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { webhookUrl, clientNiche, brandHandle, postData } = body;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL não configurada.' },
        { status: 400 }
      );
    }

    // Payload estruturado no padrão Meta Graph API / Make / n8n
    const payload = {
      timestamp: new Date().toISOString(),
      platform: 'instagram_facebook_carousel',
      brand_handle: brandHandle,
      niche: clientNiche,
      badge: postData.badge,
      slides_count: postData.slides?.length || 0,
      slides: postData.slides,
      caption: postData.socialCopy,
      origin: 'Nexus Master Suite Agency Engine'
    };

    // Disparo para o Webhook intermediador
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Falha no webhook: ${response.statusText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post e carrossel enviados com sucesso para a esteira de publicação!',
      dispatched_at: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno ao disparar post.' },
      { status: 500 }
    );
  }
}
