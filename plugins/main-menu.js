// 🌸 MiyukiBot MD - Menú Mejorado v1.8.2
// 💫 Diseñado por: Omar Granda
// 🪷 Modificado por: Shadow-xyz

import os from 'os'
import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix }) => {
  try {
    await m.react('🌸')

    const user = global.db?.data?.users?.[m.sender] || {}
    const name = await conn.getName(m.sender)
    const totalUsers = Object.keys(global.db?.data?.users || {}).length
    const chats = Object.values(conn.chats || {})
    const groups = chats.filter(c => c.id.endsWith('@g.us')).length
    const uptime = clockString(process.uptime() * 1000)
    const date = moment.tz('America/Lima').format('hh:mm A')
    const day = moment.tz('America/Lima').format('dddd')
    const fullDate = moment.tz('America/Lima').format('DD MMMM YYYY')
    const isPremium = user.premium ? '✨ Premium' : '🪶 Gratis'
    const limit = user.limit ?? 0
    const country = '🇵🇪 Perú'

    const menu = `
╭━━━〔 🌸 𝑴𝑰𝒀𝑼𝑲𝑰ʙᴏᴛ • ᴹᴰ 💫 〕━━⬣
│👤  Usuario: ${name}
│💎  Estado: ${isPremium}
│🌍  País: ${country}
│⚙️  Límite: ${limit}
│👥  Usuarios: ${totalUsers}
│💬  Grupos: ${groups}
│⏱️  Uptime: ${uptime}
│🪷  Versión: v1.8.2 | Latest
│📚  Librería: Baileys Multi Device
│📆  Fecha: ${date} • ${day}, ${fullDate}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌙  Desarrollador: *Omar Granda*
───────────────────────────────
💫 *Menú Principal Disponible ↓*

╭───〔 🌸 𝙄𝙉𝙁𝙊 〕───⬣
│💬 ${usedPrefix}creador
│⚡ ${usedPrefix}ping / ${usedPrefix}p / ${usedPrefix}estado
│🧠 ${usedPrefix}newcommand
╰────────────────⬣

╭───〔 🌿 𝙐𝙏𝙄𝙇𝙄𝘿𝘼𝘿𝙀𝙎 〕───⬣
│🪞 ${usedPrefix}inspect / ${usedPrefix}ss / ${usedPrefix}translate  
│🧮 ${usedPrefix}cal / ${usedPrefix}tamaño <número>  
│🎨 ${usedPrefix}dalle / ${usedPrefix}flux / ${usedPrefix}ia / ${usedPrefix}chatgpt / ${usedPrefix}bard  
│🎵 ${usedPrefix}whatmusic <audio> / ${usedPrefix}lyrics  
│🔍 ${usedPrefix}wikipedia / ${usedPrefix}tourl / ${usedPrefix}ssweb
╰────────────────⬣

╭───〔 🎮 𝙅𝙐𝙀𝙂𝙊𝙎 〕───⬣
│🎲 ${usedPrefix}slot / ${usedPrefix}slut / ${usedPrefix}rob  
│⚔️ ${usedPrefix}adventure / ${usedPrefix}cazar / ${usedPrefix}dungeon  
│💰 ${usedPrefix}bal / ${usedPrefix}baltop / ${usedPrefix}daily / ${usedPrefix}weekly  
│🪙 ${usedPrefix}depositar / ${usedPrefix}retirar / ${usedPrefix}pay  
│🏆 ${usedPrefix}lboard / ${usedPrefix}levelup / ${usedPrefix}lvl @user  
│🎵 ${usedPrefix}pokedex / ${usedPrefix}letra / ${usedPrefix}letra2  
╰────────────────⬣

╭───〔 🌸 𝘼𝙉𝙄𝙈𝙀 𝙒𝙊𝙍𝙇𝘿 〕───⬣
│💞 ${usedPrefix}hug / ${usedPrefix}kiss / ${usedPrefix}pat / ${usedPrefix}poke / ${usedPrefix}love  
│😂 ${usedPrefix}laugh / ${usedPrefix}smile / ${usedPrefix}cringe / ${usedPrefix}drama  
│🥺 ${usedPrefix}cry / ${usedPrefix}sad / ${usedPrefix}shy / ${usedPrefix}enamorado  
│🍵 ${usedPrefix}coffee / ${usedPrefix}eat / ${usedPrefix}dance / ${usedPrefix}sleep  
│🫶 ${usedPrefix}waifu / ${usedPrefix}loli / ${usedPrefix}harem / ${usedPrefix}infoanime  
╰────────────────⬣

╭───〔 🎧 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎 〕───⬣
│🎵 ${usedPrefix}play / ${usedPrefix}play2 / ${usedPrefix}spotify  
│🎬 ${usedPrefix}mp3 / ${usedPrefix}mp4 / ${usedPrefix}twitter  
│📌 ${usedPrefix}pinterest / ${usedPrefix}catbox  
╰────────────────⬣

╭───〔 🩷 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙕𝙊𝙉𝙀 〕───⬣
│🎠 ${usedPrefix}sticker / ${usedPrefix}stickerly / ${usedPrefix}emojimix  
│💖 ${usedPrefix}take / ${usedPrefix}robar / ${usedPrefix}wm / ${usedPrefix}qc  
│🖼️ ${usedPrefix}pfp / ${usedPrefix}brat / ${usedPrefix}bratv  
╰────────────────⬣

╭───〔 🏮 𝙂𝙍𝙐𝙋𝙊𝙎 & 𝘼𝘿𝙈𝙄𝙉𝙎 〕───⬣
│📢 ${usedPrefix}invite / ${usedPrefix}todos / ${usedPrefix}listonline  
│🛡️ ${usedPrefix}autoadmin / ${usedPrefix}restrict / ${usedPrefix}restringir  
│🧾 ${usedPrefix}backup / ${usedPrefix}resetuser / ${usedPrefix}broadcastgroup  
╰────────────────⬣

╭───〔 💠 𝙊𝙒𝙉𝙀𝙍 & 𝙎𝙏𝘼𝙁𝙁 〕───⬣
│👑 ${usedPrefix}addprem / ${usedPrefix}delprem / ${usedPrefix}listprem  
│💎 ${usedPrefix}addcoin / ${usedPrefix}addxp  
│💻 ${usedPrefix}update / ${usedPrefix}restart / ${usedPrefix}setppbot  
│🧩 ${usedPrefix}saveplugin / ${usedPrefix}deletefile / ${usedPrefix}getplugin  
╰────────────────⬣

╭───〔 🍑 𝙈𝙊𝘿𝙊 +18 🔞 〕───⬣
│⚠️ Usa con precaución:  
│🔹 ${usedPrefix}nsfw1 / ${usedPrefix}nsfw2 / ${usedPrefix}r34 <tag>  
│🔹 ${usedPrefix}hentai / ${usedPrefix}cosplay / ${usedPrefix}tetas  
│🔹 ${usedPrefix}sexo / ${usedPrefix}follar / ${usedPrefix}spank / ${usedPrefix}lesbianas  
╰────────────────⬣

🌸 ʙʏ ᴏᴍᴀʀ ɢʀᴀɴᴅᴀ | ᴠᴇʀꜱɪᴏɴ 1.8.2  
💮 ᴍɪʏᴜᴋɪʙᴏᴛ ᴍᴅ — ᴇʟ ᴇsᴛɪʟᴏ ᴍᴇᴊᴏʀᴀᴅᴏ 💫
`;

    await conn.reply(m.chat, menu, m);
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '⚠️ Error al mostrar el menú. Verifica la consola.', m)
  }
}


function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

handler.help = ['menu', 'help']
handler.tags = ['main']
handler.command = ['menu', 'help', 'comandos']

export default handler