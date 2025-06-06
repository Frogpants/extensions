
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
    class RenderEngine{
        getInfo() {
            return {
            id: 'renderengine',
            name: '3D Shade',
            color1: '#84b7f6',
            color2: '#4689db',
            color3: '#356EB6',
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
                    text: 'all cameras',
                },
                {
                    opcode: 'allcams',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'remove all cameras',
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
                    text: 'render environment',
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
                    disableMonitor: true,
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
                        }
                    }
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
                }
            }
            };
        };

        // Rendering

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
            if (args.AXIS_MENU === 'X') {
                transform.dir.x += args.ANGLE;
            } else if (args.AXIS_MENU === 'Y') {
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

            if (args.AXIS_MENU === 'X') {
                return transform.pos.x;
            } else if (args.AXIS_MENU === 'Y') {
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

        allcams(args) {
            cameras = [];
        }

        // Render Controls
        rendertype(args) {
            if (args.RENDER_MENU === 'Raytracing') {
                return 'trace';
            } else if (args.RENDER_MENU === 'Raycasting') {
                return 'cast';
            } else {
                return 'dda';
            }
        }

        render() {
            const canvas = Scratch.vm.renderer.canvas;
            const ctx = canvas.getContext('2d');

            const width = canvas.width/2;
            const height = canvas.height/-2;

            ctx.fillStyle = 'blue';

            ctx.fillRect(width,height,50,50);
        }

        // Color Code

        rgb(args) {
            const r = args.R * 256 * 256;
            const g = args.G * 256;
            const b = args.B;
            return r + g + b;
        }

        rgba(args) {
            const a = args.A * 256 * 256 * 256;
            const r = args.R * 256 * 256;
            const g = args.G * 256;
            const b = args.B;
            return a + r + g + b;
        }
    }

    Scratch.extensions.register(new RenderEngine());
})(Scratch);