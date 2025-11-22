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
    const axis = ['x', 'y', 'z', 'w'];

    function randVal(a, b) {
        if (a === Math.floor(a)) {
            if (b === Math.floor(b)) {
                return Math.floor(Math.random() * (b-a+1) + a);
            }
        }
        return Math.random() * (b-a) + a;
    };

    function simpleVec2(x, y) {
        return [x, y];
    };

    function simpleVec3(x, y, z) {
        return [x, y, z];
    };

    function simpleMagnitude(lst) {
        let sum = 0;
        lst.forEach(num => {
            sum += num*num;
        });
        return Math.sqrt(sum);
    }

    function checkLength(v1, v2) {
        if (v1.length === v2.length) {
            return true;
        }
        return false;
    };

    var sinLst = [];
    var cosLst = [];
    var tanLst = [];

    function genTrigVals(s) {
        const increment = s;
        for (let i = 0; i < 360/s; i ++) {
            const rad = (i*increment*Math.PI)/180;
            sinLst.push(Math.sin(rad));
            cosLst.push(Math.cos(rad));
            tanLst.push(Math.tan(rad));
        }
    };
    genTrigVals(1);

    function sin(a) {
        const rad = (a*Math.PI)/180;
        return Math.sin(rad)
        // a = ((a % 360) + 360) % 360;
        // return sinLst[Math.floor(sinLst.length*a)]
    };

    function cos(a) {
        const rad = (a*Math.PI)/180;
        return Math.sin(rad)
        // a = ((a % 360) + 360) % 360;
        // return cosLst[Math.floor(cosLst.length*a)]
    };

    function tan(a) {
        const rad = (a*Math.PI)/180;
        return Math.sin(rad)
        // a = ((a % 360) + 360) % 360;
        // return tanLst[Math.floor(tanLst.length*a)]
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
                    makeLabel("Vector Functions"),
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
                        opcode: 'normal',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'normal of [VECTOR]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
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
                    "---",
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
                    {
                        opcode: 'select',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get [AXIS] of vector [VECTOR]',
                        arguments: {
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'AXIS'
                            },
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
                        }
                    },
                    "---",
                    makeLabel("General Operations"),
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
                            }
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
                            }
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
                            }
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
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'random',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'pick random [A] to [B] with vector [FORMAT]',
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            FORMAT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'VECTOR_TYPES'
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'module',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[VECTOR1] mod [VECTOR2]',
                        arguments: {
                            VECTOR1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[1,2,3]"
                            },
                            VECTOR2: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[4,5,6]"
                            }
                        }
                    },
                    {
                        opcode: 'round',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'round [VECTOR]',
                        arguments: {
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'operation',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[OPERATIONS] of [VECTOR]',
                        arguments: {
                            OPERATIONS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "OPERATIONS"
                            },
                            VECTOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "[0,0,0]"
                            }
                        }
                    },
                    "---",
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
                        },
                        disableMonitor: true
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
                        acceptReporters: true,
                        items: "getSpriteNames"
                    },
                    AXIS: {
                        acceptReporters: true,
                        items: axis
                    },
                    OPERATIONS: {
                        acceptReporters: false,
                        items: ['abs', 'floor', 'ceiling', 'sqrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'ln', 'log', 'e^', '10^']
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
            if (!checkLength(v1, v2)) {
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
            if (!checkLength(a, b)) {
                return "Invalid Vector Types";
            }
            return JSON.stringify([
                a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]
            ]);
        }

        normal(args) {
            const v = JSON.parse(args.VECTOR);
            const m = simpleMagnitude(v);
            var r = [];
            for (let i = 0; i < v.length; i++) {
                r.push(v[i]/m);
            }
            return r;
        }

        distance(args) {
            return this.magnitude({VECTOR: this.subtract(args)});
        }

        base(args) {
            const size = Scratch.Cast.toNumber(args.FORMAT[0]);
            return JSON.stringify(Array(size).fill(args.NUM));
        }

        select(args) {
            const v = JSON.parse(args.VECTOR);
            const id = axis.indexOf(args.AXIS);
            if (id+1 > v.length) {
                return "Axis Does Not Exist";
            }

            return JSON.stringify(v[id]);
        }

        add(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var r = [];
            if (!checkLength(v1, v2)) {
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
            if (!checkLength(v1, v2)) {
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
            if (!checkLength(v1, v2)) {
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
            if (!checkLength(v1, v2)) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                r.push(v1[i]/v2[i]);
            }
            return JSON.stringify(r);
        }

        random(args) {
            const size = Scratch.Cast.toNumber(args.FORMAT[0]);
            var v = [];
            for (let i = 0; i < size; i++) {
                v.push(randVal(args.A, args.B));
            }
            return JSON.stringify(v);
        }

        module(args) {
            const v1 = JSON.parse(args.VECTOR1);
            const v2 = JSON.parse(args.VECTOR2);
            var r = [];
            if (!checkLength(v1, v2)) {
                return "Invalid Vector Types";
            }

            for (let i = 0; i < v1.length; i++) {
                r.push(v1[i]%v2[i]);
            }
            return JSON.stringify(r);
        }

        round(args) {
            const v = JSON.parse(args.VECTOR);
            var r = [];

            for (let i = 0; i < v.length; i++) {
                r.push(Math.round(v[i]));
            }
            return JSON.stringify(r);
        }

        operation(args) {
            const v = JSON.parse(args.VECTOR);
            var lst = [];
            var op = args.OPERATIONS;
            if (args.OPERATIONS === "e^") {
                op = 
            }
            for (let i = 0; i < v.length; i++) {
                const r = eval("Math." + op + "(" + v[i].toString() + ")");
                lst.push(r);
            }
            return JSON.stringify(lst);
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
            console.log(pos);
            pos = simpleVec3(pos[0]*cos(rotation[0])-pos[2]*sin(rotation[0]), pos[1], pos[0]*sin(rotation[0])+pos[2]*cos(rotation[0]));
            pos = simpleVec3(pos[0], pos[1]*cos(rotation[1])-pos[2]*sin(rotation[1]), pos[1]*sin(rotation[1])+pos[2]*cos(rotation[1]));
            pos = simpleVec3(pos[0]*cos(rotation[2])-pos[1]*sin(rotation[2]), pos[0]*sin(rotation[2])+pos[1]*cos(rotation[2]), pos[2]);
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