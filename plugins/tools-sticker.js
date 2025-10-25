import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {
let stiker = false
let userId = m.sender
let packstickers = global.db.data.users[userId] || {}
let texto1 = packstickers.text1 || global.packsticker
let texto2 = packstickers.text2 || global.packsticker2
try {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
let txt = args.join(' ')
if (/webp|image|video/g.test(mime) && q.download) {
if (/video/.test(mime) && (q.msg || q).seconds > 16)
return conn.reply(m.chat, '🚩 𝙀𝙡 𝙫𝙞𝙙𝙚𝙤 𝙣𝙤 𝙥𝙪𝙚𝙙𝙚 𝙙𝙪𝙧𝙖𝙧 𝙢𝙖𝙨 𝙙𝙚 *15* 𝙨𝙚𝙜𝙪𝙣𝙙𝙤𝙨', m)
let buffer = await q.download()
await m.react('⏰')
let marca = txt ? txt.split(/[\u2022|]/).map(part => part.trim()) : [texto1, texto2]
stiker = await sticker(buffer, false, marca[0], marca[1])
} else if (args[0] && isUrl(args[0])) {
let buffer = await sticker(false, args[0], texto1, texto2)
stiker = buffer
} else {
return conn.reply(m.chat, '🫵 𝙍𝙚𝙨𝙥𝙤𝙣𝙙𝙖 𝙖 𝙪𝙣𝙖 𝙞𝙢𝙖𝙜𝙚𝙣 𝙤 𝙫𝙞𝙙𝙚𝙤 𝙥𝙖𝙧𝙖 𝙘𝙧𝙚𝙖𝙧 𝙚𝙡 𝙨𝙩𝙞𝙠𝙚𝙧.', m, rcanal)
}} catch (e) {
await conn.reply(m.chat, '⚠️ 𝙊𝙘𝙪𝙧𝙧𝙞𝙤 𝙪𝙣 𝙚𝙧𝙧𝙤𝙧: ' + e.message, m)
await m.react('✖️')
} finally {
if (stiker) {
conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
await m.react('✔️')
}}}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker']

export default handler

const isUrl = (text) => {
return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(jpe?g|gif|png)/, 'gi'))
}