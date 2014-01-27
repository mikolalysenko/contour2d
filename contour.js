"use strict"

module.exports = getContours

function Segment(start, end, direction, height) {
  this.start = start
  this.end = end
  this.direction = direction
  this.height = height
  this.visited = false
  this.next = null
  this.prev = null
}

function Vertex(x, y, segment, orientation) {
  this.x = x
  this.y = y
  this.segment = segment
  this.orientation = orientation
}

function getParallelCountours(array, direction) {
  var n = array.shape[0]
  var m = array.shape[1]
  var contours = []
  //Scan top row
  var a = false
  var b = false
  var c = false
  var d = false
  var x0 = 0
  var i=0, j=0
  for(j=0; j<m; ++j) {
    b = !!array.get(0, j)
    if(b === a) {
      continue
    }
    if(a) {
      contours.push(new Segment(x0, j, direction, 0))
    }
    if(b) {
      x0 = j
    }
    a = b
  }
  if(a) {
    contours.push(new Segment(x0, j, direction, 0))
  }
  //Scan center
  for(i=1; i<n; ++i) {
    a = false
    b = false
    x0 = 0
    for(j=0; j<m; ++j) {
      c = !!array.get(i-1, j)
      d = !!array.get(i, j)
      if(c === a && d === b) {
        continue
      }
      if(a !== b) {
        if(a) {
          contours.push(new Segment(j, x0, direction, i))
        } else {
          contours.push(new Segment(x0, j, direction, i))
        }
      }
      if(c !== d) {
        x0 = j
      }
      a = c
      b = d
    }
    if(a !== b) {
      if(a) {
        contours.push(new Segment(j, x0, direction, i))
      } else {
        contours.push(new Segment(x0, j, direction, i))
      }
    }
  }
  //Scan bottom row
  a = false
  x0 = 0
  for(j=0; j<m; ++j) {
    b = !!array.get(n-1, j)
    if(b === a) {
      continue
    }
    if(a) {
      contours.push(new Segment(j, x0, direction, n))
    }
    if(b) {
      x0 = j
    }
    a = b
  }
  if(a) {
    contours.push(new Segment(j, x0, direction, n))
  }
  return contours
}

function getVertices(contours) {
  var vertices = new Array(contours.length * 2)
  for(var i=0; i<contours.length; ++i) {
    var h = contours[i]
    if(h.direction === 0) {
      vertices[2*i] = new Vertex(h.start, h.height, h, 0)
      vertices[2*i+1] = new Vertex(h.end, h.height, h, 1)
    } else {
      vertices[2*i] = new Vertex(h.height, h.start, h, 0)
      vertices[2*i+1] = new Vertex(h.height, h.end, h, 1)
    }
  }
  return vertices
}

function walk(v, clockwise) {
  var result = []
  while(!v.visited) {
    v.visited = true
    if(v.direction) {
      result.push([v.height, v.end])
    } else {
      result.push([v.start, v.height])
    }
    if(clockwise) {
      v = v.next
    } else {
      v = v.prev
    }
  }
  return result
}

function compareVertex(a, b) {
  var d = a.x - b.x
  if(d) {
    return d
  }
  d = a.y - b.y
  if(d) {
    return d
  }
  return a.orientation - b.orientation
}


function getContours(array, clockwise) {

  var clockwise = !!clockwise

  //First extract horizontal contours and vertices
  var hcontours = getParallelCountours(array, 0)
  var hvertices = getVertices(hcontours)
  hvertices.sort(compareVertex)

  //Extract vertical contours and vertices
  var vcontours = getParallelCountours(array.transpose(1, 0), 1)
  var vvertices = getVertices(vcontours)
  vvertices.sort(compareVertex)

  //Glue horizontal and vertical vertices together
  var nv = hvertices.length
  for(var i=0; i<nv; ++i) {
    var h = hvertices[i]
    var v = vvertices[i]
    if(h.orientation) {
      h.segment.next = v.segment
      v.segment.prev = h.segment
    } else {
      h.segment.prev = v.segment
      v.segment.next = h.segment
    }
  }

  //Unwrap loops
  var loops = []
  for(var i=0; i<hcontours.length; ++i) {
    var h = hcontours[i]
    if(!h.visited) {
      loops.push(walk(h, clockwise))
    }
  }

  //Return
  return loops
}