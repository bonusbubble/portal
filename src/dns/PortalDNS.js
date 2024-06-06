const dns2 = require("dns2");
const Hyperbee = require('hyperbee');
const Hypercore = require('hypercore');
const RAM = require('random-access-memory');

const { Packet } = dns2;

const DOT_PORTAL = ".portal";

class PortalDNS {
  #db
  #dns
  #hypercore
  #server

  constructor(
    options = {}
  ) {
    options ??= {};

    this.#dns = new dns2(options);

    this.#hypercore = new Hypercore(RAM);

    this.#db = new Hyperbee(
      this.#hypercore,
      {
        keyEncoding: "utf-8",
        valueEncoding: "utf-8"
      }
    );

    this.#createServer();
  }

  async add(domain, address) {
    await this.#db.put(domain, address);
  }

  close() {
    this.#server.close();
  }

  async remove(domain) {
    await this.#db.del(domain);
  }

  async resolve(domain) {
    if (!domain) domain = "127.0.0.1";

    if (typeof domain !== "string") domain = "127.0.0.1";

    if (domain.endsWith(DOT_PORTAL)) return await this.#resolvePortalDNS(domain);

    return (await this.#dns.resolveA(domain)).answers[0].address;
  }

  startServer() {
    this.#server.listen(
      {
        udp: {
          port: 5333,
          address: "127.0.0.1",
          type: "udp4"
        },
        tcp: {
          port: 5333,
          address: "127.0.0.1"
        }
      }
    );
  }

  #createServer() {
    this.#server = dns2.createServer(
      {
        udp: true,
        handle: (request, send, rinfo) => {
          // Get the response.
          const response = Packet.createResponseFromRequest(request);

          // Get the request.
          const [ question ] = request.questions;

          // Get the requested name.
          const { name } = question;

          // Add the answer to the request.
          response.answers.push(
            {
              name,
              type: Packet.TYPE.A,
              class: Packet.CLASS.IN,
              ttl: 300,
              address: "1.1.1.1"
            }
          );

          // Send the response.
          send(response);
        }
      }
    );

    this.#defineServerEventHandlers();
  }

  #defineServerEventHandlers() {
    this.#server.on(
      "request",
      (request, response, rinfo) => {
        console.log(request.header.id, request.questions[0]);
      }
    );

    this.#server.on(
      "requestError",
      error => {
        console.log('Client sent an invalid request', error);
      }
    );

    this.#server.on(
      "listening",
      () => {
        console.log(this.#server.addresses());
      }
    );

    this.#server.on(
      "close",
      () => {
        console.log('server closed.');
      }
    );
  }

  async #resolvePortalDNS(domain) {
    const ip = (await this.#db.get(domain)).value;

    if (!ip) throw new Error(`Domain "${domain}" could not be resolved.`);

    return ip;
  }
}

module.exports = PortalDNS;
