# How to run

Client just need a basic setup to run.

&nbsp;

## Requirements

- Node 20 (NVM is strongly recommended to manage version)

&nbsp;

## Dependencies

Install all node dependencies:

```bash
npm install
```

&nbsp;

## Enviroment Setup

Create environment file

```bash
cp .example.env .env
```

### Expected variables

| Variable | Description | Type |
|----------|------------|------|
| `VITE_PORT` | Port number the client should listen on. | `number` |
| `VITE_API_URL` | Server URL to requests. (e.g., `http://localhost:3001`) | `string` |
