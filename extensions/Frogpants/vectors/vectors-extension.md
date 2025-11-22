# Vectors

This extension adds vectors for 2D, 3D, and 4D. Along with easy to use dynamic vector functions.

In this extension, vectors are defined as a type of static length JavaScript Array.

Typically, vectors are represented as `(0,0,0)`, but this extension represents vectors as `[0,0,0]`.

## Dynamic Functions

What does Dynamic Functions mean?

In this extension, dynamic vector functions means that no matter the vector type inputted into a vector function, it will calculate a result.

If the function requires two vectors, the vectors must be the same type.

For example, 3D vectors must be multiplied by another 3D vector.

```scratch
multiply vectors ['[0,0,0]'] * ['[0,0,0]'] :: #5b72dbff
```

If you were to attempt to multiply a 3D vector by a 2D vector, you will get the error `Invalid Vector Types`.

This error will be outputted as a string so you can detect in your code when this occurs.