var createScene = require('gl-plot3d')
var readAudio = require('read-audio')
var CBuffer = require('CBuffer')
var writable = require('writable2')
var nextTick = require('next-tick')

var Scope = require('./')

var scene = createScene()
var scope = Scope({
  gl: scene.gl
})
scene.add(scope)

var opts = {
  buffer: 2048,
  channels: 1
}

readAudio(opts, function (err, stream) {
  if (err) { throw err }

  var bufShape = [opts.buffer * 10, opts.channels]
  var buf = CBuffer(size(bufShape))
  buf.fill(0)

  stream
  .pipe(writable.obj({
    highWaterMark: 1
  }, function (audio, enc, cb) {
    for (var i = 0; i < audio.shape[0]; i++) {
      buf.push(audio.data[i])
    }

    scope.render({
      data: buf,
      shape: bufShape
    })

    nextTick(cb)
  }))
})

function size (shape) {
  return shape.reduce(mult)
}
function mult (a, b) { return a * b }
