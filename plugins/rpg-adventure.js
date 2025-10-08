let handler = async (m, { conn, command, usedPrefix }) => {
  // Tu ID del canal
  const canalID = '120363422169517881@newsletter' //  Usa "${usedPrefix}heal" para curarte.`, m)
  const cooldown = 20 * 60 * 1000
  const now = Date.now()
  if (now  0) txt.push(${min} minuto${min !== 1 ? 's' : ''})
  txt.push(${sec} segundo${sec !== 1 ? 's' : ''})
  return txt.join(' ')
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const aventuras = [
  { tipo: 'victoria', mensaje: 'Derrotaste a un ogro emboscado entre los árboles de Drakonia,' },
  { tipo: 'victoria', mensaje: 'Te conviertes en campeón del torneo de gladiadores de Valoria,' },
  { tipo: 'victoria', mensaje: 'Rescatas un libro mágico del altar de los Susurros,' },
  { tipo: 'victoria', mensaje: 'Liberas a aldeanos atrapados en las minas de Ulderan tras vencer a los trolls,' },
  { tipo: 'victoria', mensaje: 'Derrotas a un dragón joven en los acantilados de Flamear,' },
  { tipo: 'victoria', mensaje: 'Encuentras un relicario sagrado en las ruinas de Iskaria y lo proteges de saqueadores,' },
  { tipo: 'victoria', mensaje: 'Triunfas en el duelo contra el caballero corrupto de Invalion,' },
  { tipo: 'victoria', mensaje: 'Conquistas la fortaleza maldita de las Sombras Rojas sin sufrir bajas,' },
  { tipo: 'victoria', mensaje: 'Te infiltras en el templo del Vacío y recuperas el cristal del equilibrio,' },
  { tipo: 'victoria', mensaje: 'Resuelves el acertijo de la cripta eterna y obtienes un tesoro legendario,' },
  { tipo: 'derrota', mensaje: 'El hechicero oscuro te lanzó una maldición y huyes perdiendo recursos,' },
  { tipo: 'derrota', mensaje: 'Te extravías en la jungla de Zarkelia y unos bandidos te asaltan,' },
  { tipo: 'derrota', mensaje: 'Un basilisco te embiste y escapas herido sin botín,' },
  { tipo: 'derrota', mensaje: 'Fracasa tu incursión a la torre de hielo cuando caes en una trampa mágica,' },
  { tipo: 'derrota', mensaje: 'Pierdes orientación entre los portales del bosque espejo y terminas sin recompensa,' },
  { tipo: 'neutro', mensaje: 'Exploras ruinas antiguas y aprendes secretos ocultos sin hallar tesoros.' },
  { tipo: 'neutro', mensaje: 'Sigues la pista de un espectro pero desaparece entre la niebla.' },
  { tipo: 'neutro', mensaje: 'Acompañas a una princesa por los desiertos de Thaloria sin contratiempos.' }
]