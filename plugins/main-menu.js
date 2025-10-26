import os from 'os'
import moment from 'moment-timezone'
import speed from 'performance-now'

let handler = async (m, { conn }) => {
  try {
    await m.react('🌸')
    conn.sendPresenceUpdate('composing', m.chat)

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let totalCommands = Object.keys(global.plugins).length

    const randomIcono = iconos[Math.floor(Math.random() * iconos.length)]
*/
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

*╭─────────*
*│* ⑀✬ \`𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos de para ganar money* ❖
*┊* 🤑 #w • #work • #trabajar*
*┊* 🤑 *#slut • #protituirse*
*┊* 🤑 *#coinflip • #flip • #cf* + [cantidad] <cara/cruz>
*┊* 🤑 *#crime • #crimen*
*┊* 🤑 *#roulette • #rt* + [red/black] [cantidad]
*┊* 🤑 *#casino • #apostar* • *#slot* + [cantidad]
*┊* 🤑 *#balance • #bal • #bank* + <usuario>
*┊* 🤑 *#deposit • #dep • #depositar • #d* + [cantidad] | all
*┊* 🤑 *#withdraw • #with • #retirar* + [cantidad] | all
*┊* 🤑 *#economyinfo • #einfo*
*┊* 🤑 *#givecoins • #pay • #coinsgive* + [usuario] [cantidad]
*┊* 🤑 *#miming • #minar • #mine*
*┊* 🤑 *#daily • #diario*
*┊* 🤑 *#cofre* • *#coffer*
*┊* 🤑 *#weekly • #semanal*
*┊* 🤑 *#monthly • #mensual*
*┊* 🤑 *#steal • #robar • #rob* + [@mencion]
*┊* 🤑 *#economyboard • #eboard • #baltop* + <pagina>
*┊* 🤑 *#aventura • #adventure*
*┊* 🤑 *#curar • #heal*
*┊* 🤑 *#cazar • #hunt*
*┊* 🤑 *#fish • #pescar*
*┊* 🤑 *#mazmorra • #dungeon*
*╰───────────┅≡*

*╭─────────*
*│* ⑀✬ \`DOWNLOAD\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos para descargar archivos de varias fuentes* ❖
*┊* 📥 *#tiktok • #tt* + [Link] / [busqueda]
*┊* 📥 *#mediafire • #mf* + [Link]
*┊*  *#mega • #mg* + [Link]
*┊* 📥 *#play • #play2* + [Cancion]
*┊* 📥 *#ytmp3 • #ytmp4* [Link]
*┊* 📥 *#facebook • #fb* + [Link]
*┊* 📥 *#twitter • #x* + [Link]
*┊* 📥 *#ig • #instagram* + [Link]
*┊* 📥 *#pinterest • #pin* + [busqueda] / [Link]
*┊* 📥 *#image • #imagen* + [busqueda]
*┊* 📥 *#apk • #modapk* + [busqueda]
*┊* 📥 *#ytsearch • #search* + [busqueda]
*╰───────────┅≡*

*╭─────────*
*│* ⑀✬ \`GACHA\`  ︴
*╰─╮*
*╭─╯*
*┊ Comandos para reclamar y colecciónar personajes* ❖
*┊* 🎁 *#buycharacter • #buychar • #buyc* + [nombre]
*┊* 🎁 *#charimage • #waifuimage • #cimage • #wimage* + [nombre]
*┊* 🎁 *#charinfo • #winfo • #waifuinfo* + [nombre]
*┊* 🎁 *#claim • #c • #reclamar* + {citar personaje}
*┊* 🎁 *#delclaimmsg*
*┊* 🎁 *#deletewaifu • #delwaifu • #delchar* + [nombre]
*┊* 🎁 *#favoritetop • #favtop*
*┊* 🎁 *#gachainfo • #ginfo • #infogacha*
*┊* 🎁 *#giveallharem* + [@usuario]
*┊* 🎁 *#givechar • #givewaifu • #regalar* + [@usuario] [nombre]
*┊* 🎁 *#robwaifu • #robarwaifu* + [@usuario]
*┊* 🎁 *#harem • #waifus • #claims* + <@usuario>
*┊* 🎁 *#haremshop • #tiendawaifus • #wshop* + <Pagina>
*┊* 🎁 *#removesale • #removerventa* + [precio] [nombre]
*┊* 🎁 *#rollwaifu • #rw • #roll*
*┊* 🎁 *#sell • #vender* + [precio] [nombre]
*┊* 🎁 *#serieinfo • #ainfo • #animeinfo* + [nombre]
*┊* 🎁 *#serielist • #slist • #animelist*
*┊* 🎁 *#setclaimmsg • #setclaim* + [mensaje]
*┊* 🎁 *#trade • #intercambiar* + [Tu personaje] / [Personaje 2]
*┊* 🎁 *#vote • #votar* + [nombre]
*┊* 🎁 *#waifusboard • #waifustop • #topwaifus • #wtop* + [número]
*╰───────────┅≡*

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
          thumbnailUrl: 'https://qu.ax/TPfmC.jpg'
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