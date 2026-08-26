import sys
import os
import re
from gtts import gTTS

def sanitizar_nome(texto):
    return re.sub(r'[^a-zA-Z0-9_-]', '_', texto.lower())

def criar_roteiro_completo(tema, personagem, estilo="claymation", gerar_audio=True):
    estilo = estilo.lower()
    
    if estilo in ["claymation", "massa"]:
        estilo_nome = "CLAYMATION / BONECO DE MASSA"
        visual_sufixo = "claymation style, plasticine texture, visible clay fingerprints, stop-motion animation aesthetic, miniature studio lighting, shallow depth of field, handcrafted detailed look, 8k render --ar 16:9"
    elif estilo in ["avatar", "realista"]:
        estilo_nome = "AVATAR HYPER-REALISTA (AGÊNCIA)"
        visual_sufixo = "hyper-realistic digital human avatar, professional studio portrait, commercial marketing lighting, 85mm lens, natural skin texture, clean elegant background, 8k resolution --ar 16:9"
    elif estilo == "minecraft":
        estilo_nome = "MINECRAFT / VOXEL 3D"
        visual_sufixo = "cubic voxel art style, Minecraft aesthetics, isometric blocks, volumetric lighting, vibrant textures, 8k render --ar 16:9"
    else:
        estilo_nome = "DISNEY PIXAR 3D"
        visual_sufixo = "Pixar animation style, big expressive eyes, soft cinematic lighting, warm vibrant colors, shallow depth of field, 8k octane render --ar 16:9"

    pasta_slug = sanitizar_nome(f"{tema}_{personagem}_{estilo}")
    pasta_output = os.path.join("output", pasta_slug)
    os.makedirs(pasta_output, exist_ok=True)

    cenas = [
        {
            "id": "cena_01",
            "titulo": "CENA 1: APRESENTAÇÃO E GANCHO (0s a 15s)",
            "fala": f"Olá! Você sabia que {tema} pode transformar os seus resultados hoje mesmo?",
            "prompt": f"A charismatic {personagem} speaking to camera, neutral mouth open pose ready for lip-sync, in {tema} setting, {visual_sufixo}"
        },
        {
            "id": "cena_02",
            "titulo": "CENA 2: DEMONSTRAÇÃO DO VALOR (15s a 45s)",
            "fala": "Muitas empresas perdem clientes com páginas lentas e perfis sem engajamento. Mas com a nossa estratégia digital, tudo muda!",
            "prompt": f"A charismatic {personagem} demonstrating digital growth charts and modern interface, dynamic lighting, {visual_sufixo}"
        },
        {
            "id": "cena_03",
            "titulo": "CENA 3: CHAMADA PARA AÇÃO (45s a 60s)",
            "fala": "Clique no link abaixo e solicite agora a análise da sua marca com a nossa equipe!",
            "prompt": f"A charismatic {personagem} smiling confidently and pointing towards the bottom banner, warm welcoming lighting, {visual_sufixo}"
        }
    ]

    print(f"\n==========================================")
    print(f"🎬 GERADOR MULTI-ESTILO & VOZ - {estilo_nome}")
    print(f"📁 Pasta de Saída: {pasta_output}")
    print(f"==========================================")

    caminho_roteiro = os.path.join(pasta_output, "roteiro_e_prompts.txt")
    with open(caminho_roteiro, "w", encoding="utf-8") as f:
        f.write(f"CAMPAIGN: {tema}\nPERSONAGEM: {personagem}\nESTILO: {estilo_nome}\n\n")

        for cena in cenas:
            print(f"\n--- [{cena['titulo']}] ---")
            print(f"🗣️ Fala: '{cena['fala']}'")
            print(f"🎨 Prompt: {cena['prompt']}")

            f.write(f"[{cena['titulo']}]\n")
            f.write(f"Fala: {cena['fala']}\n")
            f.write(f"Prompt: {cena['prompt']}\n\n")

            if gerar_audio:
                arquivo_audio = os.path.join(pasta_output, f"{cena['id']}.mp3")
                tts = gTTS(text=cena['fala'], lang='pt', tld='com.br', slow=False)
                tts.save(arquivo_audio)
                print(f"🔊 Áudio gerado: {arquivo_audio}")

    print(f"\n==========================================")
    print(f"✅ Pacote completo gerado com sucesso em '{pasta_output}'!")
    print(f"==========================================\n")

if __name__ == "__main__":
    tema = sys.argv[1] if len(sys.argv) > 1 else "Landing Pages 3D"
    personagem = sys.argv[2] if len(sys.argv) > 2 else "Mascote de Massinha"
    estilo = sys.argv[3] if len(sys.argv) > 3 else "claymation"
    criar_roteiro_completo(tema, personagem, estilo)
