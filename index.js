class MIDILink {
  constructor() {
    navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))
    this.noteOnListeners = {}
    this.noteOffListeners = {}
    this.ccListeners = {}
  }
  
  noteOn(noteName, cb) {
    var note = MIDILink.noteToSignalMap[noteName]
    this.noteOnListeners[note] = this.noteOnListeners[note] || []
    this.noteOnListeners[note].push(cb)
  }
  
  noteOff(noteName, cb) {
    var note = MIDILink.noteToSignalMap[noteName]
    this.noteOffListeners[note] = this.noteOffListeners[note] || []
    this.noteOffListeners[note].push(cb)
  }
  
  ccMessage(note, cb) {
    this.ccListeners[note] = this.ccListeners[note] || []
    this.ccListeners[note].push(cb)
  }
  
  onMIDISuccess(midiAccess) {
    for (let input of midiAccess.inputs.values()) {
      input.addEventListener('midimessage', this._onMessage.bind(this))
    }
  }
  
  _onMessage(e) {
    var data = e.data
    var cmd = data[0] >> 4
    var channel = data[0] & 0xf
    var type = data[0] & 0xf0 // channel agnostic message type. Thanks, Phil Burk.
    var note = data[1]
    var velocity = data[2]
    // console.log(note, velocity)
    switch (type) {
    case 144: // noteOn message 
      this._triggerNoteOn(note, velocity, channel)
      break
    case 128: // noteOff message 
      this._triggerNoteOff(note, velocity, channel)
      break
    case 176: // CC message
      this._triggerCCMessage(note, velocity, channel)
      break
    }
  }
  
  _triggerNoteOn(note, velocity) {
    for (let cb of this.noteOnListeners[note] || []) {
      cb(velocity)
    }
  }
  
  _triggerNoteOff(note, velocity) {
    for (let cb of this.noteOffListeners[note] || []) {
      cb(velocity)
    }
  }
  
  _triggerCCMessage(note, velocity, channel) {
    for (let cb of this.ccListeners[note] || []) {
      cb(velocity)
    }
  }

  onMIDIFailure(e) {
    console.error("Error connecting to midi", e)
  }
}

// Generate the map from note name to midi signal.
// The midi note range goes from C-2=0 (Two octaves below middle C)
// to G8=127 (8 octaves above Middle G) 
function generateNoteMap() {
  const noteToSignalMap = {}
  const signalToNoteMap = {}
  const staff = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  for (var signal = 0; signal < 127; signal++) {
    var noteName = staff[signal % staff.length] + (-2 + Math.floor(signal / staff.length))
    noteToSignalMap[noteName] = signal
    signalToNoteMap[signal] = noteName
  }
  return {
    noteToSignalMap,
    signalToNoteMap
  }
}
MIDILink.noteToSignalMap = generateNoteMap().noteToSignalMap

module.exports = MIDILink