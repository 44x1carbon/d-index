#!/usr/bin/env node
const fs = require("fs");
const http = require("http");

const PACKAGE_JSON_PATH = process.cwd() + "/package.json";
const NODE_MODULES_PATH = process.cwd() + "/node_modules";

if (!fs.existsSync(PACKAGE_JSON_PATH)) {
  console.log(`${PACKAGE_JSON_PATH} not found`);
  process.exit();
}

const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));

const getModuleInfo = (LIBLARY_PATH) => {
  const LIBLARY_PACKAGE_JSON_PATH = `${NODE_MODULES_PATH}/${LIBLARY_PATH}/package.json`;
  if (fs.existsSync(LIBLARY_PACKAGE_JSON_PATH)) {
    const p = JSON.parse(fs.readFileSync(LIBLARY_PACKAGE_JSON_PATH, "utf8"));
    return {
      name: LIBLARY_PATH,
      homepage: p.homepage,
    };
  } else {
    return {
      name: LIBLARY_PATH,
      homepage: null,
    };
  }
};

const dependencies = Object.keys(packageJson.dependencies).map(getModuleInfo);
const devDependencies = Object.keys(packageJson.devDependencies).map(
  getModuleInfo
);

const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req, res) =>
  res.render("index", { dependencies, devDependencies })
);

app.listen(3000, () => console.log("d-index : http://localhost:3000"));
