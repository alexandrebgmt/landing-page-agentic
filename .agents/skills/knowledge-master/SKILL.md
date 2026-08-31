---
name: knowledge-master
description: "Fábrica de Conhecimento e Skill-Mother. Absorve cursos brutos, extrai metodologias/heurísticas e gera Execution Skills filhas operacionais."
version: "1.0.0"
status: "VALIDATED"
---

# KNOWLEDGE-MASTER // Skill-Mother Specification

## 1. Objetivo Principal
Atuar como uma "Fábrica de Habilidades". Quando o usuário fornecer acesso a um novo curso, material de marketing, design ou código, a KNOWLEDGE-MASTER:
1. Acessa a plataforma de membros com credenciais fornecidas.
2. Mapeia a estrutura de aulas, módulos e transcrições.
3. Extrai heurísticas, macetes e regras empíricas.
4. Gera uma nova Execution Skill filha dentro de `.agents/skills/<nome-da-skill>/SKILL.md`.

## 2. Diretrizes de Segurança & Anti-Slop
- Zero Hardcoded Secrets: Proibido armazenar credenciais ou tokens em arquivos permanentes.
- Padrão BrandKit: As skills visuais geradas devem seguir o padrão 3x3 e identidade visual do ecossistema Nexus.
