# AGENTS.md

Tài liệu này dành cho bất kỳ agent (hoặc contributor) nào làm việc trong repo `WMS`.

## 1) Project overview

- Dự án: **Warehouse Management System (WMS)**.
- Backend Node.js + TypeScript theo kiến trúc Express, có worker nền cho queue jobs.

## 2) Stack và runtime chính

- Node.js: `22.21.1` (theo `package.json -> engines`).
- TypeScript + ESM (`"type": "module"`).
- HTTP API: Express 5 (`src/server.ts`, `src/app.ts`).
- Queue/Worker: BullMQ (`src/workers/worker.ts`).
- Database: PostgreSQL + Drizzle ORM.
- Cache/queue broker: Redis.
- Test: Jest (`@swc/jest`).
- Lint/format: ESLint + Prettier.

## 3) Cấu trúc thư mục quan trọng

- `src/server.ts`: entrypoint API server.
- `src/workers/worker.ts`: entrypoint worker xử lý job queue.
- `src/app.ts`: middleware + mount routes.
- `src/routes`, `src/controllers`, `src/services`: luồng xử lý chính.
- `src/database/schemas`: schema Drizzle.
- `drizzle/`: SQL migration đã generate.
- `test/`: unit tests.

## 4) Quy tắc môi trường

- Bắt buộc set `NODE_ENV` trước khi chạy app (`development` hoặc `production`).
- App load file env theo mẫu `.env.${NODE_ENV}` trong root.
- Validate env bằng Zod tại startup; thiếu/sai biến sẽ `process.exit(1)`.

## 5) Build and test commands

- Cài deps: `npm install`
- Dev API + worker: `npm run dev`
- Dev API riêng: `npm run dev:api`
- Dev worker riêng: `npm run dev:worker`
- Build: `npm run build`
- Run production build: `npm run start`
- Test: `npm run test`
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Format: `npm run format`
- DB migrate (dev env file): `npm run dev:db:migrate`
- DB generate (dev env file): `npm run dev:db:generate`
- Drizzle Studio (dev env file): `npm run dev:db:studio`

## 6) Testing instructions

- Test framework: Jest (`jest.config.ts`, transform bằng `@swc/jest`).
- Chạy toàn bộ test: `npm run test`.
- Khi sửa logic có rủi ro, ưu tiên thêm/cập nhật test trong `test/unit/**`.
- Trước khi bàn giao, chạy tối thiểu:
  - `npm run lint`
  - `npm run test`

## 7) Quy trình làm việc khuyến nghị cho agent

1. Đọc nhanh phạm vi file liên quan trước khi sửa.
2. Ưu tiên sửa tối thiểu, đúng mục tiêu; không refactor lan rộng nếu không cần.
3. Khi thay đổi behavior:
   - cập nhật/viết test tương ứng trong `test/` (nếu có thể),
   - chạy tối thiểu `npm run lint` và `npm run test`.
4. Nếu đụng database schema:
   - cập nhật schema trong `src/database/schemas`,
   - generate migration bằng Drizzle,
   - đảm bảo migration mới xuất hiện trong `drizzle/`.
5. Không commit secrets hoặc sửa `.env.*` thật trừ khi được yêu cầu rõ.

## 8) Code style guidelines

- Alias import nội bộ: dùng `~/...` (map tới `src/*`).
- Prettier:
  - `singleQuote: true`
  - `semi: true`
  - `printWidth: 120`
- ESLint đang bật TypeScript type-aware rules cho `src/**/*.{ts,js}`.
- Biến/args không dùng nên đặt prefix `_` để tránh warning lint.

## 9) Git hooks và commit

- `pre-commit`: chạy `lint-staged`.
- `commit-msg`: chạy `commitlint`.
- Có Commitizen (`npm run commit`) và chuẩn Conventional Commits.

## 10) Docker dev (khuyến nghị khi cần full stack local)

- Start: `docker compose -f docker-compose.dev.yml up --build`
- Stop: `docker compose -f docker-compose.dev.yml down`
- Stop + xóa volumes: `docker compose -f docker-compose.dev.yml down -v`

## 11) Security considerations

- Không commit credentials, token, key hoặc dữ liệu nhạy cảm vào repo.
- Không sửa trực tiếp `.env.*` thật trừ khi task yêu cầu rõ.
- Biến môi trường phải đi qua validation (`envSchema`) trước khi runtime.
- Khi thêm endpoint mới:
  - xác định rõ route public/private,
  - route private phải đi qua `authenticate`,
  - validate input bằng lớp validation hiện có.
- Khi xử lý upload/file:
  - giữ kiểm tra kiểu file + middleware validate,
  - không tin tưởng filename từ client.

## 12) Definition of done cho mỗi thay đổi

- Code compile/lint pass trong phạm vi thay đổi.
- Không phá vỡ flow API/worker hiện có.
- Đã cân nhắc side effects với queue, DB migration, và env validation.
- Có ghi chú ngắn trong PR/commit về:
  - thay đổi gì,
  - lý do,
  - cách verify.
