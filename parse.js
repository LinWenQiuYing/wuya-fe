#!/bin/node

import fs from "fs";
import * as process from "node:process";

const cwd = process.cwd();

const parse = (locales) => {
  const tree = locales.split("\n").reduce(
    (pub, it) => {
      if (it && it.startsWith("//")) {
        const id = it.replace(/^\/\//, `${cwd}\\`).replace(/\r$/, "");
        pub.current = id;
        pub.map[id] = [];
      } else if (pub.current) {
        pub.map[pub.current].push(it);
      }
      return pub;
    },
    { map: {}, current: undefined },
  );
  return tree.map;
};

const write = ([filename, list]) => {
  fs.writeFileSync(filename, "{" + list.join("\n") + "}", "utf-8");
};

const filenames = ["./locales/en.json", "./locales/zh.json"];
filenames.forEach((filename) => {
  const stat = fs.statSync(filename);
  if (!stat.isFile()) throw Error("json file not exist");
  const raw = fs.readFileSync(filename, { encoding: "utf-8" }).trim();
  const map = parse(raw.substring(1, raw.length - 1));
  Object.entries(map).forEach(write);
});
