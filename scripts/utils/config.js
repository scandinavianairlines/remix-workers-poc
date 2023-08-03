"use strict";
const {
  readConfig: _readConfig,
  findConfig,
} = require("@remix-run/dev/dist/config");
const path = require("path");

const EXTENSIONS = [".js", ".mjs", ".cjs"];

/**
 * @typedef {import('@remix-run/dev').AppConfig & { worker: string, workerMinify: boolean, workerBuildDirectory: string }} WorkerConfig
 */
/**
 * @typedef {import('@remix-run/dev').ResolvedRemixConfig & { worker?: string, workerMinify?: boolean, workerBuildDirectory?: string }} ResolvedWorkerConfig
 */

/**
 * Reads the remix.config.js file and returns the config object.
 * @param {string} remixRoot The path to the remix.config.js file.
 * @param {import('@remix-run/dev/dist/config/serverModes').ServerMode} mode The server mode.
 * @returns {Promise<ResolvedWorkerConfig>}
 */
async function readConfig(remixRoot, mode) {
  const remixConfig = await _readConfig(remixRoot, mode);
  /** @type {WorkerConfig} */
  const workerConfig = require(findConfig(
    remixRoot,
    "remix.config",
    EXTENSIONS
  ));

  return {
    ...remixConfig,
    worker:
      workerConfig.worker ?? `${remixConfig.appDirectory}/entry.worker.js`,
    workerMinify: workerConfig.workerMinify ?? false,
    workerBuildDirectory:
      workerConfig.workerBuildDirectory ?? path.resolve("./public"),
  };
}

module.exports = { readConfig };
