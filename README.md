[![CI](https://img.shields.io/github/actions/workflow/status/Tox1469/tcp-echo-server/ci.yml?style=flat-square&label=ci)](https://github.com/Tox1469/tcp-echo-server/actions)
[![License](https://img.shields.io/github/license/Tox1469/tcp-echo-server?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/Tox1469/tcp-echo-server?style=flat-square)](https://github.com/Tox1469/tcp-echo-server/releases)
[![Stars](https://img.shields.io/github/stars/Tox1469/tcp-echo-server?style=flat-square)](https://github.com/Tox1469/tcp-echo-server/stargazers)

---

# tcp-echo-server

Servidor TCP echo mínimo, útil para testes, debugging de rede e exemplos de cliente.

## Instalação

```bash
npm install tcp-echo-server
```

## Uso

```ts
import { TcpEchoServer } from "tcp-echo-server";

const server = new TcpEchoServer({ port: 9000, prefix: "echo: " });
await server.start();
server.on("data", (_sock, data) => console.log("recv", data.toString()));
// ...
await server.stop();
```

## API

- `new TcpEchoServer({ host?, port?, prefix?, logger? })`
- `start()` — retorna `{ host, port }`
- `stop()` — fecha conexões e servidor
- `clientCount` — conexões ativas
- Eventos: `connection`, `data`, `disconnect`, `error`

## Licença

MIT