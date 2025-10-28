# SkillChain - Полная инструкция по развертыванию

Этот документ содержит подробные инструкции по развертыванию приложения SkillChain на любой машине или сервере.

---

## 📋 Содержание

1. [Требования](#требования)
2. [Быстрый старт с Docker Compose](#быстрый-старт-с-docker-compose)
3. [Развертывание на VPS/сервере](#развертывание-на-vpsсервере)
4. [Развертывание на Replit](#развертывание-на-replit)
5. [Важная информация о единой базе данных](#важная-информация-о-единой-базе-данных)
6. [Настройка переменных окружения](#настройка-переменных-окружения)
7. [Управление приложением](#управление-приложением)
8. [Безопасность в продакшене](#безопасность-в-продакшене)
9. [Мониторинг и обслуживание](#мониторинг-и-обслуживание)
10. [Устранение неполадок](#устранение-неполадок)

---

## ✅ Требования

### Минимальные требования
- **CPU:** 2 ядра
- **RAM:** 2 GB
- **Диск:** 10 GB свободного места
- **ОС:** Linux (Ubuntu 20.04+), macOS, Windows (с WSL2)

### Программное обеспечение
- **Docker** версия 20.10+ ([Установить](https://docs.docker.com/get-docker/))
- **Docker Compose** версия 2.0+ ([Установить](https://docs.docker.com/compose/install/))
- **Git** для клонирования репозитория
- **Node.js 20+** (если запуск без Docker)
- **PostgreSQL 16+** (если запуск без Docker)

### API ключи и кошельки
- **Google Gemini API Key** - [Получить здесь](https://aistudio.google.com/apikey)
- **Solana Wallet** - Приватный ключ в Base58 формате для минтинга NFT
- **Devnet SOL** - Для транзакций и минтинга (получить через [faucet](https://faucet.solana.com/))

---

## 🚀 Быстрый старт с Docker Compose

Самый простой способ развернуть SkillChain.

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/your-username/skillchain.git
cd skillchain
```

### 2. Создайте файл переменных окружения

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите обязательные параметры:

```env
# База данных (оставьте как есть для Docker Compose)
DATABASE_URL=postgresql://skillchain:changeme123@postgres:5432/skillchain

# Google Gemini AI (ОБЯЗАТЕЛЬНО)
GEMINI_API_KEY=AIzaSyC...your-api-key

# Solana Wallet (ОБЯЗАТЕЛЬНО)
METAPLEX_PRIVATE_KEY=5K7mW...your-base58-private-key
PLATFORM_WALLET=GN8u7fSnRBtvx...your-public-key

# Server
NODE_ENV=production
PORT=5000
```

### 3. Запустите все сервисы

```bash
docker-compose up -d
```

Это автоматически:
- ✅ Скачает и запустит PostgreSQL базу данных
- ✅ Соберет Docker образ приложения
- ✅ Применит миграции базы данных
- ✅ Запустит веб-сервер на порту 5000

### 4. Проверьте статус

```bash
docker-compose ps
```

Вы должны увидеть:
```
NAME                COMMAND             STATUS              PORTS
skillchain-app      "npm start"         Up X minutes        0.0.0.0:5000->5000/tcp
skillchain-db       "postgres"          Up X minutes        0.0.0.0:5432->5432/tcp
```

### 5. Откройте приложение

Перейдите в браузере по адресу: **http://localhost:5000**

🎉 Готово! Приложение работает.

---

## 🌐 Развертывание на VPS/сервере

Инструкция для развертывания на удаленном сервере (DigitalOcean, AWS, Hetzner и т.д.).

### Шаг 1: Подготовьте сервер

```bash
# Подключитесь к серверу
ssh root@your-server-ip

# Обновите систему
apt update && apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
apt install docker-compose-plugin -y

# Установите Git
apt install git -y
```

### Шаг 2: Клонируйте проект

```bash
cd /opt
git clone https://github.com/your-username/skillchain.git
cd skillchain
```

### Шаг 3: Настройте переменные окружения

```bash
cp .env.example .env
nano .env
```

Важные параметры для продакшена:

```env
# База данных - используйте сильный пароль!
DATABASE_URL=postgresql://skillchain:STRONG_PASSWORD_HERE@postgres:5432/skillchain

# Google Gemini AI
GEMINI_API_KEY=your-real-api-key

# Solana Wallet - используйте отдельный кошелек для продакшена!
METAPLEX_PRIVATE_KEY=your-production-private-key
PLATFORM_WALLET=your-production-public-key

# Server
NODE_ENV=production
PORT=5000
```

**⚠️ ВАЖНО:** Используйте разные кошельки для Devnet и Mainnet!

### Шаг 4: Запустите приложение

```bash
docker-compose up -d
```

### Шаг 5: Настройте Nginx (Reverse Proxy + HTTPS)

#### Установите Nginx и Certbot

```bash
apt install nginx certbot python3-certbot-nginx -y
```

#### Создайте конфигурацию Nginx

```bash
nano /etc/nginx/sites-available/skillchain
```

Вставьте следующее:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Увеличенные лимиты для больших запросов
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Форвардинг IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Таймауты (для медленных NFT минтинга)
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
    }
}
```

#### Активируйте конфигурацию

```bash
ln -s /etc/nginx/sites-available/skillchain /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Установите SSL сертификат (HTTPS)

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

Следуйте инструкциям Certbot. После установки ваш сайт будет доступен по HTTPS!

### Шаг 6: Настройте автозапуск

Docker Compose уже настроен на автоматический перезапуск контейнеров:

```yaml
restart: unless-stopped
```

Для дополнительной надежности создайте systemd service:

```bash
nano /etc/systemd/system/skillchain.service
```

```ini
[Unit]
Description=SkillChain Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/skillchain
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable skillchain
systemctl start skillchain
```

### Шаг 7: Настройте Firewall

```bash
# Разрешите SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 🟣 Развертывание на Replit

Replit поддерживает автоматическое развертывание с встроенной базой данных.

### Шаг 1: Настройте Secrets

В Replit перейдите в **Tools → Secrets** и добавьте:

```
GEMINI_API_KEY = your-api-key
METAPLEX_PRIVATE_KEY = your-base58-private-key
PLATFORM_WALLET = your-public-key
DATABASE_URL = (Replit создаст автоматически при создании PostgreSQL)
```

### Шаг 2: Создайте PostgreSQL базу данных

1. Откройте панель **Database** в Replit
2. Нажмите **Create PostgreSQL Database**
3. Replit автоматически добавит `DATABASE_URL` в Secrets

### Шаг 3: Настройте Deployment

1. Перейдите в **Deployment** в Replit
2. Выберите **VM** (для постоянного запуска)
3. Build command: `npm run build`
4. Run command: `npm start`
5. Нажмите **Deploy**

### Шаг 4: Получите публичный URL

После развертывания Replit предоставит URL вида:
```
https://your-repl-name.your-username.repl.co
```

---

## 🗄️ Важная информация о единой базе данных

### Что означает "единый скилпул"?

Когда вы развертываете SkillChain на **одном сервере с одной базой данных**, все пользователи будут видеть:

✅ **Общую статистику DAO:**
- Общее количество валидаторов
- Общее количество выданных сертификатов
- Общий доход платформы
- Единый Treasury (казна)

✅ **Общий реестр навыков:**
- Все тесты и сертификаты хранятся в одной БД
- Топ навыки по популярности
- Статистика по категориям

✅ **Единую экономику:**
- Все платежи (0.15 SOL) идут на один кошелек
- Награды распределяются из одного источника
- DAO управление единое для всех

### Блокчейн компоненты

NFT сертификаты минтятся на **публичном блокчейне Solana**, поэтому:
- ✅ NFT видны всем пользователям Solana
- ✅ Сертификаты можно проверить на Solana Explorer
- ✅ NFT можно передавать/продавать на маркетплейсах
- ✅ Метаданные хранятся на Arweave (децентрализованно)

### Несколько инстансов (Advanced)

Если вы хотите запустить **несколько независимых инстансов** SkillChain:

```bash
# Инстанс 1
docker-compose -p skillchain-dev up -d

# Инстанс 2 (на другом порту)
docker-compose -p skillchain-prod -f docker-compose.prod.yml up -d
```

Каждый инстанс будет иметь:
- Свою базу данных
- Свой скилпул
- Свою статистику
- Свой кошелек для платежей

---

## ⚙️ Настройка переменных окружения

### Обязательные переменные

| Переменная | Описание | Как получить |
|------------|----------|--------------|
| `GEMINI_API_KEY` | Google Gemini API ключ | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `METAPLEX_PRIVATE_KEY` | Base58 приватный ключ Solana | Экспортируйте из Phantom: Settings → Export Private Key → Base58 |
| `PLATFORM_WALLET` | Публичный адрес для получения платежей | Ваш Solana адрес кошелька |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### Опциональные переменные

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `NODE_ENV` | `development` | Режим: `development` или `production` |
| `PORT` | `5000` | Порт веб-сервера |
| `SOLANA_RPC_URL` | Devnet RPC | Кастомный RPC endpoint (для mainnet) |

### Получение Google Gemini API Key

1. Перейдите на [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Войдите с Google аккаунтом
3. Нажмите **"Create API Key"**
4. Выберите проект или создайте новый
5. Скопируйте ключ (формат: `AIzaSyC...`)

**Лимиты бесплатного плана:**
- 60 запросов в минуту
- 1,500 запросов в день
- Достаточно для тестирования и небольшого трафика

### Получение Solana Private Key (Base58)

**⚠️ ВНИМАНИЕ:** Никогда не используйте основной кошелек! Создайте отдельный для минтинга.

#### Вариант 1: Phantom Wallet

1. Откройте Phantom
2. Settings → Export Private Key
3. Введите пароль
4. Скопируйте **Base58** ключ (начинается с цифры, ~88 символов)

#### Вариант 2: Solana CLI

```bash
# Создайте новый кошелек
solana-keygen new --outfile ~/.config/solana/skillchain-minter.json

# Получите Base58 приватный ключ
cat ~/.config/solana/skillchain-minter.json

# Получите публичный адрес
solana-keygen pubkey ~/.config/solana/skillchain-minter.json
```

#### Пополните кошелек Devnet SOL

```bash
# Airdrop 2 SOL
solana airdrop 2 YOUR_PUBLIC_KEY --url devnet

# Или используйте Web Faucet: https://faucet.solana.com/
```

**Для продакшена (Mainnet):**
- Пополните кошелек реальными SOL (~1-2 SOL для минтинга)
- Храните приватный ключ в безопасности
- Используйте аппаратный кошелек для больших сумм

---

## 🎛️ Управление приложением

### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Только приложение
docker-compose logs -f app

# Только база данных
docker-compose logs -f postgres

# Последние 100 строк
docker-compose logs --tail=100 app
```

### Остановка приложения

```bash
# Остановить без удаления данных
docker-compose stop

# Остановить и удалить контейнеры (данные сохранятся)
docker-compose down

# Остановить и удалить ВСЁ (включая базу данных!)
docker-compose down -v
```

### Перезапуск приложения

```bash
# Перезапустить все сервисы
docker-compose restart

# Перезапустить только приложение
docker-compose restart app
```

### Обновление приложения

```bash
# Остановите текущую версию
docker-compose down

# Получите последние изменения из Git
git pull origin main

# Пересоберите и запустите
docker-compose up -d --build

# Проверьте логи
docker-compose logs -f app
```

### Применение миграций базы данных

Миграции применяются автоматически при старте. Если нужно вручную:

```bash
docker-compose exec app npm run db:push
```

### Доступ к базе данных

```bash
# Подключитесь к PostgreSQL
docker-compose exec postgres psql -U skillchain

# Внутри psql:
\dt              # Показать таблицы
\d+ certificates # Описание таблицы
SELECT * FROM certificates LIMIT 5;
\q               # Выход
```

---

## 🔐 Безопасность в продакшене

### Чек-лист безопасности

- [ ] **Сильные пароли** для базы данных (минимум 20 символов)
- [ ] **HTTPS** настроен через Nginx + Let's Encrypt
- [ ] **Firewall** настроен (открыты только 80, 443, 22)
- [ ] **Приватные ключи** хранятся только в `.env` (не в Git!)
- [ ] **Регулярные бэкапы** базы данных
- [ ] **Мониторинг** логов и ошибок
- [ ] **Rate limiting** для API эндпоинтов
- [ ] **Обновления** Docker образов и пакетов
- [ ] **Отдельный кошелек** для минтинга (не основной)
- [ ] **SSH ключи** вместо паролей для доступа к серверу

### Настройка автоматических бэкапов

Создайте cron job для ежедневных бэкапов:

```bash
crontab -e
```

Добавьте:

```bash
# Бэкап базы данных каждый день в 3:00 AM
0 3 * * * cd /opt/skillchain && docker-compose exec -T postgres pg_dump -U skillchain skillchain | gzip > /backup/skillchain_$(date +\%Y\%m\%d).sql.gz

# Удаление бэкапов старше 30 дней
0 4 * * * find /backup -name "skillchain_*.sql.gz" -mtime +30 -delete
```

### Ротация логов

Docker автоматически управляет логами, но можно настроить лимиты:

Отредактируйте `docker-compose.yml`:

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Мониторинг безопасности

```bash
# Установите fail2ban для защиты от брутфорса
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban

# Настройте автоматические обновления
apt install unattended-upgrades -y
dpkg-reconfigure --priority=low unattended-upgrades
```

---

## 📊 Мониторинг и обслуживание

### Мониторинг использования ресурсов

```bash
# Реал-тайм мониторинг Docker контейнеров
docker stats skillchain-app skillchain-db

# Проверка места на диске
df -h

# Проверка использования памяти
free -h

# Топ процессов
top
```

### Проверка здоровья приложения

```bash
# Статус контейнеров
docker-compose ps

# Health check приложения
curl http://localhost:5000/api/health

# Проверка базы данных
docker-compose exec postgres pg_isready -U skillchain
```

### Анализ логов

```bash
# Поиск ошибок
docker-compose logs app | grep ERROR

# Подсчет запросов по эндпоинтам
docker-compose logs app | grep "GET /api" | cut -d' ' -f5 | sort | uniq -c | sort -rn

# Просмотр последних ошибок
docker-compose logs --tail=50 app | grep -i error
```

### Резервное копирование и восстановление

#### Создание полного бэкапа

```bash
# Бэкап базы данных
docker-compose exec postgres pg_dump -U skillchain skillchain > backup_$(date +%Y%m%d_%H%M%S).sql

# Бэкап .env файла
cp .env .env.backup

# Создание архива всего проекта
tar -czf skillchain-backup-$(date +%Y%m%d).tar.gz \
  .env docker-compose.yml backup_*.sql
```

#### Восстановление из бэкапа

```bash
# Восстановление базы данных
docker-compose exec -T postgres psql -U skillchain skillchain < backup_20251028_120000.sql

# Или через gzip
gunzip -c backup_20251028.sql.gz | docker-compose exec -T postgres psql -U skillchain skillchain
```

---

## 🔧 Устранение неполадок

### Приложение не запускается

**Проблема:** `docker-compose up` выдает ошибку

**Решение:**
```bash
# 1. Проверьте логи
docker-compose logs app

# 2. Проверьте синтаксис .env
cat .env

# 3. Проверьте доступность порта 5000
lsof -i :5000
# Или
netstat -tuln | grep 5000

# 4. Пересоберите образ
docker-compose build --no-cache
docker-compose up -d
```

### База данных недоступна

**Проблема:** `Error: connect ECONNREFUSED`

**Решение:**
```bash
# 1. Проверьте статус PostgreSQL
docker-compose ps postgres

# 2. Проверьте логи БД
docker-compose logs postgres

# 3. Проверьте DATABASE_URL в .env
echo $DATABASE_URL

# 4. Перезапустите БД
docker-compose restart postgres

# 5. Если ничего не помогает, пересоздайте
docker-compose down
docker-compose up -d
```

### Ошибки минтинга NFT

**Проблема:** `Error minting NFT` или `Insufficient funds`

**Решение:**
```bash
# 1. Проверьте баланс кошелька для минтинга
solana balance YOUR_PLATFORM_WALLET --url devnet

# Должно быть минимум 0.01 SOL

# 2. Пополните если нужно
solana airdrop 2 YOUR_PLATFORM_WALLET --url devnet

# 3. Проверьте METAPLEX_PRIVATE_KEY в .env
# Убедитесь что это Base58 формат (~88 символов)

# 4. Проверьте логи
docker-compose logs app | grep -i "metaplex\|nft\|mint"
```

### API ошибки Gemini

**Проблема:** `403 Forbidden` или `Invalid API key`

**Решение:**
```bash
# 1. Проверьте GEMINI_API_KEY в .env
cat .env | grep GEMINI

# 2. Проверьте квоту API
# Перейдите на https://aistudio.google.com/apikey
# Проверьте использование и лимиты

# 3. Создайте новый API ключ если нужно

# 4. Перезапустите после изменения .env
docker-compose restart app
```

### Медленная работа приложения

**Проблема:** Долгая загрузка или таймауты

**Решение:**
```bash
# 1. Проверьте использование ресурсов
docker stats

# 2. Увеличьте лимиты памяти
# Отредактируйте docker-compose.yml:
services:
  app:
    mem_limit: 1g
    mem_reservation: 512m

# 3. Оптимизируйте PostgreSQL
docker-compose exec postgres psql -U skillchain -c "VACUUM ANALYZE;"

# 4. Очистите старые логи
docker system prune -a
```

### Проблемы с HTTPS/SSL

**Проблема:** Сертификат не работает или истек

**Решение:**
```bash
# 1. Проверьте статус сертификата
certbot certificates

# 2. Обновите сертификат
certbot renew

# 3. Перезапустите Nginx
systemctl restart nginx

# 4. Если certbot не работает, попробуйте заново
certbot --nginx -d your-domain.com --force-renewal
```

### Ошибки миграции базы данных

**Проблема:** `Migration failed` или несовместимая схема

**Решение:**
```bash
# 1. Сделайте бэкап!
docker-compose exec postgres pg_dump -U skillchain skillchain > backup_before_migration.sql

# 2. Примените миграции принудительно
docker-compose exec app npm run db:push --force

# 3. Если не помогает, пересоздайте БД (ПОТЕРЯ ДАННЫХ!)
docker-compose down -v
docker-compose up -d

# 4. Восстановите данные из бэкапа
docker-compose exec -T postgres psql -U skillchain skillchain < backup_before_migration.sql
```

---

## 📚 Дополнительные ресурсы

### Полезные ссылки

- 📖 [Solana Documentation](https://docs.solana.com/)
- 🎨 [Metaplex Docs](https://docs.metaplex.com/)
- 🤖 [Google Gemini API](https://ai.google.dev/docs)
- 🐳 [Docker Documentation](https://docs.docker.com/)
- 🐘 [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Сообщество и поддержка

- 💬 [GitHub Issues](https://github.com/your-repo/issues)
- 🐦 [Twitter/X](https://twitter.com/skillchain)
- 📱 [Telegram Community](https://t.me/skillchain)
- 📧 Email: support@skillchain.com

---

## ✅ Чек-лист после развертывания

Убедитесь что все работает:

- [ ] Приложение доступно по HTTP/HTTPS
- [ ] Solana кошелек подключается
- [ ] Можно сгенерировать тест (AI работает)
- [ ] Можно пройти тест и получить результат
- [ ] NFT сертификат минтится
- [ ] Награда приходит на кошелек
- [ ] Профиль отображает все сертификаты
- [ ] DAO страница показывает статистику
- [ ] Логи не содержат критических ошибок
- [ ] База данных работает стабильно
- [ ] Бэкапы настроены и работают
- [ ] HTTPS сертификат валиден
- [ ] Firewall настроен правильно
- [ ] Мониторинг работает

---

## 🎉 Готово!

Ваш SkillChain успешно развернут и готов к использованию!

Если возникли вопросы или проблемы, создайте issue в репозитории или свяжитесь с нами.

**Happy Minting! 🚀**
