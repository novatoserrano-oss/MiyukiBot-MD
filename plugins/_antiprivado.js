export async function before(m, { conn, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.message) return !0
  if (m.chat === '120363401404146384@newsletter') return !0

  if (!m.isGroup) {
    const bot = global.db.data.settings[conn.user.jid] || {}
    const isCreator = isROwner

    const excepciones = ['PIEDRA', 'PAPEL', 'TIJERA', 'code', 'qr']
    if (excepciones.some(e => m.text?.toUpperCase().includes(e))) return !0

    if (bot.antiPrivate && !isCreator) {
      await conn.readMessages([m.key])
      return !0
    }
  }

  return !1
}