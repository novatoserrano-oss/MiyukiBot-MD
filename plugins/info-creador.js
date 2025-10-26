// by dv.shadow - https://github.com/Yuji-XDev

import { proto } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'

const name = "OmarGranda"
const empresa = "𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿"
const numCreador = "51927303598"
const correo = "omargranda673@gmail.com"
const web = "https://github.com/OmarGranda"
const about = " Creador y desarrollodor del MiyukiBot 🧑‍💻 "
const direccion = "Perú"

const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa}
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber("+" + numCreador).getNumber("international")}
EMAIL:${correo}
URL:${web}
NOTE:${about}
ADR:;;${direccion};;;;
X-ABADR:ES
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim()

const contactMessage = {
  displayName: name,
  vcard
}

let handler = async (m, { conn }) => {
  await m.react("👑")
  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: name,
        contacts: [contactMessage]
      },
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "Contacto De Mi Creador 👑",
          body: "",
          mediaType: 1,
          thumbnailUrl: 'https://qu.ax/KVDzy.jpg',
          renderLargerThumbnail: true,
          sourceUrl: web
      }
    }
  },
    { quoted: m }
  )
}

handler.help = ["creador"]
handler.tags = ["info"]
handler.command = ["creador", "creator", "owner"]

export default handler