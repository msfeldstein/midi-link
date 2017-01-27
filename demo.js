var MIDI = require('./index')

var link = new MIDI()

function makeMeter(note, color) {
  var meter = document.createElement('span')
  meter.style.backgroundColor = color
  meter.style.width = '50px'
  meter.style.height = '10px'
  meter.style.display = 'inline-block'
  document.body.appendChild(meter)
  console.log(meter)
  link.noteOn(note, function() {
    meter.style.height = '50px'
  })
  link.noteOff(note, function() {
    meter.style.height = '10px'
  })
}

makeMeter('C0', '#ff0000')
makeMeter('C#0', '#0000ff')