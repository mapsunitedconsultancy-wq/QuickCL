---
version: "alpha"
name: "Apple HIG (pre-Liquid flat)"
description: "Sistema visual Apple HIG (pre-Liquid flat), traduzido do catálogo Claude Artisan para uso em produtos digitais. Deference: content over chrome; SF Pro type, generous spacing, subtle depth"
colors:
  primary: "#007aff"
  background: "#f2f2f7"
  surface: "#ffffff"
  text: "#1c1c1e"
  accent: "#34c759"
  on-primary: "#000000"
  on-surface: "#000000"
  on-accent: "#000000"
typography:
  h1:
    fontFamily: "-apple-system, 'SF Pro Display', sans-serif"
    fontSize: "4rem"
    fontWeight: "700"
    lineHeight: "1.05"
  body-md:
    fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.6"
  label-caps:
    fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif"
    fontSize: "0.75rem"
    fontWeight: "600"
    letterSpacing: "0.06em"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-secondary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    padding: "16px"
---
## Overview

Sistema visual Apple HIG (pre-Liquid flat), traduzido do catálogo Claude Artisan para uso em produtos digitais. Deference: content over chrome; SF Pro type, generous spacing, subtle depth

- **Categoria:** Flat, material & plataformas
- **Era:** 2013–2025
- **Origem:** Apple, iOS 7 through iOS 18.
- **Exemplo:** iOS 7–18; macOS pre-Tahoe.
- **Base estrutural:** hero, superfície, conteúdo e grade responsiva

**Traços definidores:**
- Deference: content over chrome
- SF Pro type, generous spacing, subtle depth
- Blur/vibrancy accents, clarity
- Consistent system controls

## Colors

- **bg** — #f2f2f7
- **surface** — #ffffff
- **surface-strong** — #f9f9fb
- **border** — rgba(60, 60, 67, 0.29)
- **text** — #1c1c1e
- **text-muted** — #48484a
- **primary** — #007aff
- **accent** — #34c759

## Typography

- Display: -apple-system, 'SF Pro Display', sans-serif
- Corpo: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif
- Mono: 'SF Mono', ui-monospace, monospace

## Layout

- hero, superfície, conteúdo e grade responsiva
- Use uma grade responsiva e preserve a hierarquia de conteúdo.
- Colapse colunas abaixo de 768px sem overflow horizontal.

## Elevation & Depth

- Deference: content over chrome; SF Pro type, generous spacing, subtle depth; Blur/vibrancy accents, clarity; Consistent system controls; sombras e elevação; transparência e blur

## Shapes

- Raios: 8px, 14px, 20px.

## Components

- Botões mantêm foco visível e estados hover/pressed previsíveis.
- Cartões usam a superfície e a escala de raios definidas nos tokens.
- Formulários exibem labels persistentes, erro textual e foco por teclado.

## Do's and Don'ts

- Faça: respeite os tokens e a composição estrutural indicada.
- Faça: mantenha contraste WCAG AA e `prefers-reduced-motion`.
- Evite: usar o estilo como decoração sem hierarquia funcional.
