# SkillChain - Инструкция по развертыванию

Этот документ содержит инструкции по развертыванию приложения SkillChain на любой машине с использованием Docker.

## Требования

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)
- Google Gemini API ключ

## Быстрый старт с Docker Compose

### 1. Клонируйте репозиторий

```bash
git clone <repository-url>
cd chainskill
```

### 2. Настройте переменные окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите:
- `GEMINI_API_KEY` - ваш API ключ от Google Gemini
- `DB_PASSWORD` - пароль для базы данных PostgreSQL

### 3. Запустите приложение

```bash
docker-compose up -d
```

Это запустит:
- PostgreSQL базу данных на порту 5432
- SkillChain приложение на порту 5000

### 4. Проверьте статус

```bash
docker-compose ps
```

Приложение доступно по адресу: http://localhost:5000

## Управление приложением

### Просмотр логов

```bash
docker-compose logs -f app
```

### Остановка приложения

```bash
docker-compose down
```

### Остановка с удалением данных

```bash
docker-compose down -v
```

### Перезапуск приложения

```bash
docker-compose restart app
```

## Развертывание только Docker (без Docker Compose)

### 1. Создайте Docker сеть

```bash
docker network create skillchain-network
```

### 2. Запустите PostgreSQL

```bash
docker run -d \
  --name skillchain-db \
  --network skillchain-network \
  -e POSTGRES_USER=skillchain \
  -e POSTGRES_PASSWORD=changeme123 \
  -e POSTGRES_DB=skillchain \
  -v skillchain-db-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```

### 3. Соберите образ приложения

```bash
docker build -t skillchain-app .
```

### 4. Запустите приложение

```bash
docker run -d \
  --name skillchain-app \
  --network skillchain-network \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e DATABASE_URL=postgresql://skillchain:changeme123@skillchain-db:5432/skillchain \
  -e GEMINI_API_KEY=your_api_key_here \
  skillchain-app
```

## Развертывание в продакшене

### Рекомендации по безопасности

1. **Используйте сильные пароли** для базы данных
2. **Настройте HTTPS** через reverse proxy (nginx, traefik, caddy)
3. **Используйте переменные окружения** для секретов
4. **Регулярно обновляйте** Docker образы
5. **Настройте backup** базы данных

### Пример с Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Обновление приложения

```bash
# Остановите текущую версию
docker-compose down

# Получите последние изменения
git pull

# Пересоберите и запустите
docker-compose up -d --build
```

## Миграции базы данных

Миграции применяются автоматически при запуске приложения. Если нужно применить вручную:

```bash
docker-compose exec app npm run db:push
```

## Резервное копирование базы данных

### Создание backup

```bash
docker-compose exec postgres pg_dump -U skillchain skillchain > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из backup

```bash
docker-compose exec -T postgres psql -U skillchain skillchain < backup_file.sql
```

## Мониторинг

### Просмотр использования ресурсов

```bash
docker stats skillchain-app skillchain-db
```

### Проверка здоровья контейнеров

```bash
docker-compose ps
docker inspect skillchain-app
```

## Устранение неполадок

### Приложение не запускается

1. Проверьте логи: `docker-compose logs app`
2. Убедитесь, что база данных запущена: `docker-compose ps postgres`
3. Проверьте переменные окружения в `.env`

### База данных недоступна

1. Проверьте статус: `docker-compose ps postgres`
2. Проверьте логи: `docker-compose logs postgres`
3. Убедитесь, что порт 5432 не занят

### Ошибки API

1. Проверьте GEMINI_API_KEY в `.env`
2. Убедитесь, что API ключ активен на https://aistudio.google.com/

## Дополнительная информация

Для получения API ключа Gemini:
1. Перейдите на https://aistudio.google.com/apikey
2. Войдите с аккаунтом Google
3. Нажмите "Create API Key"
4. Скопируйте созданный ключ в `.env`

## Поддержка

Если возникли вопросы, создайте issue в репозитории проекта.
