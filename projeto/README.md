# Sistema de Controle de Processos - Hospital Público

Sistema web para controle e monitoramento de processos do setor de compras de hospital público.

## 🚀 Funcionalidades

- ✅ Upload de planilhas Excel (.xlsx, .xls)
- ✅ Dashboard com métricas visuais
- ✅ Filtros avançados (setor, modalidade, status)
- ✅ Painel lateral com observações detalhadas
- ✅ Persistência de dados (localStorage)
- ✅ Design moderno e responsivo
- ✅ Códigos de cores por permanência dos processos

## 🛠️ Tecnologias

- React 18
- Vite
- XLSX (para processamento de planilhas)
- CSS moderno com gradientes

## 📦 Instalação

```bash
npm install
```

## 🔧 Desenvolvimento

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🌐 Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure o build command: `npm run build`
3. Configure o output directory: `dist`
4. Deploy!

## 📊 Como Usar

1. Faça upload de uma planilha Excel com os dados dos processos
2. Visualize as métricas no dashboard
3. Use os filtros para encontrar processos específicos
4. Clique em qualquer processo para ver observações detalhadas
5. Os dados ficam salvos automaticamente no navegador

## 🎨 Design

- Fundo azul marinho profissional
- Cards com glassmorphism
- Códigos de cores por permanência:
  - 🟢 Verde: < 7 dias (Normal)
  - 🟡 Laranja: 7-15 dias (Atenção)
  - 🔴 Vermelho: > 15 dias (Crítico)

Desenvolvido para facilitar o trabalho da gestora do setor de compras.

