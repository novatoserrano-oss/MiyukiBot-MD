import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath, pathToFileURL } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import { dirname } from 'path'

global.__dirname = (url) => dirname(fileURLToPath(url))

global.owner = [
   ['51908027316', '۪👑 OmarGranda', true],
   ['51908027316', 'Omar', true],
   ['51919199620', 'Shadowxyz', true]
];

global.mods = ['5127303598', '51908027316', '51919199620']
global.suittag = ['51927303598', '51908027316', '51919199620']
global.prems = ['51927303598', '51908027316', '51919199620']

global.libreria = 'Baileys'
global.baileys = 'V 6.7.9'
global.languaje = 'Español'
global.vs = '4.3.1'
global.vsJB = '5.0'
global.nameqr = 'Shirayukiqr'
global.namebot = 'Shirayuki-IA'
global.sessions = 'Shirayuki-sessions'
global.jadi = 'jadibts'
global.ItsukiJadibts = true
global.Choso = true

global.defaultPrefix = ['.', '!', '/', '#']
global.prefix = global.defaultPrefix
try {
  if (global.db?.data?.settings) {
    const jid = Object.keys(global.db.data.settings)[0]
    const savedPrefix = global.db.data.settings[jid]?.prefix
    if (savedPrefix && Array.isArray(savedPrefix) && savedPrefix.length > 0) {
      global.prefix = savedPrefix
      console.log(chalk.green(`✅ Prefijo dinámico detectado: ${savedPrefix}`))
    }
  }
} catch (e) {
  console.log(chalk.yellow('⚠️ No se pudo leer el prefijo dinámico aún. Se usa el prefijo por defecto.'))
}

global.apikey = 'ShirayukiBot-MD'
global.botname = 'ShirayukiBot-MD 👑✨'
global.wm = '© Omar Granda'
global.wm3 = '⫹⫺  multi-device'
global.author = 'made by @Omar Granda'
global.dev = '© powered by Omar Granda'
global.textbot = 'Shirayuki|IA - Omar Granda'
global.etiqueta = '@Omar Granda'
global.gt = '© creado Por Omar Granda'
global.me = 'Shirayuki-𝐖𝐀𝐁𝐎𝐓'
global.listo = '*Aqui tiene*'
global.moneda = 'Yenes'
global.multiplier = 69
global.maxwarn = 3
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

global.gp1 = 'https://chat.whatsapp.com/EteP5pnrAZC14y9wReGF1V'
global.comunidad1 = 'https://chat.whatsapp.com/DeJvBuS7QgB3Ybp1BZulWL'
global.channel = 'https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M'
global.channel2 = 'https://whatsapp.com/channel/0029ValMlRS6buMFL9d0iQ0S'
global.md = 'https://github.com/xzzys26/Itsuki-Nakano'
global.correo = 'xzzysultra@gmail.com'

global.APIs = {
  ryzen: 'https://api.ryzendesu.vip',
  xteam: 'https://api.xteam.xyz',
  lol: 'https://api.lolhuman.xyz',
  delirius: 'https://delirius-apiofc.vercel.app',
  siputzx: 'https://api.siputzx.my.id',
  mayapi: 'https://mayapi.ooguy.com'
}

global.APIKeys = {
  'https://api.xteam.xyz': 'YOUR_XTEAM_KEY',
  'https://api.lolhuman.xyz': 'API_KEY',
  'https://api.betabotz.eu.org': 'API_KEY',
  'https://mayapi.ooguy.com': 'may-f53d1d49'
}

global.SIPUTZX_AI = {
  base: global.APIs?.siputzx || 'https://api.siputzx.my.id',
  bardPath: '/api/ai/bard',
  queryParam: 'query',
  headers: { accept: '*/*' }
}

global.chatDefaults = {
  isBanned: false,
  sAutoresponder: '',
  welcome: true,
  autolevelup: false,
  autoAceptar: false,
  autosticker: false,
  autoRechazar: false,
  autoresponder: false,
  detect: true,
  antiBot: false,
  antiBot2: false,
  modoadmin: false,
  antiLink: true,
  antiImg: false,
  reaction: false,
  nsfw: false,
  antifake: false,
  delete: false,
  expired: 0,
  antiLag: false,
  per: [],
  antitoxic: false
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(pathToFileURL(file).href + `?update=${Date.now()}`)
})

export default {
  prefix: global.prefix,
  owner: global.owner,
  sessionDirName: global.sessions,
  sessionName: global.sessions,
  botNumber: global.botNumber,
  chatDefaults: global.chatDefaults
}