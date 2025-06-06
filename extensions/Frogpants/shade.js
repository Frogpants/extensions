
(function(Scratch) {
    'use strict';
    const vm = Scratch.vm;
    var transform = {
        pos: {
            x: 0,
            y: 0,
            z: 0
        },
        dir: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: {
            x: 0,
            y: 0,
            z: 0
        }
    };
    var res = 1;
    var cameras = [];
    var meshes = [];
    var rendercheck = false;
    // var light = {
    //     ambient: {
    //         r: 0,
    //     }
    // };
    class RenderEngine{
        getInfo() {
            return {
            id: 'renderengine',
            name: '3D Shade',
            color1: '#84b7f6',
            color2: '#4689db',
            color3: '#356EB6',
            demo: 'https://extensions.turbowarp.org/Frogpants/documentation/home',
            docsURI: 'https://extensions.turbowarp.org/Frogpants/documentation/home',
            blocks: [
                {
                    opcode: 'resolution',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'res'
                },
                {
                    opcode: 'setscrres',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set screen resolution to [NUM]',
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'setshaderes',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set shade resolution to [NUM]',
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                '---',
                {
                    opcode: 'resettrans',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'reset transformations',
                },
                {
                    opcode: 'translate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'translate x:[X] y:[Y] z:[Z]',
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
                    opcode: 'rotate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'rotate around [AXIS] by [ANGLE] degrees',
                    arguments: {
                        AXIS: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'AXIS_MENU'
                        },
                        ANGLE: {
                            type: Scratch.ArgumentType.ANGLE,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'scale',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'scale by x:[WIDTH] y:[HEIGHT] z:[LENGTH]',
                    arguments: {
                        WIDTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        HEIGHT: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        LENGTH: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'transformations',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'transformed [AXIS]',
                    arguments: {
                        AXIS: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'AXIS_MENU'
                        }
                    }
                },
                '---',
                {
                    opcode: 'newcam',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create new camera [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'camera1'
                        }
                    }
                },
                {
                    opcode: 'remcam',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete camera [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'camera1'
                        }
                    }
                },
                {
                    opcode: 'camlst',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'all cameras'
                },
                {
                    opcode: 'allcams',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'remove all cameras'
                },
                '---',
                {
                    opcode: 'newmesh',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create new mesh [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'mesh1'
                        }
                    }
                },
                {
                    opcode: 'staticmesh',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create static [OBJECT] mesh',
                    arguments: {
                        OBJECT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'OBJ_MENU'
                        }
                    }
                },
                {
                    opcode: 'remmesh',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'delete mesh [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'mesh1'
                        }
                    }
                },
                {
                    opcode: 'meshlst',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'all meshes'
                },
                {
                    opcode: 'allmeshes',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'remove all meshes'
                },
                '---',
                {
                    opcode: 'rendertype',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set render type to [TYPE]',
                    arguments: {
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'RENDER_MENU'
                        }
                    }
                },
                {
                    opcode: 'render',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'render environment'
                },
                {
                    opcode: 'drawcheck',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'is rendering?'
                },
                {
                    opcode: 'setcolor',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set [TYPE] color to [COLOR]',
                    arguments: {
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'LIGHT_MENU'
                        },
                        COLOR: {
                            type: Scratch.ArgumentType.COLOR,
                            defaultValue:'#f68484'
                        }
                    }
                },
                '---',
                {
                    opcode: 'rgb',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'r:[R] g:[G] b:[B]',
                    arguments: {
                        R: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        G: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        B: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'rgba',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'r:[R] g:[G] b:[B] a:[A]',
                    arguments: {
                        R: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        G: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        B: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        A: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        disableMonitor: true
                    }
                },
                '---',
                {
                    opcode: 'rgba',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'r:[R] g:[G] b:[B] a:[A]',
                },
                '---'
            ],
            menus: {
                FORMAT_MENU: {
                    acceptReporters: true,
                    items: ['rgb', 'hex', 'base64']
                },
                AXIS_MENU: {
                    acceptReporters: true,
                    items: ['X', 'Y', 'Z']
                },
                RENDER_MENU: {
                    acceptReporters: true,
                    items: ['Raytracing', 'Raycasting', 'DDA Raycasting']
                },
                LIGHT_MENU: {
                    acceptReporters: true,
                    items: ['Ambient', 'Sunlight', 'Diffuse', 'Specular']
                },
                OBJ_MENU: {
                    acceptReporters: true,
                    items: ['Cone', 'Cube', 'Cylinder', 'Plane', 'Pyramid', 'Sphere', 'Torus', 'Tube',]
                }
            }
            };
        };

        // Resolution

        resolution() {
            return res;
        }

        setscrres(args) {
            res = args.NUM;
        }

        setshaderes(args) {
            res = args.NUM;
        }

        // Transformations

        resttrans() {
            transform.pos.x = 0;
            transform.pos.y = 0;
            transform.pos.z = 0;
        }

        translate(args) {
            transform.pos.x += args.X;
            transform.pos.y += args.Y;
            transform.pos.z += args.Z;
        }

        rotate(args) {
            if (args.AXIS === 'X') {
                transform.dir.x += args.ANGLE;
            } else if (args.AXIS === 'Y') {
                transform.dir.y += args.ANGLE;
            } else {
                transform.dir.z += args.ANGLE;
            }
        }

        scale(args) {
            transform.scale.x += args.X;
            transform.scale.y += args.Y;
            transform.scale.z += args.Z;
        }

        transformations(args) {
            if (args.AXIS === 'X') {
                return transform.pos.x;
            } else if (args.AXIS === 'Y') {
                return transform.pos.y;
            } else {
                return transform.pos.z;
            }
        }

        // Cameras

        newcam(args) {
            const inp = Scratch.Cast.toString(args.TEXT);
            if (!cameras.includes(inp)) {
                cameras.push(inp);
            }
            cameras = cameras;
        }

        remcam(args) {
            const index = cameras.indexOf(args.TEXT);
            if (index > -1) {
                cameras.splice(index, 1);
            }
            cameras = cameras;
        }

        camlst() {
            return Scratch.Cast.toString(cameras);
        }

        allcams() {
            cameras = [];
        }

        // Meshes

        newmesh(args) {
            const inp = Scratch.Cast.toString(args.TEXT);
            if (!cameras.includes(inp)) {
                meshes.push(inp);
            }
            meshes = meshes;
        }

        staticmesh(args) {
            if (args.OBJECT === 'Cone') {
                return 'Cone';
            } else if (args.OBJECT === 'Cube') {
                return 'Cube';
            } else if (args.OBJECT === 'Cylinder') {
                return 'Cylinder';
            } else if (args.OBJECT === 'Plane') {
                return 'Plane';
            } else if (args.OBJECT === 'Pyramid') {
                return 'Pyramid';
            } else if (args.OBJECT === 'Sphere') {
                return 'Sphere';
            } else if (args.OBJECT === 'Torus') {
                return 'Torus';
            } else if (args.OBJECT === 'Tube') {
                return 'Tube';
            } else {
                return 'Unknown object';
            }
        }

        remmeshes(args) {
            const index = cameras.indexOf(args.TEXT);
            if (index > -1) {
                meshes.splice(index, 1);
            }
            meshes = meshes;
        }

        meshlst() {
            return Scratch.Cast.toString(meshes);
        }

        allmeshes() {
            meshes = [];
        }

        // Render Controls

        rendertype(args) {
            if (args.TYPE === 'Raytracing') {
                return 'trace';
            } else if (args.TYPE === 'Raycasting') {
                return 'cast';
            } else {
                return 'dda';
            }
        }

        render() {
            rendercheck = true;
            const canvas = vm.renderer.canvas;
            const ctx = canvas.getContext('2d');

            const width = canvas.width/2;
            const height = canvas.height/-2;

            ctx.fillStyle = 'blue';

            ctx.fillRect(width,height,50,50);
        }

        drawcheck() {
            return rendercheck;
        }

        setcolor(args) {
            if (args.LIGHT_MENU === 'Ambient') {
                return 'trace';
            } else if (args.LIGHT_MENU === 'Sunlight') {
                return 'cast';
            } else {
                return 'dda';
            }
        }

        // Color Code

        rgb(args) {
            const r = args.R * 256 * 256;
            const g = args.G * 256;
            const b = args.B;
            return r + g + b;
        }

        rgba(args) {
            const a = args.A;
            const r = args.R * 256 * 256 * 256;
            const g = args.G * 256 * 256;
            const b = args.B * 256;
            return a + r + g + b;
        }
    }

    Scratch.extensions.register(new RenderEngine());
})(Scratch);