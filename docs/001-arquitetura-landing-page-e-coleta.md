# ADR 001: Arquitetura da Landing Page & Ingestão de Leads

## 1. Contexto e Problema

Construção de uma página de alta conversão para serviços de Engenharia de Dados e auditoria de pipelines. O sistema precisa coletar leads com validação de payload no servidor e isolamento de banco de dados.

## 2. Decisão Técnica

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS para minificação nativa e performance máxima.
- **Validação de Schema:** Biblioteca Zod para sanitização dos dados antes de qualquer persistência.
- **Segurança e Banco:** Supabase (PostgreSQL) com políticas de Row-Level Security (RLS) ativas.
- **Proteção:** Honeypot e Rate Limiting nas rotas de coleta.

## 3. Consequências e Trade-offs

- **Vantagens:** Arquitetura defensiva, compliance com LGPD e código pronto para auditoria técnica.
- **Requisitos:** Variáveis de ambiente isoladas em produção.
