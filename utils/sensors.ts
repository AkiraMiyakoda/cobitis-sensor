import * as fs from "fs";
import * as math from "mathjs";

const get_temp = (sensor_id: string): (number | null) =>
{
  const PATH = "/sys/bus/w1/devices/28-";

  try {
    // Find the string like " t=21562".
    // The number represents the temperature in 1/1000 degrees celsius.

    const text = fs.readFileSync(`${PATH}${sensor_id}/w1_slave`).toString();
    const match = /t=([0-9]+)/.exec(text);
    if (!match) {
      console.error("Failed to fetch temperature value.");
      return null;
    }

    return math.round(parseFloat(match[1]) / 1000, 1);
  }
  catch (e) {
    console.error("Failed to fetch temperature value.", e);
    return null;
  }
}

const get_tds = (analog_no: string): (number | null) =>
{
  const PATH = "/sys/bus/iio/devices/iio:device0/";

  try {
    // raw * scale = mV
    // 0mV ~ 2300mV represent 0 ~ 1000ppm

    const raw   = fs.readFileSync(`${PATH}in_voltage${analog_no}_raw`).toString();
    const scale = fs.readFileSync(`${PATH}in_voltage${analog_no}_scale`).toString();
    return math.round(parseFloat(raw) * parseFloat(scale) / 2.3, 1);
  }
  catch (e) {
    console.error("Failed to fetch TDS value.", e);
    return null;
  }
}

export function get_all(sensor_ids: string[]): (number | null)[]
{
  return [
    Date.now(),
    get_temp(sensor_ids[0]),
    get_temp(sensor_ids[1]),
    get_tds(sensor_ids[2])
  ];
}
