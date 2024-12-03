#!/usr/bin/env node

import { Command } from 'commander';
import config from "./config.js";
import fs from "fs";
import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Define command
const program = new Command();
program
  .version('1.0.0', '-v, --version')
  .description('Quickly ask LLM anything directly in CLI')
  .addHelpText("after", `\nConfig file is stored in ${config.path}`)
  .argument("<string>", "question to ask")
  .option("-c, --config <string>", "load specific config file")
  .option("-m, --model <string>", "specify model")
  .option("-a, --api <string>", "specify api base url")
  .option("-k, --key <string>", "specify api key")
  .option("-s, --system <string>", "use custom system prompt")
  .option("-u, --usage", "output number of used tokens")
  .option("-t, --temperature <number>", "specify temperature used for generation", parseFloat)
  .option("-p, --proxy <string>", "specify socks5 proxy to use")
  .option("-n, --max <number>", "specify maximum number of tokens", parseInt)
  .usage('[OPTIONS] [QUESTION]');

// Parse arguments
program.parse();
const opts = program.opts();

// Load custom config
if (opts.config) {
  if (!fs.existsSync(opts.config)) {
    throw `Error! Config file at location '${opts.config}' does not exist!`
  }
  config = JSON.parse(fs.readFileSync(opts.config));
}

// Re-assign config values
if (opts.api) config.apiUrl = opts.api;
if (opts.model) config.model = opts.model;
if (opts.key) config.token = opts.key;
if (opts.system) config.systemPrompt = opts.system;
if (opts.proxy) config.proxy = opts.proxy;
if (opts.max) config.maxTokens = opts.max;
if (opts.temperature) config.temperature = opts.temperature;

// Create API configuration and start session
const apiConfig = {
  apiKey: config.token,
  baseURL: config.apiUrl
}
if (config.proxy) {
  const proxyAgent = new HttpsProxyAgent(config.proxy);
  apiConfig.httpsApent = proxyAgent
  apiConfig.httpApent = proxyAgent
}
const client = new OpenAI(apiConfig);

// Prepare paylaod
const prompt = program.args.join(" ");
const messages = [
  { role: "system", content: config.systemPrompt },
  { role: "user", content: prompt },
]

// Generate completion
const run = async () => {
  const stream = await client.chat.completions.create({
    model: config.model,
    messages: messages,
    stream: true,
    max_completion_tokens: config.maxTokens,
    temperature: config.temperature
  });
  for await (const part of stream) {
    const token = part.choices[0]?.delta?.content || '';
    process.stdout.write(token);
    if (part.usage && opts.usage) {
        console.log(`\n\nInput tokens: ${part.usage.prompt_tokens}\nOutput tokens: ${part.usage.completion_tokens}`);
    }
  }
  console.log("")
};

run()

