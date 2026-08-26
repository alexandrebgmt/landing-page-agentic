import sys

def criar_roteiro_pixar(tema, personagem):
    print(f"\n==========================================")
    print(f"🎬 GERADOR DE ROTEIRO PIXAR 3D - CANAL DARK")
    print(f"==========================================")
    print(f"📖 Tema: {tema}")
    print(f"🐾 Personagem Principal: {personagem}\n")

    print("--- [ATO 1: O GANCHO (0s a 15s)] ---")
    print(f"Narração: 'Era uma vez {personagem}, que tinha um sonho muito especial: descobrir o segredo de {tema}!'")
    print("🎨 Prompt Visual (Pixar 3D):")
    print(f"   'A cute 3D animated {personagem}, Pixar style, big expressive eyes, smiling curiously, soft morning sunlight, vibrant colors, shallow depth of field, 8k render, octane render style --ar 16:9'\n")

    print("--- [ATO 2: O DESAFIO (15s a 45s)] ---")
    print(f"Narração: 'Mas no caminho, {personagem} encontrou um grande mistério que parecia impossível de resolver...'")
    print("🎨 Prompt Visual (Pixar 3D):")
    print(f"   'A cute 3D animated {personagem} facing a magical glowing puzzle in a lush colorful forest, cinematic lighting, wondering expression, highly detailed textures, Pixar aesthetic --ar 16:9'\n")

    print("--- [ATO 3: A VITÓRIA E A LIÇÃO (45s a 60s)] ---")
    print(f"Narração: 'Com paciência e a ajuda dos amigos, tudo deu certo! E você, o que aprendeu com {personagem} hoje?'")
    print("🎨 Prompt Visual (Pixar 3D):")
    print(f"   'A joyful 3D animated {personagem} celebrating with friends, warm golden hour lighting, sparkles and confetti, heartwarming atmosphere, cinematic Disney Pixar style --ar 16:9'")
    print(f"==========================================\n")

if __name__ == "__main__":
    tema = "a Floresta Encantada" if len(sys.argv) < 2 else sys.argv[1]
    personagem = "um Esquilo Curioso" if len(sys.argv) < 3 else sys.argv[2]
    criar_roteiro_pixar(tema, personagem)
