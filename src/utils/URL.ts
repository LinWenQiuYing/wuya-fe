/**
 * URL中的查询字符串
 */
export class Search {
  readonly #value: Record<string, string>;
  constructor(s: string) {
    this.#value = Search.parse(s);
  }
  static parse(s: string): Record<string, string> {
    return String(s)
      .replace(/^\?/, "")
      .split("&")
      .reduce((pub: Record<string, string>, it) => {
        const [key = "", value = ""] = it.split("=");
        if (key.length) {
          pub[key] = value;
        }
        return pub;
      }, {});
  }
  static stringify(data: Record<string, string>): string {
    const str = Object.entries(data)
      .map(([key, value = ""]) => `${key}=${value}`)
      .join("&");
    return str.length > 0 ? "?" + str : "";
  }

  toString(this: Search) {
    return Search.stringify(this.#value);
  }
  valueOf(this: Search) {
    return this.#value;
  }
  has(this: Search, key: string): boolean {
    return key in this.#value;
  }
  get(this: Search, key: string): string | undefined {
    return this.#value[key];
  }
  set(this: Search, key: string, value: string) {
    this.#value[key] = value || "";
  }
  del(this: Search, key: string) {
    delete this.#value[key];
  }
}

/**
 * 一个URL链接(可是相对URL, 即仅包含路径部分, 仅包含查询字符串部分等)
 *
 * 将一个链接地址反串行化为对象, 然后可以方便地修改其中的某部分
 *
 * 需要注意的是，浏览器环境全局作用域有个URL类
 *
 * [rfc of Uniform Resource Locators (URL)](https://datatracker.ietf.org/doc/html/rfc1738)
 *
 */
export default class URL {
  static readonly reg =
    /^(?:(?:(?:([A-Za-z]+):)?(\/{2,3}))?([0-9.\-A-Za-z]+)(?::(\d+))?)?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;
  public protocol: string;
  private readonly slash: string;
  public hostname: string;
  public port: string;
  public pathname: string;
  public search: Search;
  public hash: string;

  constructor(href: string) {
    const arr: string[] | null = URL.reg.exec(href);
    if (!arr) {
      throw new Error(`invalid url: "${href}"`);
    }
    const [, protocol, slash, hostname, port, pathname, search, hash] = arr;
    this.protocol = protocol || "";
    this.slash = slash || "";
    this.hostname = hostname || "";
    this.port = port || "";
    this.pathname = pathname || "";
    this.search = new Search(search || "");
    this.hash = hash || "";
  }

  get host(): string {
    return this.port.length ? `${this.hostname}:${this.port}` : this.hostname;
  }

  set host(value: string) {
    const [hostname, port] = value.split(":");
    this.hostname = hostname;
    if (port) {
      this.port = port;
    }
  }

  get origin(): string {
    return `${URL.withProtocolSuffix(this.protocol)}${this.slash}${this.host}`;
  }

  private static withHashtag(hash: string) {
    if (!hash.length || hash.startsWith("#")) return hash;
    return `#${hash}`;
  }

  private static withProtocolSuffix(protocol: string): string {
    return protocol.length ? `${protocol}:` : protocol;
  }

  toString() {
    return [this.origin, this.pathname, this.search.toString(), URL.withHashtag(this.hash)].join("");
  }

  /**
   * 判断一个链接(字符串)是否是一个合法的链接
   * @param value 被测试的链接
   * @returns 被测试的链接是否是一个合法的URL
   */
  static isURL(value: string) {
    return URL.reg.test(value);
  }
}

export const isURL = URL.isURL;
