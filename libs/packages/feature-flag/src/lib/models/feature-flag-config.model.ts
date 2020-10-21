export class FFConfig {
  url: string;
  interval?: number;

  constructor(
    url: string,
    interval: number
  ) {
    this.url = url;
    this.interval = interval;
  }
}
