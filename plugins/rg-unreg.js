let handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender]

    user.registered = false

    // 💫 Reacción
    await conn.sendMessage(m.chat, { react: { text: '🚯', key: m.key } })

    // 🖼️ Imagen (puedes cambiar la URL por la tuya)
    let img = 'https://qu.ax/yFQEz.jpg' 

    // 💬 Nuevo diseño del mensaje
    let msg = `
╭━〔 🗑️ 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 〕
┃
┃ 🚫 *Tu registro ha sido eliminado correctamente.*
┃
┃ 💐 *Gracias por haber formado parte de nuestra familia.*
┃ 💫 Esperamos verte de nuevo muy pronto.
┃
╰━━━━━━━━━━━━━━━━━━━━╯

┏━〔 📜 𝙋𝘼𝙍𝘼 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝙍𝙏𝙀 𝘿𝙀 𝙉𝙐𝙀𝙑𝙊 〕
┃
┃ ✏️ Usa el siguiente comando:
┃
┃ 💠 *.reg Nombre.Edad*
┃
┗━━━━━━━━━━━━━━━━━━━━┛
`

    // 📤 Enviar mensaje con imagen y texto
    await conn.sendFile(m.chat, img, 'bye.jpg', msg, m)
}

handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true

export default handler