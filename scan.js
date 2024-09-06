#!/bin/node
import fs from "fs";
import path from "path";
import * as process from "node:process";

const cwd = process.cwd();
const getLocale = (filename, matchingFile) => {
  const locale = [];
  const stat = fs.statSync(filename);

  if (stat.isDirectory()) {
    const arr = fs.readdirSync(filename);
    const list = arr.map((it) => getLocale(path.join(filename, it), matchingFile));
    return locale.concat(...list);
  }
  if (stat.isFile() && path.basename(filename) === matchingFile) {
    const file = fs.readFileSync(filename, { encoding: "utf-8" }).trim();
    const componentPath = `${filename}`.replace(path.join(cwd, "src"), "").replace(/\//, "");
    locale.push("//" + componentPath + file.substring(1, file.length - 1));
  }
  return locale;
};
const matchingFiles = ["en.json", "zh.json"];
//创建文件夹路径
const folderPath = "./locales";
if (!fs.existsSync(folderPath)) {
  // 如果文件夹不存在，则创建文件夹
  fs.mkdirSync(folderPath, { recursive: true });
}
matchingFiles.forEach((matchingFile) => {
  const locale = getLocale("./src", matchingFile);
  fs.writeFileSync(`${folderPath}/${matchingFile}`, "{" + "\n" + locale.join("\n") + "\n" + "}", "utf-8");
});
