# midi-link

A simple event-based API for binding to MIDI events.  Use this for controlling javascript apps via a MIDI Keyboard, or Syncing up to Ableton Live or other DAWs.

## Usage

```
var MidiLink = require('midi-link')
var link = new MidiLink()
link.noteOn('C0', function(velocity) {
  // Do something when C0 is triggered
})

link.ccMessage(12, function(value) {
  // Do something with the value, from 1-127 of control signal 12.
})
```
