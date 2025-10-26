import os from 'os'
import moment from 'moment-timezone'
import speed from 'performance-now'

let handler = async (m, { conn }) => {
  try {
    await m.react('🌸')
    conn.sendPresenceUpdate('composing', m.chat)

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let totalCommands = Object.keys(global.plugins).length
const iconos = [
      'https://qu.ax/TPfmC.jpg'
    ]
    const randomIcono = iconos[Math.floor(Math.random() * iconos.length)]

    const vs = global.vs || '1.8.0'
    const libreria = global.libreria || 'Baileys'
    const botname = global.botname || 'MiyukiBot-MD'
    const textbot = global.textbot || 'MiyukiBot-MD 🌸'
    const redes = global.redes || 'https://github.com/'
    const channelRD = global.channelRD || { id: '', name: 'Canal Oficial 🌸' }

    // ⏳ Ping
    let timestamp = speed()
    let ping = (speed() - timestamp).toFixed(2)

    // 🕓 Uptime
    let uptime = clockString(process.uptime() * 1000)

    // 🖥️ RAM info
    let total = (os.totalmem() / 1024 / 1024).toFixed(0)
    let free = (os.freemem() / 1024 / 1024).toFixed(0)
    let used = total - free

    // 📅 Fecha y hora
    let fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
    let hora = moment.tz('America/Lima').format('HH:mm:ss')
    let dia = moment.tz('America/Lima').format('dddd')
    let menu = `
╭━━━〔 𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿 🌸 〕━━⬣
│👤 *Usuario:* @${mentionedJid.split('@')[0]}
│📚 *Comandos:* ${totalCommands}
│⚙️ *Versión:* ${vs}
│🛠️ *Librería:* ${libreria}
│🤖 *Bot:* ${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}
│🚀 *Tiempo activo:* ${uptime}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 💾 ESTADO DEL SISTEMA 〕─⬣
│💾 *RAM Total:* ${total} MB
│📈 *RAM Usada:* ${used} MB
│📉 *RAM Libre:* ${free} MB
│🌿 *Ping:* ${ping} ms
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 🗓️ FECHA Y HORA 〕─⬣
│📅 *Día:* ${dia}
│📆 *Fecha:* ${fecha}
│⏰ *Hora:* ${hora}
╰━━━━━━━━━━━━━━━━━━⬣
╭─━━━💰 𝐄𝐂𝐎𝐍𝐎𝐌𝐈́𝐀 💰━━━─╮
│✨ Comandos para ganar y administrar tu dinero
│
│🏗️ 𝗧𝗥𝗔𝗕𝗔𝗝𝗢𝗦
│• 💼 #work | #w | #trabajar
│• 💋 #slut | #prostituirse
│• ⛏️ #miming | #minar | #mine
│• 🏕️ #aventura | #adventure
│• 🦌 #cazar | #hunt
│• 🎣 #fish | #pescar
│• ⚔️ #mazmorra | #dungeon
│
│🎲 𝗔𝗣𝗨𝗘𝗦𝗧𝗔𝗦 𝘆 𝗝𝗨𝗘𝗚𝗢𝗦
│• 🎰 #casino | #slot [cantidad]
│• 🪙 #coinflip | #flip | #cf [cantidad] <cara/cruz>
│• 🎯 #roulette | #rt [red/black] [cantidad]
│• 🚨 #crime | #crimen
│
│🏦 𝗕𝗔𝗡𝗖𝗢 𝘆 𝗚𝗘𝗦𝗧𝗜𝗢́𝗡
│• 💳 #balance | #bal | #bank <usuario>
│• 💰 #deposit | #dep | #d [cantidad] | all
│• 💸 #withdraw | #with | #retirar [cantidad] | all
│• 💎 #givecoins | #pay | #coinsgive <@usuario> [cantidad]
│• 🏅 #economyboard | #eboard | #baltop <página>
│• 📊 #economyinfo | #einfo
│
│🎁 𝗥𝗘𝗖𝗢𝗠𝗣𝗘𝗡𝗦𝗔𝗦
│• ⏰ #daily | #diario
│• 🗓️ #weekly | #semanal
│• 📅 #monthly | #mensual
│• 🧰 #cofre | #coffer
│
│💀 𝗔𝗖𝗖𝗜𝗢𝗡𝗘𝗦
│• 🦹 #steal | #robar | #rob <@usuario>
│• ❤️‍🩹 #curar | #heal
│
╰──────────────────────────────╯
💵 *Haz crecer tu fortuna y conviértete en el más rico del servidor!*

╭─━━━📥 𝐌𝐄𝐍𝐔 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒 📥━━━─╮
│✨ Comandos para descargar contenido y archivos
│
│🎶 𝗠𝗨́𝗦𝗜𝗖𝗔 𝘆 𝗩𝗜́𝗗𝗘𝗢𝗦
│• 🎧 #play | #play2 + [canción]
│• 🎵 #ytmp3 | #ytmp4 + [link]
│• 🔍 #ytsearch | #search + [búsqueda]
│
│📱 𝗥𝗘𝗗𝗘𝗦 𝗬 𝗣𝗟𝗔𝗧𝗔𝗙𝗢𝗥𝗠𝗔𝗦
│• 🎬 #tiktok | #tt + [link / búsqueda]
│• 📸 #ig | #instagram + [link]
│• 🐦 #twitter | #x + [link]
│• 📘 #facebook | #fb + [link]
│• 📍 #pinterest | #pin + [búsqueda / link]
│
│📂 𝗔𝗥𝗖𝗛𝗜𝗩𝗢𝗦 𝗬 𝗔𝗣𝗞𝗦
│• 🗂️ #mediafire | #mf + [link]
│• 📦 #mega | #mg + [link]
│• 📱 #apk | #modapk + [búsqueda]
│• 🖼️ #image | #imagen + [búsqueda]
│
╰──────────────────────────────╯
💡 *Descarga música, videos y archivos desde cualquier sitio con estilo.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╭─━━━🎴 𝐌𝐄𝐍𝐔 𝐆𝐀𝐂𝐇𝐀 🎴━━━─╮
│✨ Reclama, colecciona y presume tus personajes favoritos
│
│💠 𝗖𝗢𝗠𝗣𝗥𝗔 𝗬 𝗖𝗟𝗔𝗜𝗠
│• 💎 #buycharacter | #buychar | #buyc + [nombre]
│• 🧧 #claim | #c | #reclamar {citar personaje}
│• 🗑️ #delclaimmsg | #deletewaifu | #delchar + [nombre]
│• 💬 #setclaimmsg | #setclaim + [mensaje]
│
│🎨 𝗜𝗠𝗔́𝗚𝗘𝗡𝗘𝗦 𝗬 𝗜𝗡𝗙𝗢
│• 🖼️ #charimage | #waifuimage | #wimage + [nombre]
│• 📜 #charinfo | #winfo | #waifuinfo + [nombre]
│• 📚 #serieinfo | #ainfo | #animeinfo + [nombre]
│• 🗂️ #serielist | #slist | #animelist
│• 💫 #gachainfo | #ginfo | #infogacha
│
│🤝 𝗜𝗡𝗧𝗘𝗥𝗖𝗔𝗠𝗕𝗜𝗢 𝗬 𝗩𝗘𝗡𝗧𝗔
│• 💰 #sell | #vender + [precio] [nombre]
│• 🛍️ #removesale | #removerventa + [precio] [nombre]
│• 🔄 #trade | #intercambiar + [tu personaje] / [personaje 2]
│• 🎁 #givechar | #givewaifu | #regalar + [@usuario] [nombre]
│• 💞 #giveallharem + [@usuario]
│
│🔥 𝗝𝗨𝗘𝗚𝗢𝗦 𝗬 𝗥𝗔𝗡𝗞𝗜𝗡𝗚𝗦
│• 🎲 #rollwaifu | #rw | #roll
│• 💖 #robwaifu | #robarwaifu + [@usuario]
│• 👑 #favoritetop | #favtop
│• 🏆 #waifusboard | #waifustop | #topwaifus | #wtop + [número]
│• 💌 #harem | #waifus | #claims + <@usuario>
│• 🏪 #haremshop | #tiendawaifus | #wshop + <página>
│
╰──────────────────────────────╯
🌸 *Reúne a tus waifus, sube en el ranking y domina el Gacha!*

*╭─────────*
*│* ⑀✬ \`SOCKETS\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos para registrar tu propio Bot* ❖
*┊* 🤖 *#qr • #code*
*┊* 🤖 *#bots • #botlist*
*┊* 🤖 *#status • #estado*
*┊* 🤖 *#p • #ping*
*┊* 🤖 *#join* + [Invitacion]
*┊* 🤖 *#leave • #salir*
*┊* 🤖 *#logout*
*┊* 🤖 *#setpfp • #setimage*
*┊* 🤖 *#setstatus* + [estado]
*┊* 🤖 *#setusername* + [nombre]
*╰───────────┅≡*

*╭─────────*
*│* ⑀✬ \`UTILITIES\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos de utilidades* ❖
*┊* 📌 *#help • #menu*
*┊* 📌 *#sc • #script*
*┊* 📌 *#reporte • #reportar*
*┊* 📌 *#sug • #suggest*
*┊* 📌 *#calcular • #cal*
*┊* 📌 *#delmeta*
*┊* 📌 *#getpic • #pfp* + [@usuario]
*┊* 📌 *#say* + [texto]
*┊* 📌 *#setmeta* + [autor] | [pack]
*┊* 📌 *#sticker • #s • #wm* + {citar una imagen/video}
*┊* 📌 *#toimg • #img* + {citar sticker}
*┊* 📌 *#brat • #bratv • #qc • #emojimix*︎
*┊* 📌 *#gitclone* + [Link]
*┊* 📌 *#enhance • #remini • #hd*
*┊* 📌 *#letra • #style*
*┊* 📌 *#read • #readviewonce*
*┊* 📌 *#ss • #ssweb*
*┊* 📌 *#translate • #traducir • #trad*
*┊* 📌 *#ia • #gemini*
*┊* 📌 *#tourl • #catbox*
*┊* 📌 *#wiki • #wikipedia*
*┊* 📌 *#dalle • #flux*
*┊* 📌 *#npmdl • #nmpjs*
*┊* 📌 *#google*
*╰───────────┅≡*

*╭─────────*
*│* ⑀✬ \`PERFIL\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos para ver y configurar tu perfil* ❖
*┊* 👑 *#leaderboard • #lboard • #top* + <Paginá>
*┊* 👑 *#level • #lvl* + <@Mencion>
*┊* 👑 *#marry • #casarse* + <@Mencion>
*┊* 👑 *#profile* + <@Mencion>
*┊* 👑 *#setbirth* + [fecha]
*┊* 👑 *#setdescription • #setdesc* + [Descripcion]
*┊* 👑 *#setgenre* + Hombre | Mujer
*┊* 👑 *#delgenre • #delgenero*
*┊* 👑 *#delbirth* + [fecha]
*┊* 👑 *#divorce*
*┊* 👑 *#setfavourite • #setfav* + [Personaje]
*┊* 👑 *#prem • #vip*
*┊* 👑 *#deldescription • #deldesc*
*╰───────────┅≡*
 
*╭─────────*
*│* ⑀✬ \`GROUPS\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos para administradores de grupos* ❖
*┊* 🗣️*#tag • #hidetag • #invocar • #tagall* + [mensaje]
*┊* 🗣️ *#detect • #alertas* + [enable/disable]
*┊* 🗣️ *#antilink • #antienlace* + [enable/disable]
*┊* 🗣️ *#bot* + [enable/disable]
*┊* 🗣️ *#close • #cerrar*
*┊* 🗣️ *#demote* + <@usuario> | {mencion}
*┊* 🗣️ *#economy* [enable/disable]  
*┊* 🗣️ *#gacha* [enable/disable]  
*┊* 🗣️ *#welcome • #bienvenida* [enable/disable]  
*┊* 🗣️ *#setbye* [texto]  
*┊* 🗣️ *#setprimary* [@bot]  
*┊* 🗣️ *#setwelcome* [texto]  
*┊* 🗣️ *#kick <@usuario>* | {mencion}  
*┊* 🗣️ *#nsfw* [enable/disable]
*┊* 🗣️ *#onlyadmin* [enable/disable]
*┊* 🗣️ *#open* • #abrir*
*┊* 🗣️ *#promote <@usuario>* | {mencion}  
*┊* 🗣️ *#add • #añadir* • #agregar {número}
*┊* 🗣️ *#admins • admin* [texto]
*┊* 🗣️ *#restablecer • #revoke*
*┊* 🗣️ *#addwarn • #warn* <@usuario> | {mencion}
*┊* 🗣️ *#unwarn • #delwarn* <@usuario> | {mencion}
*┊* 🗣️ *#advlist • #listadv*
*┊* 🗣️ *#inactivos • #kickinactivos*
*┊* 🗣️ *#listnum • #kicknum* [texto]
*┊* 🗣️ *#gpbanner • #groupimg*
*┊* 🗣️ *#gpname • #groupname* [texto]
*┊* 🗣️ *#gpdesc • #groupdesc* [texto]
*┊* 🗣️ *#del • #delete* {citar un mensaje}
*┊* 🗣️ *#linea • #listonline*
*┊* 🗣️ *#gp • #infogrupo*
*┊* 🗣️ *#link*
*╰───────────┅≡*

*╭─────────*
*│* ⑀✬ \`ANIME\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos de reacciones de anime* ❖
*┊* 😡 *#angry • #enojado* <mencion>
*┊* 🧼 *#bath • #bañarse* <mencion>
*┊* 🫦 *#bite • #morder* <mencion>
*┊* 😛 *#bleh • #lengua* <mencion 
*┊* ☺️ *#blush • #sonrojarse* <mencion>
*┊* 🫩 *#bored • #aburrido* <mencion>
*┊* 👏 *#clap • #aplaudir* <mencion>
*┊* ☕ *#coffee • #cafe • #café* <mencion>
*┊* 😭 *#cry • #llorar* <mencion>
*┊* 🙂‍↔️ *#cuddle • #acurrucarse* <mencion>
*┊* 🪩 *#dance • #bailar* <mencion>
*┊* 😫 *#dramatic • #drama* <mencion>
*┊* 🍻 *#drunk • #borracho* <mencion>
*┊* 🍽️ *#eat • #comer* <mencion>
*┊* 😏 *#facepalm • #palmada* <mencion>
*┊* 😄 *#happy • #feliz* <mencion>
*┊* 🫂 *#hug • #abrazar *<mencion>
*┊* 🤰🏻 *#impregnate • #preg • #preñar • #embarazar* <mencion>
*┊* 🥷 *#kill • #matar* <mencion>
*┊* 😘 *#kiss • #muak* <mencion>
*┊* 💋 *#kisscheek • #beso* <mencion>
*┊* 😅 *#laugh • #reirse* <mencion>
*┊* 🤤 *#lick • #lamer* <mencion>
*┊* 😍 *#love • #amor • #enamorado • #enamorada* <mencion>
*┊* 🔥 *#pat • #palmadita • #palmada* <mencion>
*┊* ⛏️ *#poke • #picar* <mencion>
*┊* 😚 *#pout • #pucheros* <mencion>
*┊* 👊 *#punch • #pegar • #golpear* <mencion>
*┊* 🏃 *#run • #correr* <mencion>
*┊* 😔 *#sad • #triste* <mencion>
*┊* 😨 *#scared • #asustado • #asustada* <mencion>
*┊* 🥴 *#seduce • #seducir* <mencion>
*┊* 🤐 *#shy • #timido • #timida* <mencion>
*┊* 🥊 *#slap • #bofetada* <mencion>
*┊* 😴 *#sleep • #dormir* <mencion>
*┊* 🚬 *#smoke • #fumar* <mencion>
*┊* 😮‍💨*#spit • #escupir* <mencion>
*┊* 👣 *#step • #pisar* <mencion>
*┊* 🤔 *#think • #pensar* <mencion>
*┊* 🚶 *#walk • #caminar* <mencion>
*┊* 😉 *#wink • #guiñar* <mencion>
*┊* 😳 *#cringe • #avergonzarse* <mencion>
*┊* 🗣️ *#smug • #presumir* <mencion>
*┊* 😊 *#smile • #sonreir* <mencion>
*┊* ✋ *#highfive • #5* <mencion>
*┊* 😌 *#bully • #bullying* <mencion>
*┊*  *#handhold • #mano* <mencion>
*┊* 👋 *#wave • #ola • #hola* <mencion>
*┊* 🌸 *#waifu*  
*┊* 🤟 *#ppcouple • #ppcp*
*╰───────────┅≡*ׅ
👑 © Powered By OmarGranda
`

    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: {
        mentionedJid: [mentionedJid],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: '',
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: botname,
          body: textbot,
          mediaType: 1,
          mediaUrl: redes,
          sourceUrl: redes,
          thumbnailUrl: 'https://qu.ax/TPfmC.jpg',
          showAdAttribution: false,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('Ocurrió un error al generar el menú.')
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}