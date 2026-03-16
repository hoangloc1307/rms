# RMS Dev With Docker

Project nay co the dev bang Docker trong khi van code tren may that qua bind mount.

## Chay local stack

```bash
docker compose -f docker-compose.dev.yml up --build
```

Services:

- API + worker: `http://localhost:5000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`
- MailHog UI: `http://localhost:8025`

## Cach hoat dong

- Source code duoc mount tu thu muc hien tai vao container `/app`, nen sua code tren may that se duoc `tsx watch` reload trong container.
- App container dung `.env.docker`, vi vay hostname noi bo se la `postgres`, `redis`, `mailhog` thay vi `localhost`.
- Khi app start, compose se chay `npm run db:migrate` truoc roi moi chay `npm run dev`.
- Tren Docker Desktop tren Windows/macOS, bind mount doi khi khong day du file-watch event. Compose da bat polling de app restart on dinh hon khi sua source tren host.

## Dung lai

```bash
docker compose -f docker-compose.dev.yml down
```

Neu muon xoa ca volume DB/Redis:

```bash
docker compose -f docker-compose.dev.yml down -v
```
