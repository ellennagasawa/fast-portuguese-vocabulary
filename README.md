# Banco de Vocabulário — Português

Aplicação estática de prática interativa de vocabulário para hospedar no GitHub Pages e incorporar em um LMS.

## Arquitetura

Um único aplicativo contém **seis datasets permanentes**:

- `data/unit1.js`
- `data/unit2.js`
- `data/unit3.js`
- `data/unit4.js`
- `data/unit5.js`
- `data/unit6.js`

Os alunos podem trocar de unidade a qualquer momento.

## Estrutura do repositório

```text
fast-portuguese-vocabulary/
├── index.html
├── styles.css
├── app.js
├── README.md
├── canvas-embeds.txt
└── data/
    ├── unit1.js
    ├── unit2.js
    ├── unit3.js
    ├── unit4.js
    ├── unit5.js
    └── unit6.js
```

## URLs diretas por unidade

A aplicação entende o parâmetro `?unit=`. Assim:

- página geral: `https://SEU-USUARIO.github.io/fast-portuguese-vocabulary/`
- Unidade 1: `...?unit=1`
- Unidade 2: `...?unit=2`
- ...
- Unidade 6: `...?unit=6`

Mesmo quando um aluno entra por uma URL específica, o seletor de unidade permanece
disponível para revisar qualquer outra unidade.

## Canvas

O arquivo `canvas-embeds.txt` contém:
- um embed geral para uma página de Recursos;
- embeds específicos para cada Unidade 1–6.

## Progresso do aluno

“Já sei” e “Praticar novamente” são armazenados em `localStorage`.
Isso significa:
- não há login adicional;
- nenhum dado é enviado ao GitHub;
- o progresso fica no navegador/dispositivo usado pelo aluno;
- trocar de unidade não apaga o progresso das outras unidades.

## Créditos e adaptação

Flashcard page created by Ellen Nagasawa
https://ellennagasawa.github.io

Vocabulary content selected and adapted from:

FERNANDES, Eugênia; DE OLIVEIRA SILVA, Leonardo; ALMEIDA, Camila; MELLO, Tatiana. Plural: Português pluricêntrico. 2. ed. Boavista Press, 2023.

Interactive adaptation for vocabulary practice by Ellen Nagasawa.
