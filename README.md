# Talon Deck

[Stream deck](https://www.elgato.com/en/stream-deck) inspired interactive dashboard for [Talon Voice](https://talonvoice.com)

Exposes a responsive webpage where the user can monitor and control Talon. The perfect use case for a spare phone or tablet!

> **Note**
> If you find this repository helpful, [consider sponsoring](https://github.com/sponsors/AndreasArvidsson)!

<kbd><img src="./docs/example1.png" alt="Talon deck example 1" style="height:5rem; border:1px solid black;" /></kbd>

<kbd><img src="./docs/example2.jpg" alt="Talon deck example 2" style="height:11rem" /></kbd>

<img src="./docs/example_phone.jpg" alt="Talon deck phone" style="height:15rem" />

## Demo

[YouTube - Talon deck demo](https://youtu.be/7kcd4frRnUs)

## Installation and running

1. Install [`talon_deck_integration.py`](https://github.com/AndreasArvidsson/andreas-talon/blob/master/plugins/talon_deck/talon_deck_integration.py) in the Talon user directory.
1. Add implementation of Talon action `user.talon_deck_get_buttons()`
    - My implementation is available at [`talon_deck_buttons.py`](https://github.com/AndreasArvidsson/andreas-talon/blob/master/plugins/talon_deck/talon_deck_buttons.py)  
      _Note that some of the `user.` actions may be lacking from your system_
1. Install dependencies for node server  
   `npm install`
1. Build node server  
   `npm run build`
1. Start node server  
   `npm start`
1. Open Talon deck at [http://localhost:3000](http://localhost:3000)

## Settings

Before building the node server settings can be set in `settings.ts`

## Network access

By default the node server is bound to `localhost`. To enable network access change the `host` field in the settings file. Either to the computers specific IP address, eg `192.168.1.100`, or allow any address by `0.0.0.0`. It's highly recommended to enable `basicAuth` for anything other than localhost.

## Authentication / Login

`Basic auth` can be enabled in the settings file by setting a username and password.

## Implementation details

1. `talon_deck_integration.py` in the Talon user directory keeps track of changing states in Talon and updates a JSON file in the systems temp directory.
1. The node server watches for changes in the JSON file and via web sockets updates the webpage.
1. On every update the Talon actions gets converted into a UUID called `actionId` that are sent to the webpage. The Talon actions never leave the server and the `actionId` becomes invalid after each update.
1. When the user presses the icon the `actionId` is sent to the server, converted back to the Talon action and piped into the Talon repl.

## Disclaimer

This software allows you to execute actions in Talon over the network. That means that if you change the host setting from `localhost` any one with access to your local network can use it. There is support for `Basic auth` which is recommended to use for network access, but even that isn't particularly secure by today's standard. I strongly recommend not to put any "destructive actions" on your deck. Especially if you enable network access.
