# How to run

Hosting the server on Vercel eliminates the need for a Docker setup in production, as Vercel handles deployment and scaling automatically. However, for development and testing, containers are used to ensure a consistent environment and improve reproducibility.

&nbsp;

## Requirements

- Node 20 (NVM is strongly recommended to manage version)
- Docker & Docker Compose

&nbsp;

## Dependencies

Install all node dependencies:

```bash
npm install
```

&nbsp;

## Enviroment Setup

Create the necessary environments based on `.env.example`: `.env.development` and `.env.test`, setting up the variables.

```bash
cp .env.example .env.development
```

### Expected variables

| Variable | Description | Type |
|----------|------------|------|
| `NODE_ENV` | Specifies the runtime environment of the application. | `"development"` \| `"test"` \| `"production"` |
| `POSTGRES_USER` | Username for the PostgreSQL container. *(e.g., `root`)* | `string` |
| `POSTGRES_PASSWORD` | Password for the PostgreSQL container. *(e.g., `root`)* | `string` |
| `POSTGRES_DB` | Name of the PostgreSQL database on container. *(e.g., `fluxogramas`)* | `string` |
| `PRISMA_DATABASE_URL` | Connection URL for the PostgreSQL database. Should be formatted as `postgres://<user>:<password>@<host>/<database>`. *(e.g., `postgres://root:root@db/fluxogramas`)* | `string` |
| `SERVER_PORT` | Port number the server should listen on. *(e.g., `3000`)* | `number` |
| `SERVER_LOCAL_PORT` | Port number the server should run on local. Used in tests. *(e.g., `3001`)* | `string` |
| `SERVER_LOG_LEVEL` | Defines the logging level for the server. | `"DBG"` \| `"INF"` \| `"WRN"` \| `"ERR"` \| `"DISABLED"` |
| `ACCESS_TOKEN_SECRET` | Secret key for signing and verifying Access JWT tokens. **Recommended: 32-character hash**. | `string` |
| `REFRESH_TOKEN_SECRET` | Secret key for signing and verifying Refresh JWT tokens. **Recommended: 32-character hash**. | `string` |
| `ACCESS_TOKEN_EXPIRATION` | Expiration time for Access JWT tokens. *(e.g., `15m`)*. | `string` |
| `REFRESH_TOKEN_EXPIRATION` | Expiration time for Access JWT tokens. *(e.g., `7d`)*. | `string` |

&nbsp;

## Run locally

Start the containers:

```bash
npm run dev:start
```

> The server is restarted on every source code change.

### Stop and Remove containers

Remove containers when necessary:

```bash
npm run dev:finish
```

&nbsp;

## Run automated tests

Create a temporary environment and run test suites:

```bash
npm run test:auto
```

> All tests are inside `__tests__` folder, ending with `.test.ts`
