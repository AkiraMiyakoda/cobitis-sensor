import * as fs from "fs";
import * as json5 from "json5";
import * as path from "path";

class Internal
{
  public readonly is_devel = (process.env.NODE_ENV !== "production");
  private readonly dir = "/etc/cobitis-sensor/";
  private readonly file = this.is_devel ? "config_devel.json5" : "config.json5";

  public readonly raw_data: {
    sensor_ids: string[],
    socket_url: string,
    uuid:       string,
    interval:   number,
  };

  constructor() {
    this.raw_data = json5.parse(fs.readFileSync(path.join(this.dir, this.file)).toString());
    Object.freeze(this.raw_data);
  }
}
const internal = new Internal();

export function is_devel(): boolean {
  return internal.is_devel;
}

export function sensor_ids(): string[] {
  return internal.raw_data.sensor_ids;
}

export function socket_url(): string {
  return internal.raw_data.socket_url;
}

export function uuid(): string {
  return internal.raw_data.uuid;
}

export function interval(): number {
  return internal.raw_data.interval;
}
