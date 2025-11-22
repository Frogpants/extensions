# Vectors

This extension adds vectors for 2D, 3D, and 4D. Along with easy to use dynamic vector functions.

In this extension, vectors are defined as a type of static length JavaScript Array.

Typically, vectors are represented as `(0,0,0)`, but this extension represents vectors as `[0,0,0]`.

For the sake of simplicity, when refering to the origin in this document, that means `[0,0]` or `[0,0,0]` or `[0,0,0,0]`.

## Dynamic Functions

What does Dynamic Functions mean?

In this extension, dynamic vector functions means that no matter the vector type inputted into a vector function, it will calculate a result.

If the function requires two vectors, the vectors must be the same type.

For example, 3D vectors must be multiplied by another 3D vector.

```scratch
multiply vectors ['[0,0,0]'] * ['[0,0,0]'] :: #5b72dbff
```

If you were to attempt to multiply a 3D vector by a 2D vector, you will get the error `Invalid Vector Types`.

```scratch
multiply vectors ['[0,0,0]'] * ['[0,0]'] :: #5b72dbff // THIS DOES NOT WORK
```

This error will be outputted as a string so you can detect in your code when this occurs.

> [!IMPORTANT]
> All functions shown in this document will be using 3D vectors as examples, but all of them can also use 2D or even 4D vectors unless explicitly stated otherwise.

## Vector Functions

The `Vector Functions` section of the Vectors Extension are commonly used vector functions, commonly used for 3D projects.

This does not mean that you only have to use it for just that, you can also use them for machine learning or physics simulations.

### Magnitude

Magnitude finds the size of a vector, but also just the distance of the vector from the origin.

```scratch
magnitude of ['[0.1,0.6,0.2]'] :: #5b72dbff
```

### Dot Product

The dot product finds the degree in which two vectors point in the same direction.

```scratch
dot product of ['[1,6,2]'] and ['[5,2,7]'] :: #5b72dbff
```

The dot product can also be found with `Ax*Bx + Ay*By + Az*Bz`, but why would you ever do that manually???

### Cross Product

The cross product finds the direction normal to two vectors.

```scratch
cross product of ['[1,2,3]'] and ['[4,5,6]'] :: #5b72dbff
```

### Normal

The normal is a perpendicular vector to a surface.

```scratch
normal of ['[1,2,3]'] :: #5b72dbff
```

