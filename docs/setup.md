# Environment Setup — YATRIK

Everything needed to run the project on a fresh machine. Pin these versions.

## Prerequisites & versions

| Tool | Version | Notes |
|------|---------|-------|
| **JDK** | **Temurin 21** (LTS) | Project targets Java 21 (`pom.xml` → `java.version`). JDK 17 will **not** compile it. |
| **Maven** | 3.9.x | Or just use the bundled wrapper `./mvnw` (no global install needed). |
| **PostgreSQL** | **18** | Server on `localhost:5432`. |
| **Node.js** | 20 LTS+ | Frontend only (Phase 1+). Not needed for the backend. |
| **Stripe** | account + CLI (optional) | Only for real payments. Without keys, checkout/webhook are safe no-ops. |

### Install (Windows, via [Scoop](https://scoop.sh))
```bash
scoop bucket add java
scoop install temurin21-jdk
scoop install maven          # optional — ./mvnw works without it
```
PostgreSQL 18 is easiest via the [EnterpriseDB installer](https://www.postgresql.org/download/windows/)
(installs a Windows service `postgresql-x64-18`). Remember the **password you set for the `postgres` superuser** — the app needs it.

Point Maven at JDK 21 if your default `JAVA_HOME` is older:
```bash
export JAVA_HOME="$HOME/scoop/apps/temurin21-jdk/current"   # Git Bash
```
```powershell
$env:JAVA_HOME = "$HOME\scoop\apps\temurin21-jdk\current"    # PowerShell
```

## Database

The app connects as user `postgres` to database `yatrikdb`. Create the database once:

```bash
# use the password you chose during PostgreSQL install
createdb -h localhost -U postgres yatrikdb
# or, from psql:  CREATE DATABASE yatrikdb;
```
Schema is created automatically by Hibernate (`ddl-auto: update`) on first boot.

## Configuration (environment variables)

`application.yaml` reads these, each with a dev default so it runs out-of-the-box once the
DB password matches. Override any of them without touching the repo:

| Variable | Default | Purpose |
|----------|---------|---------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/yatrikdb` | JDBC URL |
| `DB_USERNAME` | `postgres` | DB user |
| `DB_PASSWORD` | `1009` | **Set this to your real `postgres` password** |
| `JWT_SECRET` | *(dev key in yaml)* | HMAC signing key (≥ 32 bytes). Use a real secret in prod. |
| `FRONTEND_URL` | `http://localhost:5173` | Vite dev origin — CORS + Stripe redirect base |
| `STRIPE_SECRET_KEY` | *(empty)* | Leave empty for dev no-op checkout |
| `STRIPE_WEBHOOK_SECRET` | *(empty)* | Leave empty to ignore webhooks in dev |

Example (Git Bash):
```bash
export DB_PASSWORD=yourRealPostgresPassword
```
PowerShell:
```powershell
$env:DB_PASSWORD = "yourRealPostgresPassword"
```

## Run

```bash
./mvnw spring-boot:run
```

- API base URL: **http://localhost:8080/api/v1**
- Swagger UI: **http://localhost:8080/api/v1/swagger-ui.html**
- OpenAPI JSON: **http://localhost:8080/api/v1/v3/api-docs**

## Smoke test (no frontend needed)

```bash
BASE=http://localhost:8080/api/v1

# 1. Sign up a guest (returns { token, user })
curl -s -X POST $BASE/auth/signup -H 'Content-Type: application/json' \
  -d '{"name":"Asha","email":"asha@example.com","password":"pass123"}'

# 2. Log in
curl -s -X POST $BASE/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"asha@example.com","password":"pass123"}'

# 3. Current user (use the token from above)
curl -s $BASE/auth/me -H "Authorization: Bearer <TOKEN>"

# 4. Search hotels (POST — search criteria go in the body)
curl -s -X POST $BASE/hotels/search -H 'Content-Type: application/json' \
  -d '{"city":"Pune","startDate":"2026-09-10","endDate":"2026-09-12","roomsCount":1}'
```
To create a hotel manager, add `"roles":["HOTEL_MANAGER"]` to the signup body.

## Troubleshooting

- **`release version 21 not supported`** → Maven is running on JDK < 21. Set `JAVA_HOME` to Temurin 21 (see above).
- **`password authentication failed for user "postgres"`** → `DB_PASSWORD` doesn't match your Postgres install. Set the env var or update the default.
- **`database "yatrikdb" does not exist`** → run the `createdb` step above.
- **Port 5432 in use / wrong server** → another Postgres instance is running; stop it or point `DB_URL` at the right one.
