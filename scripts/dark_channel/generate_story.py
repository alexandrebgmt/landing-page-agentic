import sys

def criar_roteiro(tema, personagem, estilo="claymation"):
    estilo = estilo.lower()
    
    if estilo == "claymation" or estilo == "massa":
        estilo_nome = "CLAYMATION / BONECO DE MASSA"
        visual_sufixo = "claymation style, plasticine texture, visible clay fingerprints, stop-motion animation aesthetic, miniature studio lighting, shallow depth of field, handcrafted detailed look, 8k render --ar 16:9"
    elif estilo == "avatar" or estilo == "realista":
        estilo_nome = "AVATAR HYPER-REALISTA (AGÊNCIA)"
        visual_sufixo = "hyper-realistic digital human avatar, professional studio portrait, commercial marketing lighting, 85mm lens, natural skin texture, clean elegant background, 8k resolution --ar 16:9"
    elif estilo == "minecraft":
        estilo_nome = "MINECRAFT / VOXEL 3D"
        visual_sufixo = "cubic voxel art style, Minecraft aesthetics, isometric blocks, volumetric lighting, vibrant textures, 8k render --ar 16:9"
    else:
        estilo_nome = "DISNEY PIXAR 3D"
        visual_sufixo = "Pixar animation style, big expressive eyes, soft cinematic lighting, warm vibrant colors, shallow depth of field, 8k octane render --ar 16:9"

    print(f"\n==========================================")
    print(f"🎬 GERADOR MULTI-ESTILO - {estilo_nome}")
    print(f"==========================================")
    print(f"📖 Campanha / Tema: {tema}")
    print(f"🎭 Personagem / Mascote: {personagem}\n")

    print("--- [CENA 1: APRESENTAÇÃO E GANCHO (0s a 15s)] ---")
    print(f"Fala do Mascote: 'Olá! Você sabia que {tema} pode transformar o seu negócio hoje mesmo?'")
    print(f"🎨 Prompt de Imagem Mestra (Para Animação Labial):")
    print(f"   'A charismatic {personagem} speaking to camera, neutral mouth open pose ready for lip-sync, in {tema} setting, {visual_sufixo}'\n")

    print("--- [CENA 2: DEMONSTRAÇÃO DO VALOR (15s a 45s)] ---")
    print(f"Fala do Mascote: 'Muitas empresas perdem clientes com sites lentos e perfis sem engajamento. Mas com a nossa estratégia, tudo muda!'")
    print(f"🎨 Prompt de Ação:")
    print(f"   'A charismatic {personagem} demonstrating digital growth charts and modern interface, dynamic lighting, {visual_sufixo}'\n")

    print("--- [CENA 3: CHAMADA PARA AÇÃO (CTA) (45s a 60s)] ---")
    print(f"Fala do Mascote: 'Clique no link abaixo e solicite agora a reformulação visual da sua marca!'")
    print(f"🎨 Prompt de Fechamento:")
    print(f"   'A charismatic {personagem} smiling confidently and pointing towards the bottom banner, warm welcoming lighting, {visual_sufixo}'")
    print(f"==========================================\n")

if __name__ == "__main__":
    tema = sys.argv[1] if len(sys.argv) > 1 else "Automação de Vendas"
    personagem = sys.argv[2] if len(sys.argv) > 2 else "Mascote de Massinha"
    estilo = sys.argv[3] if len(sys.argv) > 3 else "claymation"
    criar_roteiro(tema, personagem, estilo)
