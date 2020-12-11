import * as sensors from "./modules/sensors";
import * as config from "./modules/config";

class Main
{
  private readonly socket: SocketIOClient.Socket;

  constructor()
  {
    this.socket = require("socket.io-client").connect(config.socket_url());

    // Send this sensor's UUID to the server.

    let timeout: NodeJS.Timeout;

    this.socket.on("connect", () => {

      // Connected to the server. Post the UUID of this sensor.

      this.socket.emit("sensor_uuid", config.uuid(), (result: boolean) => {
        if (result) {
          this.do_task();
          timeout = setInterval(() => this.do_task(), config.interval());
          console.log("Connected and UUID accepted. Started monitoring.")
        }
        else {
          console.error("UUID rejected. Exiting...");
          process.exit(1);
        }
      });
    });

    this.socket.on("disconnect", () => {
      clearInterval(timeout);
      console.log("Disconnected. Stopped monitoring.")
    });
  }

  private readonly do_task = (): void =>
  {
    this.post(sensors.get_all(config.sensor_ids()));
  };

  private readonly post = (data: (number | null)[]): void =>
  {
    try {
      // Post the latest measurements to the server.

      this.socket.emit("sensor_values", data, (result: boolean) => {
        if (result) {
          console.error(`Sent ${JSON.stringify(data)}`);
        }
      });
   }
    catch (e) {
      console.error("Failed to send: ", e);
    }
  };
}
const main: Main = new Main();
