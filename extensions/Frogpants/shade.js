
(function(Scratch) {
    'use strict';
    const vm = Scratch.vm;
    var pos = {
        x: 0,
        y: 0,
        z: 0
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
                    text: 'rotate [AXIS] by [ANGLE] degrees',
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
            pos.x = 0;
            pos.y = 0;
            pos.z = 0;
        }

        translate(args) {
            pos.x += args.X;
            pos.y += args.Y;
            pos.z += args.Z;
        }

        rotate(args) {
            if (args.AXIS_MENU === 'X') {
                return pos.x;
            } else if (args.AXIS_MENU === 'Y') {
                return pos.y;
            } else {
                return pos.z;
            }
        }

        transformations(args) {

            if (args.AXIS_MENU === 'X') {
                return pos.x;
            } else if (args.AXIS_MENU === 'Y') {
                return pos.y;
            } else {
                return pos.z;
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

        // Misc

        wait(args) {
            return new Promise((resolve, reject) => {
                const timeInMilliseconds = args.NUM * 1000;
                setTimeout(() => {
                    resolve();
                }, timeInMilliseconds);
            });
        }

        link(args) {
            return fetch(args.URL)
            .then((response) => {
                return response.text();
            })
            .catch((error) => {
                console.error(error);
                return 'Uh oh! Something went wrong.';
            });
        }
    }

    Scratch.extensions.register(new RenderEngine());
})(Scratch);