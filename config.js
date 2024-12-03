import os from "os";
import path from "path";
import fs from "fs";
import * as defaultConfig from "./defaultConfig.js";

// Define config path
const homedir = os.homedir();
const filename = "hjalp.json";
const configPath = (() => {
  switch (os.platform()) {
    case 'darwin':
      return path.join(homedir, 'Library', 'Application Support', filename);
    case 'win32':
      return path.join(homedir, 'AppData', 'Roaming', filename);
    case 'linux':
      return path.join(homedir, '.config', filename);
    default:
      throw new Error('Unsupported platform');
  }
})();

// Create new config
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2))
}

// Load config
const config = JSON.parse(fs.readFileSync(configPath));
config.path = configPath;

export default config;
