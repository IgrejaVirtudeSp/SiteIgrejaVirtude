# Site Igreja Virtude

Site estático (HTML/CSS/JS puro) — sem build, sem framework. É só subir os arquivos.

## 📁 Estrutura
```
virtude-site/
├── index.html      → a página (estrutura)
├── styles.css      → todo o visual
├── script.js       → navegação, tema e o AUTO-SYNC (YouTube + Google Agenda)
├── config.js       → onde você liga o auto-sync (chave da API + agenda)
├── dados.json      → conteúdo fixo (agenda, ministérios, valores, mensagens)
├── assets/         → imagens (logos, fotos, capas)
└── fonts/          → fontes da marca (Bauhaus + Work Sans, self-hosted)
```

> Funciona **offline/fixo por padrão**. O auto-sync é opcional e, se falhar, o site
> usa o conteúdo de `dados.json` — **nunca fica quebrado**.

---

## 🚀 Como subir (deploy)

### Opção A — Git no cPanel (recomendado)
1. No **cPanel → Git Version Control → Create**.
2. Aponte o **Repository Path** e conecte ao seu repositório (onde este projeto está).
3. Em **Pull or Deploy → Deploy HEAD Commit**, e configure o *deploy* para a pasta
   `public_html` (ou o subdomínio, ex.: `public_html/site`).
   - Dica: um arquivo `.cpanel.yml` na raiz pode copiar os arquivos automaticamente
     para `public_html` a cada deploy (peça pro suporte do Gubax se tiver dúvida).
4. Toda vez que der **push** no repositório, é só **Update / Deploy** no cPanel.

### Opção B — Upload manual
- Suba **o conteúdo** da pasta `virtude-site/` para dentro de `public_html`
  (o `index.html` tem que ficar na raiz do domínio).

> ⚠️ Sirva sempre por **HTTP/HTTPS** (o cPanel já faz isso). Abrir o `index.html`
> por duplo-clique (file://) não carrega o `dados.json`.

---

## 🔌 Como LIGAR o auto-sync (YouTube + Google Agenda)

Tudo usa **uma única chave** do Google. Passo a passo:

### 1) Criar a chave de API
1. Acesse **console.cloud.google.com** e crie um projeto (ex.: "Site Virtude").
2. **APIs e serviços → Biblioteca** → ative:
   - **YouTube Data API v3**
   - **Google Calendar API**
3. **APIs e serviços → Credenciais → Criar credencial → Chave de API** → copie a chave.
4. (Segurança) Em **Restrições da chave**:
   - *Restrições de aplicativo* → **Referenciadores HTTP** → adicione `igrejavirtude.com.br/*`
   - *Restrições de API* → marque só **YouTube Data API v3** e **Google Calendar API**

### 2) Deixar a Google Agenda pública
1. No Google Agenda, abra as **Configurações** da agenda da igreja.
2. **Permissões de acesso → Tornar disponível ao público** (ver todos os detalhes).
3. Em **Integrar agenda**, copie o **ID da agenda**
   (algo como `xxxxx@group.calendar.google.com`).

### 3) Preencher o config.js
Abra `config.js` e cole:
```js
window.VIRTUDE_CONFIG = {
  googleApiKey: "SUA_CHAVE_AQUI",
  calendarId: "xxxxx@group.calendar.google.com",
  youtubeChannelId: "UChNaIs-7gpr4ZTaHYXpV8RQ"
};
```
Salve, faça o deploy — pronto. As **Mensagens** passam a vir dos últimos vídeos do
YouTube e a **Agenda** dos eventos da Google Agenda, automaticamente.

> Enquanto o `googleApiKey` estiver vazio, o site mostra o conteúdo fixo de `dados.json`.

---

## ✏️ Como editar o conteúdo fixo

- **Textos/agenda/ministérios/valores/mensagens** → edite o `dados.json`.
- **Imagens dos cards** → troque o arquivo em `assets/` mantendo o mesmo nome
  (ex.: `assets/hero.jpg`, `assets/pilar-palavra.jpg`, `assets/mensagem-1.jpg`).
- **Botão "Acesse nosso sistema"** → o link está no `index.html` (procure por `dinastia-igreja-app`).

---

## 🔎 Observações
- **Work Sans** e **Bauhaus** estão em `fonts/` (self-hosted). Nada depende de CDN externo.
- A fonte Bauhaus usa o mesmo arquivo para os pesos normal e bold (o arquivo bold
  original estava corrompido; o regular cobre tudo).
- As **capas fixas** das Mensagens são as thumbnails atuais dos vídeos; quando o
  auto-sync liga, elas passam a vir direto do YouTube.
