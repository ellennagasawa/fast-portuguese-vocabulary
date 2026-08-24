# Fast Portuguese — Banco de Vocabulário

Aplicação estática para hospedar no GitHub Pages e incorporar no Canvas.

## Arquitetura

Um único aplicativo contém **seis datasets permanentes**:

- `data/unit1.js`
- `data/unit2.js`
- `data/unit3.js`
- `data/unit4.js`
- `data/unit5.js`
- `data/unit6.js`

Os alunos podem trocar de unidade a qualquer momento. Não é necessário substituir
arquivos durante o semestre.

A Unidade 1 já está preenchida. As Unidades 2–6 estão criadas como datasets vazios
para receber o vocabulário quando o conteúdo de cada unidade for finalizado.

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

A aplicação entende o parâmetro `?unit=`. Assim, depois de publicada:

- página geral: `https://SEU-USUARIO.github.io/fast-portuguese-vocabulary/`
- Unidade 1: `...?unit=1`
- Unidade 2: `...?unit=2`
- ...
- Unidade 6: `...?unit=6`

Mesmo quando um aluno entra por uma URL específica, o seletor de unidade permanece
disponível para revisar qualquer outra unidade.

## GitHub Pages

1. Crie o repositório `fast-portuguese-vocabulary`.
2. Faça upload de todos os arquivos e da pasta `data`.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e `/ (root)`.
6. Salve.
7. Aguarde o endereço `https://SEU-USUARIO.github.io/fast-portuguese-vocabulary/`.

## Canvas

O arquivo `canvas-embeds.txt` contém:
- um embed geral para uma página de Recursos;
- embeds específicos para cada Unidade 1–6.

Substitua `YOUR_GITHUB_PAGES_URL` pelo endereço publicado.

## Progresso do aluno

“Já sei” e “Praticar novamente” são armazenados em `localStorage`.
Isso significa:
- não há login adicional;
- nenhum dado é enviado ao GitHub;
- o progresso fica no navegador/dispositivo usado pelo aluno;
- trocar de unidade não apaga o progresso das outras unidades.

## Atualização dos datasets

Podemos preencher todos os seis arquivos antes do início/ao longo do redesign e deixá-los
permanentemente no repositório. Não é necessário remover uma unidade para adicionar outra.
