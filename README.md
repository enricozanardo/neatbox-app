# Neatbox Application

## Installation

```sh
cd ~
git clone https://github.com/enricozanardo/neatbox-app
cd neatbox-app
npm i
```

## Configure

```sh
cd ~/neatbox-app
cp .env.example .env
nano .env
```

## Start

```sh
cd ~/neatbox-app
npm start
```

## Build / Serve

```sh
cd ~/neatbox-app
npm run build

## In terminal
npm run serve

## As pm2 process
pm2 start npm --name "neatbox-app" -- run serve
```

## License

MIT
