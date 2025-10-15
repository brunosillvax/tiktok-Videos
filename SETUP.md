# 🚀 Guia de Configuração - AutoReel TikTok Publisher

Este guia irá te ajudar a configurar e executar o AutoReel TikTok Publisher em seu ambiente local.

## 📋 Pré-requisitos

### Software Necessário
- **Docker** (versão 20.10+) e **Docker Compose** (versão 2.0+)
- **Node.js** (versão 18+) - para desenvolvimento frontend
- **Python** (versão 3.11+) - para desenvolvimento backend
- **Git** - para clonar o repositório

### Contas e APIs Necessárias
1. **TikTok Developer Account**
   - Acesse: https://developers.tiktok.com/
   - Crie uma aplicação
   - Obtenha `Client Key` e `Client Secret`
   - Configure redirect URI: `http://localhost:3000/auth/tiktok/callback`

2. **Proxies Residenciais** (Recomendado)
   - Para evitar bloqueios no Instagram
   - Configure URLs dos proxies no arquivo `.env`

## 🛠️ Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/autoreel.git
cd autoreel
```

### 2. Configure as Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
nano .env  # ou use seu editor preferido
```

### 3. Configurações do Arquivo .env

```env
# Database
DATABASE_URL=postgresql://autoreel:autoreel123@localhost:5432/autoreel_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Security (IMPORTANTE: Mude em produção!)
SECRET_KEY=sua-chave-super-secreta-aqui
JWT_SECRET=sua-chave-jwt-secreta-aqui

# Environment
ENVIRONMENT=development

# TikTok API (Obrigatório)
TIKTOK_CLIENT_KEY=sua-client-key-do-tiktok
TIKTOK_CLIENT_SECRET=seu-client-secret-do-tiktok
TIKTOK_REDIRECT_URI=http://localhost:3000/auth/tiktok/callback

# Instagram Scraping
PROXY_LIST_URL=url-dos-seus-proxies-residenciais
SCRAPING_DELAY_MIN=30
SCRAPING_DELAY_MAX=120

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Security (Produção)
CORS_ORIGINS=http://localhost:3000,https://seudominio.com
RATE_LIMIT_PER_MINUTE=100
```

## 🐳 Execução com Docker (Recomendado)

### Iniciar Todos os Serviços
```bash
# Construir e iniciar todos os containers
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f celery-worker
```

### Serviços Disponíveis
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação da API**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Parar os Serviços
```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados!)
docker-compose down -v
```

## 💻 Desenvolvimento Local

### Frontend (Next.js)
```bash
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

### Backend (FastAPI)
```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Executar servidor
uvicorn app.main:app --reload

# Executar workers Celery
celery -A app.celery worker --loglevel=info
celery -A app.celery beat --loglevel=info
```

## 🔧 Configuração do TikTok

### 1. Criar Aplicação no TikTok
1. Acesse https://developers.tiktok.com/
2. Faça login com sua conta TikTok
3. Clique em "Create App"
4. Preencha as informações:
   - **App Name**: AutoReel
   - **Category**: Business
   - **Description**: Sistema de automação para postagem de Reels

### 2. Configurar Permissões
- ✅ Login Kit
- ✅ Display API
- ✅ Content Posting API
- ✅ Scopes: `user.info.basic`, `video.publish`

### 3. Obter Credenciais
- Copie `Client Key` e `Client Secret`
- Adicione no arquivo `.env`

## 📊 Monitoramento e Logs

### Logs do Sistema
```bash
# Ver todos os logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend | grep ERROR
docker-compose logs -f celery-worker | grep "New Reel detected"
```

### Acessar Banco de Dados
```bash
# Conectar ao PostgreSQL
docker-compose exec db psql -U autoreel -d autoreel_db

# Ver tabelas
\dt

# Ver logs da aplicação
SELECT * FROM application_logs ORDER BY timestamp DESC LIMIT 10;
```

### Redis Monitor
```bash
# Conectar ao Redis
docker-compose exec redis redis-cli

# Ver estatísticas
INFO stats

# Ver filas do Celery
KEYS celery*
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Conexão com TikTok API
```
TikTok API error: Invalid client credentials
```
**Solução**: Verifique se `TIKTOK_CLIENT_KEY` e `TIKTOK_CLIENT_SECRET` estão corretos no `.env`

#### 2. Falha no Scraping do Instagram
```
Instagram API error: Challenge required
```
**Solução**: 
- Configure proxies residenciais
- Aumente os delays (`SCRAPING_DELAY_MIN`, `SCRAPING_DELAY_MAX`)
- Use diferentes User-Agents

#### 3. Erro de Banco de Dados
```
Database connection failed
```
**Solução**: 
- Verifique se o PostgreSQL está rodando: `docker-compose ps`
- Reinicie o banco: `docker-compose restart db`

#### 4. Frontend não carrega
```
Cannot connect to API
```
**Solução**: 
- Verifique se o backend está rodando na porta 8000
- Confirme `NEXT_PUBLIC_API_URL` no `.env`

### Comandos Úteis

```bash
# Reiniciar um serviço específico
docker-compose restart backend

# Ver uso de recursos
docker-compose top

# Limpar cache do Docker
docker system prune -a

# Reconstruir containers
docker-compose up --build

# Ver status dos serviços
docker-compose ps
```

## 🔐 Segurança em Produção

### Checklist de Segurança
- [ ] Alterar todas as senhas padrão
- [ ] Configurar HTTPS
- [ ] Usar variáveis de ambiente seguras
- [ ] Configurar WAF (Cloudflare)
- [ ] Habilitar rate limiting
- [ ] Configurar backup automático do banco
- [ ] Monitorar logs de segurança

### Configurações de Produção
```env
# Produção
ENVIRONMENT=production
DEBUG=false

# URLs de produção
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_WS_URL=wss://api.seudominio.com

# CORS restritivo
CORS_ORIGINS=https://seudominio.com

# Chaves seguras (use geradores online)
SECRET_KEY=chave-super-secreta-de-64-caracteres
JWT_SECRET=jwt-secret-key-de-64-caracteres
```

## 📈 Monitoramento Avançado

### Métricas Importantes
- Taxa de sucesso de postagens
- Tempo de processamento médio
- Uso de proxies
- Erros da API do TikTok
- Performance do banco de dados

### Alertas Recomendados
- Falha na API do TikTok
- Taxa de erro > 10%
- Tempo de processamento > 5min
- Uso de CPU > 80%
- Espaço em disco < 20%

## 🆘 Suporte

### Recursos de Ajuda
- **Documentação**: [docs.autoreel.com](https://docs.autoreel.com)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/autoreel/issues)
- **Discord**: [Comunidade AutoReel](https://discord.gg/autoreel)

### Informações para Suporte
Ao solicitar suporte, inclua:
1. Versão do Docker: `docker --version`
2. Logs de erro: `docker-compose logs backend`
3. Configuração (sem credenciais): `cat .env | grep -v SECRET`
4. Sistema operacional: `uname -a`

---

**🎉 Parabéns! Seu AutoReel está pronto para automatizar seus Reels!**

Para dúvidas específicas, consulte a documentação completa ou entre em contato com o suporte.
