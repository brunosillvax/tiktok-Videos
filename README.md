# 🎬 AutoReel TikTok Publisher

Uma aplicação SaaS premium para automatizar a publicação de Reels do Instagram no TikTok com tecnologia de ponta e design moderno.

## ✨ Características

- **🎯 Monitoramento Inteligente**: Detecta novos Reels em perfis do Instagram automaticamente
- **📱 Publicação Automatizada**: Posta Reels diretamente no TikTok com legendas otimizadas
- **📊 Analytics Avançados**: Acompanhe o desempenho e engajamento dos seus vídeos em tempo real
- **🎨 Design Moderno**: Interface com glassmorphism, gradientes e animações fluidas
- **⚡ Performance**: Construído com Next.js, FastAPI e PostgreSQL
- **🐳 Containerizado**: Deploy fácil com Docker e Docker Compose

## 🚀 Tecnologias

### Frontend
- **Next.js 14** com TypeScript
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **React Icons** para ícones
- **Responsive Design** (Mobile-First)

### Backend
- **FastAPI** com Python
- **PostgreSQL** como banco de dados
- **SQLAlchemy** para ORM
- **Celery** com Redis para tarefas em background
- **JWT** para autenticação
- **WebSockets** para atualizações em tempo real

### DevOps
- **Docker** e **Docker Compose**
- **Nginx** (para produção)
- **Redis** para cache e message broker

## 📦 Instalação

### Pré-requisitos
- Docker e Docker Compose
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/autoreel-tiktok-publisher.git
cd autoreel-tiktok-publisher
```

### 2. Configure as variáveis de ambiente
```bash
cp env.example docker.env
# Edite docker.env com suas configurações
```

### 3. Execute com Docker
```bash
docker-compose up -d
```

### 4. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs

## 🎯 Funcionalidades

### Dashboard
- Visão geral das estatísticas
- Atividade recente em tempo real
- Top reels com melhor performance
- Configuração rápida de perfis

### Perfis Monitorados
- Adicionar/remover perfis do Instagram
- Configurar intervalos de verificação
- Status ativo/inativo dos perfis
- Histórico de posts por perfil

### Reels & Vídeos
- Lista de todos os reels baixados
- Filtros por status (pendente, publicado, falhou)
- Analytics de performance (views, likes, engajamento)
- Links diretos para TikTok

### Analytics
- Métricas detalhadas de performance
- Insights da audiência
- Padrões de engajamento
- Gráficos de crescimento
- Seleção de períodos (7d, 30d, 90d, 1y)

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Database
POSTGRES_SERVER=db
POSTGRES_PORT=5432
POSTGRES_USER=autoreel
POSTGRES_PASSWORD=autoreel_password
POSTGRES_DB=autoreel_db

# JWT
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS
CORS_ORIGINS=http://localhost:3000

# TikTok API
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=http://localhost:8000/api/v1/tiktok/callback

# Celery
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

## 📊 Estrutura do Projeto

```
autoreel-tiktok-publisher/
├── frontend/                 # Aplicação Next.js
│   ├── src/
│   │   ├── app/             # Páginas da aplicação
│   │   ├── components/      # Componentes reutilizáveis
│   │   └── lib/            # Utilitários e API client
│   ├── public/             # Arquivos estáticos
│   └── package.json
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/            # Endpoints da API
│   │   ├── core/           # Configurações e database
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Schemas Pydantic
│   │   ├── services/       # Serviços de negócio
│   │   └── tasks/          # Tarefas Celery
│   └── requirements.txt
├── docker-compose.yml       # Configuração Docker
├── Dockerfile              # Dockerfile do frontend
└── README.md
```

## 🔌 APIs Disponíveis

### Dashboard
- `GET /api/v1/dashboard/stats` - Estatísticas do dashboard
- `GET /api/v1/dashboard/recent-activity` - Atividade recente
- `GET /api/v1/dashboard/top-performing-reels` - Top reels

### Perfis
- `GET /api/v1/profiles` - Lista perfis monitorados
- `GET /api/v1/profiles/stats` - Estatísticas dos perfis

### Reels
- `GET /api/v1/reels` - Lista reels com filtros
- `GET /api/v1/reels/stats` - Estatísticas dos reels
- `GET /api/v1/reels/top-performing` - Top reels

### Analytics
- `GET /api/v1/analytics/metrics` - Métricas de analytics
- `GET /api/v1/analytics/top-reels` - Top reels
- `GET /api/v1/analytics/audience-insights` - Insights da audiência
- `GET /api/v1/analytics/performance-chart` - Dados para gráficos

## 🎨 Design System

### Cores
- **Primária**: Gradiente roxo-rosa (#8B5CF6 → #EC4899)
- **Secundária**: Gradiente azul-ciano (#3B82F6 → #06B6D4)
- **Sucesso**: Verde (#10B981)
- **Aviso**: Amarelo (#F59E0B)
- **Erro**: Vermelho (#EF4444)

### Tipografia
- **Títulos**: Sora (Google Fonts)
- **Corpo**: Inter (Google Fonts)

### Componentes
- **Glassmorphism**: Efeitos de vidro com backdrop-blur
- **Gradientes**: Backgrounds dinâmicos com animações
- **Botões**: Efeitos hover e transições suaves
- **Cards**: Bordas arredondadas e sombras

## 🚀 Deploy

### Desenvolvimento
```bash
docker-compose up -d
```

### Produção
```bash
# Configure as variáveis de ambiente para produção
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Bruno** - *Desenvolvimento inicial* - [@brunosillvax](https://github.com/BrunoSillvax)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [FastAPI](https://fastapi.tiangolo.com/) - Framework Python
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca de animações

---

⭐ **Se este projeto te ajudou, não esqueça de dar uma estrela!**
