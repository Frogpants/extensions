
(function(Scratch) {
    'use strict';
    const vm = Scratch.vm
    class RenderEngine{
        getInfo() {
            return {
            id: 'renderengine',
            name: '3D Shade',
            color1: '#84b7f6',
            color2: '#4689db',
            color3: '#356EB6',
            docsURI: 'https://extensions.turbowarp.org/documentation/home',
            blocks: [
                {
                    opcode: 'resolution',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'res'
                },
                {
                    opcode: 'shade',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'convert [TEXT] to [FORMAT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '#FF00FF'
                        },
                        FORMAT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'FORMAT_MENU'
                        }
                    }
                },
                {
                    opcode: 'wait',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'wait [NUM] seconds',
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                    }
                },
                {
                    opcode: 'link',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'grab link [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://extensions.turbowarp.org/hello.txt'
                        },
                    }
                }
            ],
            menus: {
                FORMAT_MENU: {
                    acceptReporters: true,
                    items: ['rgb', 'hex', 'base64']
                }
            }
            };
        };

        shade (args) {
            if (args.FORMAT === 'rgb') {
                return 'rgb';
            } else if (args.FORMAT === 'hex') {
                return 'hex';
            } else {
                return 'base64';
            }
        }

        resolution() {
            return 1;
        }

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