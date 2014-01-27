"use strict"

var contour = require("../contour")
var pack = require("ndarray-pack")
var tape = require("tape")

tape("contour extraction", function(t) {

  function compareVertex(a, b) {
    var d = a[1] - b[1]
    if(d) {
      return d
    }
    return a[0] - b[0]
  }

  function canonicalForm(loops) {
    //Make copy
    loops = loops.slice(0)
    //First put each loop in canonical form so top-left entry is at the root
    for(var j=0; j<loops.length; ++j) {
      var l = loops[j]
      var tl = 0
      for(var i=0; i<l.length; ++i) {
        if(compareVertex(l[i], l[tl]) < 0) {
          tl = i
        }
      }
      var s0 = l.slice(tl)
      var s1 = l.slice(0, tl)
      s0.push.apply(s0, s1)
      loops[j] = s0
    }
    //Then sort loops by 
    loops.sort(function(a, b) {
      return compareVertex(a[0], b[0])
    })
    return loops
  }

  function test(image, clockwise, expected) {
    var loops = canonicalForm(contour(pack(image), clockwise))
    t.same(loops, canonicalForm(expected), "checking inputs match")
  }

  test([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
    ], false,
    [
      [[1,1], [1,3], [3,3], [3,1]]
    ])

  test([
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
    ], true,
    [
      [[1,1], [3,1], [3,3], [1,3]]
    ])

  test([
    [0,0,1,1],
    [0,0,1,1],
    [1,1,0,0],
    [1,1,0,0]
    ], false,
    [
      [[2,0],[2,2],[0,2],[0,4],[2,4],[2,2],[4,2],[4,0]]
    ])

  test([
    [1,1,1],
    [1,0,1],
    [1,1,1]
    ], true,
    [
      [[0,0],[3,0],[3,3],[0,3]],
      [[1,1],[1,2],[2,2],[2,1]]
    ]
    )

  test([
    [1]
    ], true,
    [
      [[0,0], [1,0], [1,1], [0,1]]
    ])
  
  t.end()
})