var defined = require('defined')
var ndarray = require('ndarray')
var createLines = require('gl-line3d')
var extend = require('xtend')

module.exports = oscilloscope

function oscilloscope (opts) {

  var lines = createLines(
    extend(opts, {
      position: null
    })
  )

  lines.render = render

  return lines

  function render (state) {
    lines.update(
      extend(opts, {
        position: getPoints(state)
      })
    )
  }
}

function getPoints (state) {
  var points = new Array(state.shape[0])

  if (!defined(state)) {
    return points
  }

  var array = ndarray(state.data, state.shape, state.stride)

  for (var t = 0; t < array.shape[0]; t++) {
    for (var c = 0; c < array.shape[1]; c++) {
      var sample = Math.max(-1, Math.min(1, array.get(t, c)))

      points[t] = [
        t / array.shape[0],
        sample,
        c / array.shape[1]
      ]
    }
  }

  return points
}
