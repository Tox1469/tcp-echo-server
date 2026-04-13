// tcp-echo-server: tiny TCP echo server
import { createServer, Server, Socket } from "node:net";
import { EventEmitter } from "node:events";

export interface EchoServerOptions {
  host?: string;
  port?: number;
  prefix?: string;
  logger?: (msg: string) => void;
}

export class TcpEchoServer extends EventEmitter {
  private server: Server | null = null;
  private clients = new Set<Socket>();
  private host: string;
  private port: number;
  private prefix: string;
  private logger: (msg: string) => void;

  constructor(opts: EchoServerOptions = {}) {
    super();
    this.host = opts.host ?? "0.0.0.0";
    this.port = opts.port ?? 9000;
    this.prefix = opts.prefix ?? "";
    this.logger = opts.logger ?? (() => {});
  }

  start(): Promise<{ host: string; port: number }> {
    return new Promise((resolve, reject) => {
      this.server = createServer((socket) => {
        this.clients.add(socket);
        this.emit("connection", socket);
        this.logger(`connect ${socket.remoteAddress}:${socket.remotePort}`);
        socket.on("data", (data) => {
          this.emit("data", socket, data);
          socket.write(Buffer.concat([Buffer.from(this.prefix), data]));
        });
        socket.on("close", () => {
          this.clients.delete(socket);
          this.emit("disconnect", socket);
        });
        socket.on("error", (e) => this.emit("error", e));
      });
      this.server.once("error", reject);
      this.server.listen(this.port, this.host, () => {
        const addr = this.server!.address();
        if (addr && typeof addr === "object") {
          this.host = addr.address;
          this.port = addr.port;
        }
        this.logger(`listening on ${this.host}:${this.port}`);
        resolve({ host: this.host, port: this.port });
      });
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      for (const c of this.clients) c.destroy();
      this.clients.clear();
      if (!this.server) return resolve();
      this.server.close(() => resolve());
    });
  }

  get clientCount(): number {
    return this.clients.size;
  }
}
