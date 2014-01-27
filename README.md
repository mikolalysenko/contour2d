contour-2d
==========
Extracts a 2D rectilinear polygon from a binary image encoded as an ndarray.  Works in node.js and browserify.

## Example

```javascript
var pack = require("ndarray-pack")
var contour2D = require("contour-2d")

//Get a contour
console.log(contour2D(pack([
  [1, 1, 1, 0, 0],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1]
])))

//Prints out:
//  
//  [ [ [ 0, 0 ],
//      [ 0, 3 ],
//      [ 5, 3 ],
//      [ 5, 1 ],
//      [ 3, 1 ],
//      [ 3, 0 ] ],
//    [ [ 2, 1 ],
//      [ 2, 2 ],
//      [ 1, 2 ],
//      [ 1, 1 ] ] ]
//
```

## Install

```
npm install contour-2d
```

## API

### `require("contour-2d")(image[, flip])`
Extracts a contour polygon from the image.

* `image` is a binary ndarray
* `flip` is an optional flag, which if set reverse the orientations of the loops

**Returns** A list of loops representing the oriented boundary of the polygon.

## Credits
(c) 2014 Mikola Lysenko. MIT License