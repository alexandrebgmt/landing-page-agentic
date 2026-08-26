import sys

def criar_roteiro(tema, personagem, estilo="pixar"):
    estilo = estilo.lower()
    
    if estilo == "minecraft":
        estilo_nome = "MINECRAFT / VOXEL 3D"
        visual_sufixo = "cubic voxel art style, Minecraft aesthetics, isometric blocks, volumetric lighting, vibrant textures, 8k render, ray tracing --ar 16:9"
    else:
        estilo_nome = "DISNEY PIXAR 3D"
        visual_sufixo = "Pixar animation style, big expressive eyes, soft cinematic lighting, warm vibrant colors, shallow depth of field, 8k octane render --ar 16:9"

    print(f"\n==========================================")
    print(f"🎬 GERADOR DE ROTEIRO - {estilo_nome}")
    print(f"==========================================")
    print(f"📖 Tema: {tema}")
    print(f"🐾 Personagem: {personagem}\n")

    print("--- [ATO 1: O GANCHO (0s a 15s)] ---")
    print(f"Narração: 'Era uma vez {personagem}, que decidiu explorar {tema} em busca de uma grande aventura!'")
    print(f"🎨 Prompt Visual:")
    print(f"   'A cute 3D {personagem} beginning an adventure in {tema}, {visual_sufixo}'\n")

    print("--- [ATO 2: O DESAFIO (15s a 45s)] ---")
    print(f"Narração: 'De repente, um mistério bloqueou o caminho... mas desistir nunca foi uma opção!'")
    print(f"🎨 Prompt Visual:")
    print(f"   'A cute 3D {personagem} discovering a mysterious glowing secret in {tema}, {visual_sufixo}'\n")

    print("--- [ATO 3: A VITÓRIA E LIÇÃO (45s a 60s)] ---")
    print(f"Narração: 'Com coragem e trabalho em equipe, a missão foi um sucesso! Qual aventura devemos viver na próxima vez?'")
    print(f"🎨 Prompt Visual:")
    print(f"   'A joyful 3D {personagem} celebrating victory with sparkles and warm ambient light in {tema}, {visual_sufixo}'")
    print(f"==========================================\n")

if __name__ == "__main__":
    tema = sys.argv[1] if len(sys.argv) > 1 else "o Templo de Diamante"
    personagem = sys.argv[2] if len(sys.argv) > 2 else "um Gatinho Explorador"
    estilo = sys.argv[3] if len(sys.argv) > 3 else "minecraft"
    criar_roteiro(tema, personagem, estilo)
