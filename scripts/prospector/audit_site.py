import sys
import time
import urllib.request
import ssl

def auditar_site(url):
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    print(f"\n==========================================")
    print(f"🔍 AUDITANDO: {url}")
    print(f"==========================================")

    inicio = time.time()
    try:
        contexto_ssl = ssl.create_default_context()
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        
        with urllib.request.urlopen(req, timeout=10, context=contexto_ssl) as resposta:
            duracao = round(time.time() - inicio, 2)
            codigo = resposta.getcode()
            tamanho_kb = round(len(resposta.read()) / 1024, 2)

            print(f"✅ Status do Site: Online (Código HTTP {codigo})")
            print(f"⏱️ Tempo de Resposta: {duracao} segundos")
            print(f"📦 Tamanho da Página: {tamanho_kb} KB")

            if duracao > 3.0:
                print("⚠️ PONTO DE DOR: Site lento (demora mais de 3s para responder).")
            else:
                print("⚡ Velocidade: Boa resposta inicial.")

    except Exception as e:
        print(f"❌ PROBLEMA ENCONTRADO: O site falhou ao carregar ({e}).")
        print("💡 OPORTUNIDADE: Cliente precisa de uma infraestrutura moderna e segura.")

    print(f"==========================================\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        site_alvo = sys.argv[1]
    else:
        site_alvo = "exemplo.com.br"
    auditar_site(site_alvo)
