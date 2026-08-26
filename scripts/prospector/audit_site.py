import sys
import os
import time
import urllib.request
import ssl
import json

def auditar_url(url):
    if not url.startswith("http://") and not url.startswith("https://"):
        url_alvo = "https://" + url
    else:
        url_alvo = url

    inicio = time.time()
    resultado = {
        "url": url,
        "url_completa": url_alvo,
        "online": False,
        "codigo_http": None,
        "tempo_resposta_seg": None,
        "tamanho_kb": None,
        "pontos_de_dor": [],
        "proposta_copy": ""
    }

    try:
        contexto_ssl = ssl.create_default_context()
        req = urllib.request.Request(
            url_alvo,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        
        with urllib.request.urlopen(req, timeout=8, context=contexto_ssl) as resposta:
            duracao = round(time.time() - inicio, 2)
            codigo = resposta.getcode()
            conteudo = resposta.read()
            tamanho_kb = round(len(conteudo) / 1024, 2)

            resultado["online"] = True
            resultado["codigo_http"] = codigo
            resultado["tempo_resposta_seg"] = duracao
            resultado["tamanho_kb"] = tamanho_kb

            if duracao > 2.5:
                resultado["pontos_de_dor"].append(f"Carregamento lento ({duracao}s). O ideal é abaixo de 1.5s.")
            if tamanho_kb > 3000:
                resultado["pontos_de_dor"].append(f"Página pesada ({tamanho_kb} KB), consumindo dados móveis dos visitantes.")

    except Exception as e:
        resultado["pontos_de_dor"].append(f"Falha de resposta ou certificado SSL ({str(e)}).")

    if not resultado["pontos_de_dor"]:
        resultado["pontos_de_dor"].append("Infraestrutura básica estável. Oportunidade em conversão visual e 3D interativo.")

    # Geração de abordagem persuasiva (Copywriting)
    dores_texto = " ".join(resultado["pontos_de_dor"])
    resultado["proposta_copy"] = (
        f"Olá! Realizamos uma análise técnica no site {url} e identificamos gargalos que afetam a conversão de clientes: "
        f"{dores_texto} Podemos implementar uma arquitetura moderna com carregamento instantâneo e identidade visual premium."
    )

    return resultado

def processar_auditoria(lista_sites):
    pasta_output = os.path.join("output", "auditorias_prospeccao")
    os.makedirs(pasta_output, exist_ok=True)

    relatorios = []
    print("\n==========================================")
    print(f"🔍 AUDITORIA EM LOTE - {len(lista_sites)} SITES")
    print("==========================================")

    for site in lista_sites:
        site = site.strip()
        if not site:
            continue
        print(f"AudDataSource: Testando {site}...")
        dados = auditar_url(site)
        relatorios.append(dados)

        status_icone = "✅" if dados["online"] else "❌"
        print(f"{status_icone} {site} | Tempo: {dados['tempo_resposta_seg']}s | Falhas: {len(dados['pontos_de_dor'])}")

    caminho_json = os.path.join(pasta_output, "relatorio_geral.json")
    with open(caminho_json, "w", encoding="utf-8") as f:
        json.dump(relatorios, f, indent=2, ensure_ascii=False)

    caminho_txt = os.path.join(pasta_output, "mensagens_prospeccao.txt")
    with open(caminho_txt, "w", encoding="utf-8") as f:
        for item in relatorios:
            f.write(f"SITE: {item['url']}\n")
            f.write(f"STATUS: {'ONLINE' if item['online'] else 'OFFLINE'} (HTTP {item['codigo_http']})\n")
            f.write(f"PONTOS DE ATENÇÃO: {'; '.join(item['pontos_de_dor'])}\n")
            f.write(f"MENSAGEM DE CONTATO:\n{item['proposta_copy']}\n")
            f.write("-" * 50 + "\n\n")

    print("\n==========================================")
    print(f" Relatórios salvos em '{pasta_output}'!")
    print(f"📄 Arquivo de mensagens: {caminho_txt}")
    print("==========================================\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sites = sys.argv[1].split(",")
    else:
        sites = ["google.com", "exemplo-site-inexistente-123.com.br", "wikipedia.org"]
    processar_auditoria(sites)
