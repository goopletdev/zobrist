# KobristJS
Simple JavaScript implementation of Zobrist hashing for game board states, particularly for easy lookup in case of [superko](https://senseis.xmp.net/?Superko).

## Zobrist Hashing:
A technique for encoding board positions as numbers for easy lookup, invented by Albert Zobrist. I don't fully understand the theory, but I took what I could from the titular [Chess Programming Wiki article](https://www.chessprogramming.org/Zobrist_Hashing).

## Use:
Make a `new KoHash(size, values)` with the board size (number of vertices) and number of possible non-empty values on each vertex. It will generate a matrix of one pseudo-random number for each possible non-empty vertex state.

From there, you can `koHashObject.add(boardState)` for each new state, and it will generate a new unique hash key, or throw an error if the key already exists.

## New knowledge!
This project is a part of my JavaScript self-study. This project makes use of the [Bitwise XOR operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_XOR) `^`. In learning how this works, I found myself learning about signed integers and  [Two's complement](https://en.wikipedia.org/wiki/Two%27s_complement). To deal with large numbers unexpectedly becoming negative (is this a type of integer overflow? i should figure that out), I learned about the [Unsigned right shift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unsigned_right_shift) `>>>`, though I'm not so sure it's actually necessary for my implementation. Bitwise operators seem really neat, though, and I'm excited to find more interesting use cases for them!

## Goals: 
- Understand Zobrist Hashing, and hashing in general
- Learn more of the theory behind Two's complement
- Incorporate hashing into my Go library
- Find ways to write efficient, clean, and logical tests for this class.