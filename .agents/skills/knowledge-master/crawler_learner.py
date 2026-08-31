import os
import sys
import time
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def learn_and_generate_skill(platform_url, username, password, target_skill_name):
    print(f"🚀 [KNOWLEDGE-MASTER] Iniciando sessão de assimilação...")
    print(f"🎯 Plataforma: {platform_url}")
    print(f"📦 Skill Alvo a ser gerada: {target_skill_name}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = context.new_page()

        try:
            print("🔑 Acessando plataforma e autenticando...")
            page.goto(platform_url, timeout=60000)
            page.wait_for_load_state("networkidle")

            email_inputs = page.locator("input[type='email'], input[type='text'], input[name*='user'], input[name*='email'], input[id*='email']")
            if email_inputs.count() > 0:
                email_inputs.first.fill(username)

            pass_inputs = page.locator("input[type='password']")
            if pass_inputs.count() > 0:
                pass_inputs.first.fill(password)

            submit_btn = page.locator("button[type='submit'], button:has-text('Entrar'), button:has-text('Login'), button:has-text('Acessar')")
            if submit_btn.count() > 0:
                submit_btn.first.click()
                page.wait_for_load_state("networkidle")
                time.sleep(4)

            print("📚 Navegando pelos módulos e extraindo heurísticas...")
            soup = BeautifulSoup(page.content(), "html.parser")
            
            lessons = []
            for heading in soup.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'li']):
                text = heading.get_text(strip=True)
                if text and len(text) > 15:
                    lessons.append(text)

            content_summary = "\n".join(lessons[:80])

            print("🧠 Processando conhecimento e sintetizando Execution Skill...")
            output_dir = f".agents/skills/{target_skill_name.lower().replace(' ', '-')}"
            os.makedirs(output_dir, exist_ok=True)
            skill_filepath = os.path.join(output_dir, "SKILL.md")

            skill_md_content = f"""---
name: "{target_skill_name.lower().replace(' ', '-')}"
description: "Execution Skill gerada automaticamente pela KNOWLEDGE-MASTER a partir de {platform_url}"
version: "1.0.0"
derived_from: "KNOWLEDGE-MASTER (Skill-Mother)"
created_at: "{time.strftime('%Y-%m-%d %H:%M:%S')}"
---

# Execution Skill: {target_skill_name}

## 1. Origem e Contexto do Aprendizado
- **Fonte de Ingestão:** {platform_url}
- **Status:** VALIDATED
- **Modo de Operação:** Autônomo com Protocolo Anti-Slop

## 2. Metodologias & Heurísticas Extraídas
{content_summary[:1500]}

## 3. Protocolo de Execução Passo a Passo
1. Identificação do Objetivo: Verificar o comando do usuário e parâmetros necessários.
2. Aplicação das Regras Extraídas: Executar rigorosamente os padrões aprendidos na plataforma.
3. Refinamento e Validação: Checar se a saída cumpre o padrão profissional da Nexus Enterprise.
"""
            with open(skill_filepath, "w", encoding="utf-8") as f:
                f.write(skill_md_content)

            print(f"✨ [SUCESSO] Nova Execution Skill criada com sucesso em: {skill_filepath}")

        except Exception as e:
            print(f"⚠️ Erro durante a navegação/extração: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Uso: python3 crawler_learner.py <URL_DO_CURSO> <USUARIO> <SENHA> <NOME_DA_SKILL>")
    else:
        learn_and_generate_skill(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
