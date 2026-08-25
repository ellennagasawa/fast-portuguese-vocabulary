# Banco de Vocabulário — Português

Aplicação estática de prática interativa de vocabulário para hospedar no GitHub Pages e incorporar em um LMS.

## Conteúdo

O aplicativo reúne **15 datasets permanentes**, correspondentes às Unidades 1–15 da seção **Apoio linguístico | usos** de *Plural: Português pluricêntrico*.

Os alunos podem:
- escolher qualquer unidade a qualquer momento;
- filtrar o vocabulário por categoria;
- estudar Português → English ou English → Português;
- embaralhar os cartões;
- marcar cartões como **Já sei** ou **Praticar novamente**;
- voltar às unidades anteriores para revisão cumulativa.

Quando uma unidade ocupa mais de uma página no livro, todo o conteúdo foi reunido no mesmo dataset. Isso ocorre, por exemplo, nas Unidades 5 e 13.

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
    ├── unit6.js
    ├── unit7.js
    ├── unit8.js
    ├── unit9.js
    ├── unit10.js
    ├── unit11.js
    ├── unit12.js
    ├── unit13.js
    ├── unit14.js
    └── unit15.js
```

## URLs diretas por unidade

A página geral é:

`https://ellennagasawa.github.io/fast-portuguese-vocabulary/`

Cada unidade também pode ser aberta diretamente com `?unit=N`, por exemplo:

- Unidade 1: `https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=1`
- Unidade 5: `https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=5`
- Unidade 13: `https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=13`
- Unidade 15: `https://ellennagasawa.github.io/fast-portuguese-vocabulary/?unit=15`

Mesmo quando o aluno entra por uma URL específica, o seletor de unidade continua disponível.

## Progresso do aluno

As opções **Já sei** e **Praticar novamente** são armazenadas em `localStorage`.

Isso significa que:
- não há login adicional;
- nenhum progresso é enviado ao GitHub;
- o progresso fica salvo no navegador/dispositivo utilizado;
- mudar de unidade não apaga o progresso das outras unidades.

## Créditos e adaptação

**Flashcard page created by Ellen Nagasawa**  
https://ellennagasawa.github.io

Vocabulary content selected and adapted from:

FERNANDES, Eugênia; DE OLIVEIRA SILVA, Leonardo; ALMEIDA, Camila; MELLO, Tatiana. [*Plural: Português pluricêntrico*](https://escholarship.org/uc/item/9zs4s2p8). 2. ed. Boavista Press, 2023.

Interactive adaptation for vocabulary practice by Ellen Nagasawa.

## Datasets

- `data/unit1.js` — Unidade 1: Apoio linguístico | usos (108 cartões)
- `data/unit2.js` — Unidade 2: Apoio linguístico | usos (76 cartões)
- `data/unit3.js` — Unidade 3: Apoio linguístico | usos (106 cartões)
- `data/unit4.js` — Unidade 4: Apoio linguístico | usos (91 cartões)
- `data/unit5.js` — Unidade 5: Apoio linguístico | usos (156 cartões)
- `data/unit6.js` — Unidade 6: Apoio linguístico | usos (92 cartões)
- `data/unit7.js` — Unidade 7: Apoio linguístico | usos (101 cartões)
- `data/unit8.js` — Unidade 8: Apoio linguístico | usos (96 cartões)
- `data/unit9.js` — Unidade 9: Apoio linguístico | usos (103 cartões)
- `data/unit10.js` — Unidade 10: Apoio linguístico | usos (99 cartões)
- `data/unit11.js` — Unidade 11: Apoio linguístico | usos (113 cartões)
- `data/unit12.js` — Unidade 12: Apoio linguístico | usos (105 cartões)
- `data/unit13.js` — Unidade 13: Apoio linguístico | usos (206 cartões)
- `data/unit14.js` — Unidade 14: Apoio linguístico | usos (105 cartões)
- `data/unit15.js` — Unidade 15: Apoio linguístico | usos (90 cartões)
