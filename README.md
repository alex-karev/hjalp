# Hjalp - a CLI tool for quickly asking LLM a question

## Feauters

- No external dependencies.
- Supports any LLM provider with OpenAI API support.
- Supports any LLM and custom system prompts.
- Outputs generated text only (KISS).
- Custom config file in `~/.config/`.
- (Optionally) can output token usage.

## Usage 

```plain
> hjalp "how do i generate a random string using Linux cli tools?"
> You can use `openssl`:

`openssl rand -base64 32`
> hjalp tell me a joke about penguins -u
> Why did the penguin take his credit card to the Antarctic? 

Because he wanted to freeze his assets.

Input tokens: 58
Output tokens: 22
> hjalp -h
> [HELP_MESSAGE]
```

## Installation

1. Make sure that you have node.js installed.
2. Clone this repo.
3. Install using npm install.

```bash
git clone https://github.com/alex-karev/hjalp.git
cd hjalp
sudo npm install -g
```

## Troubleshooting

- To use proxy set socks5 proxy url in config file.
- If you see messages about node module deprecation, set `NODE_OPTIONS` parameter to `--no-deprecation` in your environment (e.g. in `.bashrc`)

```bash
export NODE_OPTIONS="--no-deprecation"
```

## Contribution

Feel free to fork this repo and make pull requests.

If you like my work, please, support me:

BTC: 32F3zAnQQGwZzsG7R35rPUS269Xz11cZ8B

## Lisense

Free to use under GNU GPL 3.0. See LICENSE for more information.
