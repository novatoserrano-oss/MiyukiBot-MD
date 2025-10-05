handler = async (m, { conn, text }) => {
  let user = global.db.data.users[m.sender]

  let nombre = user.name || 'Sin nombre 💭'
  let edad = user.age || 'Desconocida 💫'
  let pp
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    pp = icono
  }

  user.registered = false

  await conn.sendMessage(m.chat, {
    text: `🌸・｡ﾟ✧｡・ﾟ✿・｡ﾟ✧｡・ﾟ🌸
      🍰✨ 𝑅𝐸𝐺𝐼𝑆𝑇𝑅𝑂 𝐸𝐿𝐼𝑀𝐼𝑁𝐴𝐷𝑂 ✨🍰
🌸・｡ﾟ✧｡・ﾟ✿・｡ﾟ✧｡・ﾟ🌸

🐰💖 *Nombre anterior:* ${nombre}  
🎀🎂 *Edad:* ${edad} años  

🦋💌 Esperamos verte de nuevo muy pronto, ¡te extrañaremos!  

━━━━━━━━━━━━━━━
🌷 𝑬𝒔𝒄𝒓𝒊𝒃𝒆: *.reg Nombre Edad*  
para volver a registrarte 💕
━━━━━━━━━━━━━━━`,
    mentions: [m.sender],
    contextInfo: {
      externalAdReply: {
        title: `🌸 Registro eliminado con éxito ${emojis}`,
        body: `✨ Usuario: ${nombre} • ${edad} años ✨`,
        thumbnailUrl: pp,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: pp
      }
    }
  }, { quoted: m })
}

handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true

export default handler