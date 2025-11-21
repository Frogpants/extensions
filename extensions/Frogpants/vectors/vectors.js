// Name: Vectors
// ID: frogpantsVectors
// Description: Adds vectors and vector math for 2D, 3D, and 4D.
// By: Frogpants <https://scratch.mit.edu/users/XxFrogpantsxX/>
// License: MIT

(function(Scratch) {
    'use strict';
    const makeLabel = (text) => ({
        blockType: "label",
        text: text,
    });

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This Turbo Mode example must run unsandboxed');
    }
    const vm = Scratch.vm;

    var camera = [0, 0, 0];
    var rotation = [0, 0, 0];

    var FOV = 90;
    var rads = (FOV * Math.PI)/180;
    var f = Scratch.vm.runtime.stageWidth/Math.tan(rads/2);

    var near = 0.1;


    function simpleVec2(x, y) {
        return [x, y];
    };

    function simpleVec3(x, y, z) {
        return [x, y, z];
    };

    class VectorsExtension {
        getInfo() {
            return {
                id: 'vectorsextension',
                name: 'Vectors',
                color1: '#5b72dbff',
                color2: '#4556a3ff',
                color3: '#283261ff',
                docsURI: 'https://extensions.turbowarp.org/Frogpants/Vectors',
                blocks: [
                    makeLabel("General Functions"),
                    {
                        opcode: 'magnitude',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'magnitude of [VECTOR]',
                        arguments: {
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0]"
                            },
                        }
                    },
                    {
                        opcode: 'dot',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'dot product of [VECTOR1] and [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,1,1]"
                            },
                        }
                    },
                    {
                        opcode: 'cross',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'cross product of [VECTOR1] and [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[3,4,5]"
                            },
                        }
                    },
                    {
                        opcode: 'distance',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'distance between [VECTOR1] and [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,1,1]"
                            },
                        }
                    },
                    {
                        opcode: 'base',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vector of [NUM] with size [FORMAT]',
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 0
                            },
                            FORMAT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'VECTOR_TYPES'
                            }
                        }
                    },
                    "---",
                    makeLabel("General Equations"),
                    {
                        opcode: 'add',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'add vectors [VECTOR1] + [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,2,3]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[4,5,6]"
                            },
                        }
                    },
                    {
                        opcode: 'subtract',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'subtract vectors [VECTOR1] - [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,2,3]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[4,5,6]"
                            },
                        }
                    },
                    {
                        opcode: 'multiply',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'multiply vectors [VECTOR1] * [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,2,3]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[4,5,6]"
                            },
                        }
                    },
                    {
                        opcode: 'divide',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'divide vectors [VECTOR1] / [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,2,3]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[4,5,6]"
                            },
                        }
                    },"---",
                    makeLabel("Camera"),
                    {
                        opcode: 'setCamPos',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set camera position to [VECTOR]',
                        arguments: {
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
                        }
                    },
                    {
                        opcode: 'setCamRot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set camera rotation to [VECTOR]',
                        arguments: {
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
                        }
                    },
                    {
                        opcode: 'getCamPos',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'camera position'
                    },
                    {
                        opcode: 'getCamRot',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'camera rotation'
                    },
                    "---",
                    makeLabel("2D Vector"),
                    {
                        opcode: 'vector2D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vec2 x:[X] y:[Y]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'goto2D',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set position of [MENU] to vec2 [VECTOR]',
                        arguments: {
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0]"
                            },
                            MENU: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SPRITES'
                            }
                        }
                    },
                    "---",
                    makeLabel("3D Vector"),
                    {
                        opcode: 'vector3D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vec3 x:[X] y:[Y] z:[Z]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'p3Dto2D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'project vec3 [V3] to vec2',
                        arguments: {
                            V3: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
                        }
                    },
                    "---",
                    makeLabel("4D Vector"),
                    {
                        opcode: 'vector4D',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'vec4 x:[X] y:[Y] z:[Z] w:[W]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            W: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    }
                ],
                menus: {
                    VECTOR_TYPES: {
                        acceptReporters: true,
                        items: ['2D', '3D', '4D']
                    },
                    SPRITES: {
                        items: "getSpriteNames"
                    }
                }
            }; 
        }

        getSpriteNames() {
            return Scratch.vm.runtime.targets
                .filter(t => t.isSprite)
                .map(t => t.getName());
        }

        magnitude(args) {
            const lst = JSON.parse(args.VECTOR);
            var result = 0;
            for (let i = 0; i < lst.length; i++) {
                const n = Scratch.Cast.toNumber(lst[i]);
                result += Math.pow(n, 2);
            }
            result = Math.sqrt(result);
            return result;
        }

        dot(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var result = 0;
            if (v1.length != v2.length) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                const n1 = Scratch.Cast.toNumber(v1[i]);
                const n2 = Scratch.Cast.toNumber(v2[i]);
                result += n1*n2;
            }
            return result;
        }

        cross(args) {
            const a = JSON.parse(args.VECTOR1);
            const b = JSON.parse(args.VECTOR2);
            return JSON.stringify([
                a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]
            ]);
        }

        distance(args) {
            return this.magnitude({VECTOR: this.subtract(args)});
        }

        base(args) {
            const size = Scratch.Cast.toNumber(args.FORMAT[0]);
            return JSON.stringify(Array(size).fill(args.NUM));
        }

        add(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var r = [];
            if (v1.length != v2.length) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                r.push(v1[i]+v2[i]);
            }
            return JSON.stringify(r);
        }

        subtract(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var r = [];
            if (v1.length != v2.length) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                r.push(v1[i]-v2[i]);
            }
            return JSON.stringify(r);
        }

        multiply(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var r = [];
            if (v1.length != v2.length) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                r.push(v1[i]*v2[i]);
            }
            return JSON.stringify(r);
        }

        divide(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var r = [];
            if (v1.length != v2.length) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                r.push(v1[i]/v2[i]);
            }
            return JSON.stringify(r);
        }

        setCamPos(args) {
            camera = JSON.parse(args.VECTOR);
        }

        setCamRot(args) {
            if (JSON.parse(args.VECTOR).length > 2) {
                rotation = JSON.parse(args.VECTOR);
            } else {
                rotation = JSON.parse(args.VECTOR);
                rotation.push(0);
            }
        }

        getCamPos(args) {
            return JSON.stringify(camera);
        }

        getCamRot(args) {
            return JSON.stringify(rotation);
        }

        vector2D(args) {
            return JSON.stringify([args.X, args.Y]);
        }

        goto2D(args) {  
            const rt = Scratch.vm.runtime;
            const sprite = rt.targets.find(t => t.getName() === args.MENU);

            if (!sprite) return;

            const v = JSON.parse(args.VECTOR);

            sprite.setXY(v[0], v[1]);
        }

        vector3D(args) {
            return JSON.stringify([args.X, args.Y, args.Z]);
        }

        p3Dto2D(args) {
            const v = JSON.parse(args.V3);
            var pos = simpleVec3(v[0]-camera[0], v[1]-camera[1], v[2]-camera[2]);
            const invZ = 1 / Math.max(near, pos[2]);
            console.log(camera);
            pos = simpleVec2(f*pos[0]*invZ, f*pos[1]*invZ);
            return JSON.stringify([pos[0], pos[1]]);
        }

        vector4D(args) {
            return JSON.stringify([args.X, args.Y, args.Z, args.W]);
        }
    }
    Scratch.extensions.register(new VectorsExtension());
})(Scratch);