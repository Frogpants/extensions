
(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Pen+ must be run unsandboxed");
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const canvas = runtime.renderer.canvas;
    const gl = runtime.renderer._gl;

    const EXAMPLE_IMAGE = "https://extensions.turbowarp.org/dango.png";

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE_MINUS_CONSTANT_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
        }

    function createProgram(gl, vsSource, fsSource) {
        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    async function loadShaderFile(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load shader: ${path}`);
        return await response.text();
    }

    const vertexShaderSource = `
        attribute vec3 position;
        attribute vec3 normal;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        varying vec3 vNormal;

        void main() {
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;

        varying vec3 vNormal;
        uniform vec3 lightDir;
        uniform vec3 baseColor;

        void main() {
            vec3 N = normalize(vNormal);
            vec3 L = normalize(lightDir);

            float diff = max(dot(N, L), 0.0);

            vec3 shadedColor = baseColor * diff;

            gl_FragColor = vec4(shadedColor, 1.0);
        }
    `;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = [
        -1, -1,
        1, -1,
        -1,  1,
        1,  1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    const texcoords = [
        0, 0,
        1, 0,
        0, 1,
        1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    function loadTexture(gl, url, callback) {
        const texture = gl.createTexture();
        const image = new Image();
        image.crossOrigin = "";
        image.src = url;
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            gl.RGBA, gl.UNSIGNED_BYTE, image
            );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            callback(texture);
        };
    }

    function render(texture) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordLocation);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        const samplerLocation = gl.getUniformLocation(program, "u_image");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(samplerLocation, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    loadTexture(gl, "https://extensions.turbowarp.org/dango.png", (texture) => {
        render(texture);
    });

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
                    opcode: 'texlink',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'set mesh [TEXT] texture to [IMG]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'mesh1'
                        },
                        IMG: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://extensions.turbowarp.org'
                        }
                    }
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
                    text: 'is rendering?',
                    disableMonitor: true
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
                '---'
            ],
            menus: {
                FORMAT_MENU: {
                    acceptReporters: true,
                    items: ['rgb', 'hex']
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
                    items: ['Cone', 'Cube', 'Cylinder', 'Plane', 'Pyramid', 'Sphere', 'Torus', 'Tube']
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
            const canvas = document.querySelector('canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(100, 100, 50, 0, Math.PI * 2);
            ctx.fill();
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
    }

    Scratch.extensions.register(new RenderEngine());
})(Scratch);