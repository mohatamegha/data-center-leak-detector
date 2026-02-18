let alarmContext = null
let alarmOscillator = null
let alarmGain = null
let alarmInterval = null

export function startAlarm() {
  if (alarmOscillator) return // already playing

  alarmContext = new (window.AudioContext || window.webkitAudioContext)()

  alarmOscillator = alarmContext.createOscillator()
  alarmGain = alarmContext.createGain()

  alarmOscillator.type = "sawtooth"
  alarmOscillator.frequency.value = 440
  alarmGain.gain.value = 0.15

  alarmOscillator.connect(alarmGain)
  alarmGain.connect(alarmContext.destination)
  alarmOscillator.start()

  // Siren sweep between 440Hz and 880Hz
  let rising = true
  alarmInterval = setInterval(() => {
    if (!alarmOscillator || !alarmContext) return

    const target = rising ? 880 : 440
    alarmOscillator.frequency.linearRampToValueAtTime(
      target,
      alarmContext.currentTime + 0.6
    )

    rising = !rising
  }, 600)
}

export function stopAlarm() {
  if (alarmOscillator) {
    alarmOscillator.stop()
    alarmOscillator.disconnect()
    alarmOscillator = null
  }

  if (alarmGain) {
    alarmGain.disconnect()
    alarmGain = null
  }

  if (alarmContext) {
    alarmContext.close()
    alarmContext = null
  }

  if (alarmInterval) {
    clearInterval(alarmInterval)
    alarmInterval = null
  }
}
