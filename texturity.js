webpackJsonp([1],{

/***/ "./node_modules/texturity.js/src/framebuffer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class FloatFrameBuffer {
    
    constructor(gl, w, h) {
        this.gl = gl;
        this.w = w;
        this.h = h;

        this.framebuffer = this.initFB();
    }

    result() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(this.framebuffer.buffer);

        return this.framebuffer.texture;
    }

    initFB() {
        var gl = this.gl;

        if (!(gl instanceof WebGL2RenderingContext)) throw new Error('Need webgl 2');
        //gl.getExtension('OES_texture_float_linear');
        var ext = gl.getExtension('EXT_color_buffer_float');
    
        if (!ext) 
            throw new Error('no EXT_color_buffer_float');
        
        var buffer = gl.createFramebuffer();
    
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    
        var texture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, this.w, this.h, 0, gl.RGBA, gl.FLOAT, null);
    
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    
        var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    
        if (status != gl.FRAMEBUFFER_COMPLETE) 
            alert('can not render to floating point textures');
        
        return { buffer, texture };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FloatFrameBuffer;



/***/ }),

/***/ "./node_modules/texturity.js/src/generators/brick.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (class {
    
    constructor(count, margin) {
        this.count = count;
        this.margin = margin;
    }

    getBricks(w, h) {
        var bricks = [];
        var ly = this.count * 2;

        var m = this.margin / ly;
        var mw = Math.round(m * w);
        var mh = Math.round(m * h);
        
        for (var y = 0; y < ly * 2; y++)
            for (var x = 0, lx = ly / 2 + y % 2; x < lx; x++) {
                var hd = h / ly;
                var wd = w / ly * 2;
                var oy = y * hd;
                var ox = y % 2 * (-wd / 2) + x * wd;
                
                bricks.push([ox + mw, oy + mh, wd - 2 * mw, hd - 2 * mh]);
            }
        return bricks;
    }

});

/***/ }),

/***/ "./node_modules/texturity.js/src/generators/transform.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (class {
    
    constructor(tx, ty, repeat) {
        this.tx = tx;
        this.ty = ty;
        this.repeat = repeat;
    }

    getRects(w, h) {
        var rects = [];

        var tx = this.tx % 1;
        var ty = this.ty % 1;
        var dw = w / (this.repeat + 1);
        var dh = h / (this.repeat + 1);

        for (var x = -1; x <= this.repeat; x++)
            for (var y = -1; y <= this.repeat; y++) {
                var px = x * dw + tx * dw;
                var py = y * dh + ty * dh;

                rects.push([px, py, dw, dh]);
            }
        return rects;
    }

});

/***/ }),

/***/ "./node_modules/texturity.js/src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["disposeTexture"] = disposeTexture;
/* harmony export (immutable) */ __webpack_exports__["disposeTextures"] = disposeTextures;
/* harmony export (immutable) */ __webpack_exports__["getGL"] = getGL;
/* harmony export (immutable) */ __webpack_exports__["initGL"] = initGL;
/* harmony export (immutable) */ __webpack_exports__["createBuffer"] = createBuffer;
/* harmony export (immutable) */ __webpack_exports__["resize"] = resize;
/* harmony export (immutable) */ __webpack_exports__["loadTexture"] = loadTexture;
/* harmony export (immutable) */ __webpack_exports__["useProgram"] = useProgram;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shader_manager__ = __webpack_require__("./node_modules/texturity.js/src/shader-manager.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__framebuffer__ = __webpack_require__("./node_modules/texturity.js/src/framebuffer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__generators_brick__ = __webpack_require__("./node_modules/texturity.js/src/generators/brick.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__generators_transform__ = __webpack_require__("./node_modules/texturity.js/src/generators/transform.js");





var gl = null;
var element = null;
var programs = null;
var vertexBuffer = null;
var textures = [];
var format = null
var shaderManager = null;

class Canvas {

    constructor(w, h, clearColor = [0.0, 0.0, 0.0, 1.0]) {
        this.w = w;
        this.h = h;
        this.backup = null;
        
        gl = initGL();
        gl.clearColor(...clearColor);
            
        resize(w, h);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    save() {
        this.backup = {
            texture: this.toTexture(),
            width: element.width,
            height: element.height
        };
        return this;
    }

    restore() {
        if (!this.backup) throw 'nothing to restore';

        var w = this.backup.width;
        var h = this.backup.height;

        resize(w, h);
        this.drawTexture(this.backup.texture, 0, 0, w, h);

        this.backup = null;

        return this;
    }
	
    drawBuffer(vertices) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
        return this;
    }

    transform(texture, tx, ty, repeat) {
        var generator = new __WEBPACK_IMPORTED_MODULE_3__generators_transform__["a" /* default */](tx, ty, repeat);

        var rects = generator.getRects(this.w, this.h);

        this.drawTexture(texture, rects);
        return this;
    }

    drawRect(x, y, w, h) {
        this.drawBuffer([x, y,
            x + w, y,
            x + w, y + h,
            x + w, y + h,
            x, y + h,
            x, y]);
        return this;
    }
	
    drawRadialGradient(color1, color2) {
        useProgram(programs.radialGradient);
        gl.uniform3fv(gl.getUniformLocation(programs.radialGradient, 'color1'), color1);
        gl.uniform3fv(gl.getUniformLocation(programs.radialGradient, 'color2'), color2);
        this.drawRect(0, 0, this.w, this.h);
        useProgram(programs.simple);
        
        return this;
    }

    drawBricks(count, margin) {
        this.fillStyle([0, 0, 0, 1]);
        this.drawRect(0, 0, this.w, this.h);
        this.fillStyle([1, 1, 1, 1]);

        var generator = new __WEBPACK_IMPORTED_MODULE_2__generators_brick__["a" /* default */](count, margin);
        var bricks = generator.getBricks(this.w, this.h);

        bricks.forEach(r => this.drawRect(...r));
        
        return this;
    }

    drawCircle(r) {
        useProgram(programs.circle);
        gl.uniform1f(gl.getUniformLocation(programs.circle, 'r'), r);
        
        this.drawRect(0, 0, this.w, this.h);
        useProgram(programs.simple);
        
        return this;
    }

    drawTexture(texture, x, y, w, h, params = [], uvs = null) {
        useProgram(programs.image);
        var uvBuffer = gl.createBuffer();

        uvs = uvs || [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1];

        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
		
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        params.forEach(param => {
            gl.texParameteri(gl.TEXTURE_2D, param[0], param[1]);
        });    

        if (x instanceof Array)
            x.forEach(r => this.drawRect(...r));
        else
        	this.drawRect(x, y, w, h);
        gl.disableVertexAttribArray(1);

        useProgram(programs.simple);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.deleteBuffer(uvBuffer);
  
        return this;
    }

    fillStyle(color) {
        var colorLoc = gl.getUniformLocation(programs.simple, 'color');

        gl.uniform4fv(colorLoc, color);

        return this;
    }

    noise() {
        useProgram(programs.noise);
        gl.uniform1f(gl.getUniformLocation(programs.noise, 'seed'), Math.random());

        this.drawBuffer([-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1]);

        useProgram(programs.simple);

        return this;
    }
	
    blur(texture, iterations) {
        iterations = Math.min(iterations, 100);
        var kernel = new Array(9).fill(1 / 9);
        var currentTexture = texture;

        for (var i = 0; i < iterations; i++) {
            this.convolution(currentTexture, kernel)
            if (i > 0)
                disposeTexture(currentTexture)
            if (i + 1 < iterations)
                currentTexture = this.toTexture();
        }
        return this;
    }

    convolution(texture, matrix) {
        if (!(gl instanceof WebGL2RenderingContext)) throw new Error('Supported only in webgl 2');

        useProgram(programs.convolution);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(programs.convolution, 'texture'), texture);
        gl.uniform1fv(gl.getUniformLocation(programs.convolution, 'matrix'),
            new Float32Array(matrix));
        
        this.drawBuffer([-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1]);
        
        useProgram(programs.simple);
        return this;
    }

    blend(texture, b, expression, preExpressions = '') {
        var blendProgram = shaderManager.createShaderRuntime('blend', b, expression, preExpressions);

        useProgram(blendProgram);
        
        if (b instanceof WebGLTexture) {
            var tex2 = b;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, tex2);
            gl.uniform1i(gl.getUniformLocation(blendProgram, 'texture1'), 0);
            gl.uniform1i(gl.getUniformLocation(blendProgram, 'texture2'), 1);
        } else if (b instanceof Array) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(gl.getUniformLocation(blendProgram, 'texture1'), 0);
            gl.uniform3fv(gl.getUniformLocation(blendProgram, 'color'), b);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(gl.getUniformLocation(blendProgram, 'texture1'), 0);
            gl.uniform1f(gl.getUniformLocation(blendProgram, 'value'), b);
        }
        this.drawBuffer([-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1]);

        useProgram(programs.simple);
        gl.activeTexture(gl.TEXTURE0);
        gl.deleteProgram(blendProgram);
        
        return this;
    }

    neighbors(texture, expression) {
        var neighborsProgram = shaderManager.createShaderRuntime('neighbors', expression);
        
        useProgram(neighborsProgram);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(neighborsProgram, 'tex'), 0);

        this.drawBuffer([-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1]);

        useProgram(programs.simple);
        gl.deleteProgram(neighborsProgram);  
    }

    drawFourierSpectrum(texture) {
       
        this.blend(texture, element.width * element.height, 'vec3(a.z/sqrt(b+a.z*a.z))');
        var uv = 
        [
            -0.5, 0.5,
            0.5, 0.5,
            0.5, -0.5,
            
            0.5, -0.5,
            -0.5, -0.5,
            -0.5, 0.5
        ]
        var params = [[gl.TEXTURE_WRAP_T, gl.REPEAT], [gl.TEXTURE_WRAP_S, gl.REPEAT]];

        texture = this.toTexture();
        this.drawTexture(texture, 0, 0, element.width, element.height, params, uv)
        gl.deleteTexture(texture);

        return this;
    }

    fourierFilter(texture, mask) {
        var fb = new __WEBPACK_IMPORTED_MODULE_1__framebuffer__["a" /* FloatFrameBuffer */](gl, element.width, element.height);
        
        if (mask instanceof WebGLTexture) { /// shift mask
            var uv =
                    [
                        -0.5, 0.5,
                        0.5, 0.5,
                        0.5, -0.5,
            
                        0.5, -0.5,
                        -0.5, -0.5,
                        -0.5, 0.5
                    ]
            var params = [[gl.TEXTURE_WRAP_T, gl.REPEAT], [gl.TEXTURE_WRAP_S, gl.REPEAT]];

            this.drawTexture(mask, 0, 0, element.width, element.height, params, uv)
            gl.deleteTexture(mask);
            mask = this.toTexture();
        }

        this.blend(texture, mask, 'vec3(a.rg*b.r,a.b)');

        return fb.result();
    }

    fourierTransform(texture, inverse = false) {
        var fb = new __WEBPACK_IMPORTED_MODULE_1__framebuffer__["a" /* FloatFrameBuffer */](gl, element.width, element.height);

        var fourier = shaderManager.createShaderRuntime('fourier', this.w, this.h, inverse);

        useProgram(fourier);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.drawRect(0, 0, this.w, this.h);

        return fb.result();
    }

    normalMap(texture, scale) {
        useProgram(programs.normal);
        gl.uniform1f(gl.getUniformLocation(programs.normal, 'scale'), scale);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        this.drawBuffer([-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1]);

        useProgram(programs.simple);
        
        return this;
    }

    toTexture() {
        var texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, format, element.width, element.height, 0, format, gl.UNSIGNED_BYTE, null);
        gl.copyTexImage2D(gl.TEXTURE_2D, 0, format, 0, 0, element.width, element.height, 0);

        textures.push(texture);
        return texture;
    }

    toSrc() {
        return element.toDataURL('image/png');
    }

    async toSrcAsync() {
        return new Promise(resolve => {
            element.toBlob((blob) => {
                resolve(URL.createObjectURL(blob))
            }, 'image/png');
        });    
    }
    
    async toImage() {
        var canv = this;

        return new Promise(function (resolve) {
            var img = new Image();

            img.onload = () => {
                resolve(img);
            };
            img.src = canv.toSrc();
        });
    }

    toImageSync() {
        var img = new Image();

        img.src = this.toSrc();
        return img;
    }
}
/* harmony export (immutable) */ __webpack_exports__["Canvas"] = Canvas;


function disposeTexture(texture) {
    var index = textures.indexOf(texture);

    if (index !==-1)
        textures.splice(index, 1);
    gl.deleteTexture(texture);
}

function disposeTextures() {
    textures.forEach(disposeTexture);
}

function getGL() {
    return gl;
}

function initGL(contextName = 'webgl', params = {}) {
    if (gl) return gl;
  
    params = Object.assign({
        alpha: false,
        antialias: false,
        depth: false
    }, params);

    element = document.createElement('canvas');
    gl = element.getContext(contextName, params);
    format = params.alpha ? gl.RGBA : gl.RGB; 

    shaderManager = new __WEBPACK_IMPORTED_MODULE_0__shader_manager__["a" /* default */](gl);
    programs = shaderManager.createPrecompiledShaders();
    vertexBuffer = createBuffer();

    return gl;
}

function createBuffer() {
    var buffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    var posAttr = gl.getAttribLocation(programs.simple, 'position');
    
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    
    return buffer;
}

function resize(w, h) {
    element.width = w;
    element.height = h;
    
    gl.viewport(0, 0, w, h);
    useProgram(programs.simple);
}

function loadTexture(img) {
    if (!(img instanceof Image)) throw 'argument should be instance of Image';
    
    var tex = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, img);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
}

function useProgram(program) {
    gl.useProgram(program);
    var resolLoc = gl.getUniformLocation(program, 'resolution');

    gl.uniform2fv(resolLoc, [element.width, element.height]);
}

/***/ }),

/***/ "./node_modules/texturity.js/src/shader-manager.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shaders_runtime_blend__ = __webpack_require__("./node_modules/texturity.js/src/shaders/runtime/blend.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shaders_runtime_fourier__ = __webpack_require__("./node_modules/texturity.js/src/shaders/runtime/fourier.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shaders_runtime_neighbors__ = __webpack_require__("./node_modules/texturity.js/src/shaders/runtime/neighbors.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shaders_precompiled_circle__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/circle.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shaders_precompiled_convolution__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/convolution.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shaders_precompiled_image__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/image.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shaders_precompiled_noise__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/noise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__shaders_precompiled_normal__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/normal.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__shaders_precompiled_radial_gradient__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/radial-gradient.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shaders_precompiled_simple__ = __webpack_require__("./node_modules/texturity.js/src/shaders/precompiled/simple.js");












/* harmony default export */ __webpack_exports__["a"] = (class {
    constructor(gl) {
        this.gl = gl;
    }

    createPrecompiledShaders() {
        var precompiled = {
            simple: __WEBPACK_IMPORTED_MODULE_9__shaders_precompiled_simple__["a" /* default */],
            normal: __WEBPACK_IMPORTED_MODULE_7__shaders_precompiled_normal__["a" /* default */],
            convolution: __WEBPACK_IMPORTED_MODULE_4__shaders_precompiled_convolution__["a" /* default */],
            circle: __WEBPACK_IMPORTED_MODULE_3__shaders_precompiled_circle__["a" /* default */],
            image: __WEBPACK_IMPORTED_MODULE_5__shaders_precompiled_image__["a" /* default */],
            noise: __WEBPACK_IMPORTED_MODULE_6__shaders_precompiled_noise__["a" /* default */],
            radialGradient: __WEBPACK_IMPORTED_MODULE_8__shaders_precompiled_radial_gradient__["a" /* default */]
        };

        Object.keys(precompiled).forEach(key => {
            var sources = precompiled[key];

            try {
                precompiled[key] = this.createShaderProgram(sources);
            } catch (e) {
                console.warn(e);
            }
        });
        return precompiled;
    }

    createShaderProgram(sources) {
        var gl = this.gl;
        var vertShader = this.createShader(sources.vertex, gl.VERTEX_SHADER);
        var fragShader = this.createShader(sources.fragment, gl.FRAGMENT_SHADER);
        var shaderProgram = gl.createProgram();
    
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        gl.validateProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            var info = gl.getProgramInfoLog(shaderProgram);
    
            throw new Error('Could not compile WebGL program. \n\n' + info);
        }
        return shaderProgram;
    }

    createShader(source, type) {
        var gl = this.gl;
        var shader = gl.createShader(type);
    
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    
        if (!success)
            throw `could not compile 
                    ${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'} 
                    shader: ${gl.getShaderInfoLog(shader)}\n ${source}`;
        return shader;
    }

    createShaderRuntime(name, ...args) {
        if (name === 'blend')
            return this.createShaderProgram(Object(__WEBPACK_IMPORTED_MODULE_0__shaders_runtime_blend__["a" /* default */])(...args));
        
        if (name === 'fourier')
            return this.createShaderProgram(Object(__WEBPACK_IMPORTED_MODULE_1__shaders_runtime_fourier__["a" /* default */])(...args));
        
        if (name === 'neighbors')
            return this.createShaderProgram(Object(__WEBPACK_IMPORTED_MODULE_2__shaders_runtime_neighbors__["a" /* default */])(...args));
            
        throw new Error('Shader program not registered');
    }
});

/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/chunks/color-models.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function () {
    
    return `
    vec3 hsl2rgb( in vec3 c )
    {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
        
    vec3 HueShift (in vec3 Color, in float Shift)
    {
        vec3 P = vec3(0.55735)*dot(vec3(0.55735),Color);
            
        vec3 U = Color-P;
            
        vec3 V = cross(vec3(0.55735),U);    
        
        Color = U*cos(Shift*6.2832) + V*sin(Shift*6.2832) + P;
            
        return vec3(Color);
    }
        
    vec3 rgb2hsl( in vec3 c ){
        float h = 0.0;
        float s = 0.0;
        float l = 0.0;
        float r = c.r;
        float g = c.g;
        float b = c.b;
        float cMin = min( r, min( g, b ) );
        float cMax = max( r, max( g, b ) );
        
        l = ( cMax + cMin ) / 2.0;
        if ( cMax > cMin ) {
            float cDelta = cMax - cMin;
                
            //s = l < .05 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) ); Original
            s = l < .0 ? cDelta / ( cMax + cMin ) : cDelta / ( 2.0 - ( cMax + cMin ) );
           
            if ( r == cMax ) {
                h = ( g - b ) / cDelta;
            } else if ( g == cMax ) {
                h = 2.0 + ( b - r ) / cDelta;
            } else {
                h = 4.0 + ( r - g ) / cDelta;
            }
    
            if ( h < 0.0) {
                h += 6.0;
            }
            h = h / 6.0;
        }
        return vec3( h, s, l );
    }
        
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
        
    vec3 hsv2rgb(vec3 c)
    {
       vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`
});

/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/chunks/gray.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function() {
    return `float gray(vec3 c){
        return dot(c,vec3(0.299, 0.587, 0.114));
    }`;
});

/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/circle.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `
        attribute vec2 position;
        uniform vec2 resolution;
        varying lowp vec2 coord;
        void main(void) {
            vec2 np = position/resolution;
            np.x=np.x*2.0-1.0;
            np.y=1.0-np.y*2.0;
            coord = np;
            gl_Position = vec4(np, 0.0, 1.0);
        }`,
    fragment: `
        varying lowp vec2 coord;
        uniform mediump float r;
        void main(void) {
            lowp float inten = sqrt(coord.x*coord.x+coord.y*coord.y);
            lowp vec3 color = vec3(distance(coord,vec2(0.0,0.0))<r?1.0:0.0);
            gl_FragColor = vec4(color,1.0);
        }`
});

/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/convolution.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `#version 300 es

        precision mediump float;
        in vec2 position;
        uniform vec2 resolution;
        void main(void) {
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `,
    fragment: `#version 300 es
        precision mediump float;

        uniform sampler2D tex;
        uniform vec2 resolution;
        uniform float matrix[9];

        void getDataMatrix(sampler2D t, vec2 c, out vec3 arr[9]){
            int i=0;
            for(int x=-1;x<=1;x++)
                for(int y=-1;y<=1;y++){
                    vec2 offset = vec2(x,y)/resolution;
                    arr[i] = texture(t,c+offset).rgb;
                    i=i+1;
            }
        }

        out vec4 FragColor;

        void main(void) {
            vec2 texcoord = gl_FragCoord.xy/resolution;
            vec3 arr[9];
            getDataMatrix(tex, texcoord, arr);
            vec3 color = vec3(0.0);
            for(int i=0;i<9;i++)
             color = color + arr[i]*matrix[i];

            FragColor = vec4(color, 1.0);
        }`
});


/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/image.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `
        attribute vec2 position;
        attribute vec2 uv;
        uniform vec2 resolution;
        varying mediump vec2 texcoord;
        void main(void) {
            vec2 np = position/resolution;
            np.x=np.x*2.0-1.0;
            np.y=1.0-np.y*2.0;
            texcoord = uv;
            gl_Position = vec4(np, 0.0, 1.0);
        }`,
    fragment: `
        varying mediump vec2 texcoord;
        uniform sampler2D texture;
        void main(void) {
            gl_FragColor = vec4(texture2D(texture, texcoord).rgb,1.0);
        }`
});


/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/noise.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `
        attribute vec2 position;
        varying lowp vec2 pos;
        void main(void) {
            pos = position;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `,
    fragment: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        uniform vec2 resolution;
        varying lowp vec2 pos;
        uniform lowp float seed;

        vec4 mod289(vec4 x)
        {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 permute(vec4 x)
        {
          return mod289(((x*34.0)+2.0)*x);
        }
        
        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        
        vec2 fade(vec2 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }
        
        // Classic Perlin noise
        float cnoise(vec2 P)
        {
          vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
          vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
          Pi = mod289(Pi); // To avoid truncation effects in permutation
          vec4 ix = Pi.xzxz;
          vec4 iy = Pi.yyww;
          vec4 fx = Pf.xzxz;
          vec4 fy = Pf.yyww;
        
          vec4 i = permute(permute(ix) + iy);
        
          vec4 gx = fract((seed/4.0+0.4)*i * (1.0 / 41.0)) * 2.0 - 1.0 ;
          vec4 gy = abs(gx) - 0.5 ;
          vec4 tx = floor(gx + 0.5);
          gx = gx - tx;
        
          vec2 g00 = vec2(gx.x,gy.x);
          vec2 g10 = vec2(gx.y,gy.y);
          vec2 g01 = vec2(gx.z,gy.z);
          vec2 g11 = vec2(gx.w,gy.w);
        
          vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
          g00 *= norm.x;
          g01 *= norm.y;
          g10 *= norm.z;
          g11 *= norm.w;
        
          float n00 = dot(g00, vec2(fx.x, fy.x));
          float n10 = dot(g10, vec2(fx.y, fy.y));
          float n01 = dot(g01, vec2(fx.z, fy.z));
          float n11 = dot(g11, vec2(fx.w, fy.w));
        
          vec2 fade_xy = fade(Pf.xy);
          vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
          float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
          return 2.3 * n_xy;
        }
        
        void main(void){
            float noise = cnoise(pos*10.0);
            gl_FragColor = vec4(noise,noise,noise,1.0);
        }
    `
});


/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/normal.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `
        attribute vec2 position;
        varying mediump vec2 texcoord;
        void main(void) {
            texcoord = (position+1.0)/2.0;
            gl_Position = vec4(position, 0.0, 1.0);
        }`,
    fragment:`
        uniform lowp vec2 resolution;
        varying mediump vec2 texcoord;
        uniform sampler2D texture;
        uniform mediump float scale;

        lowp float grey(vec3 color){
            return dot(color.rgb, vec3(0.299, 0.587, 0.114));
        }

        void main(void) {
            lowp float PIXEL_WIDTH = 1.0/resolution.x;
            lowp float PIXEL_HEIGHT = 1.0/resolution.y;
            lowp float c = grey(texture2D(texture, texcoord).rgb);
            lowp float cx = grey(texture2D(texture, texcoord+vec2(PIXEL_WIDTH, 0.0)).rgb);
            lowp float cy = grey(texture2D(texture, texcoord+vec2(0.0, PIXEL_HEIGHT)).rgb);


            lowp float dx = (c - cx) * scale;
            lowp float dy = (c - cy) * scale;
            lowp float nz = 1.0;
            lowp float len = sqrt(dx * dx + dy * dy + nz * nz);

            lowp float nx = dx / len;
            lowp float ny = -dy / len;
            nz = nz / len;

            lowp vec3 r = (vec3(nx, ny, nz)+1.0)/2.0;


            gl_FragColor = vec4(r,1.0);
            
        }`
});


/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/radial-gradient.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `
        attribute vec2 position;
        uniform vec2 resolution;
        varying lowp vec2 coord;
        void main(void) {
            vec2 np = position/resolution;
            np.x=np.x*2.0-1.0;
            np.y=1.0-np.y*2.0;
            coord = np;
            gl_Position = vec4(np, 0.0, 1.0);
        }`,
    fragment: `
        varying lowp vec2 coord;
        uniform mediump vec3 color1;
        uniform mediump vec3 color2;
        void main(void) {
            lowp float inten = sqrt(coord.x*coord.x+coord.y*coord.y);
            mediump vec3 color = color1 * inten + color2 * (1.0 - inten);
            gl_FragColor = vec4(color,1.0);
        }`
});


/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/precompiled/simple.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    vertex: `
        attribute vec2 position;
        uniform vec2 resolution;
        void main(void) {
            vec2 np = position/resolution;
            np.x=np.x*2.0-1.0;
            np.y=1.0-np.y*2.0;
            gl_Position = vec4(np, 0.0, 1.0);
        }`,

    fragment: `
        uniform mediump vec4 color;
        void main(void) {
            gl_FragColor = color;
        }`
});


/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/runtime/blend.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chunks_color_models__ = __webpack_require__("./node_modules/texturity.js/src/shaders/chunks/color-models.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chunks_gray__ = __webpack_require__("./node_modules/texturity.js/src/shaders/chunks/gray.js");



/* harmony default export */ __webpack_exports__["a"] = (function (b, expression, preExpressions = '') {
    return {
        vertex: `
        attribute vec2 position;
        varying mediump vec2 texcoord;
        void main(void) {
            texcoord = (position+1.0)/2.0;
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `,
        fragment: `
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying mediump vec2 texcoord;
        uniform sampler2D texture1;
        ${b instanceof WebGLTexture ?
        'uniform sampler2D texture2'
        : (b instanceof Array ?
            'uniform mediump vec3 color'
            : 'uniform mediump float value')};
        
        ${Object(__WEBPACK_IMPORTED_MODULE_0__chunks_color_models__["a" /* default */])()}
        ${Object(__WEBPACK_IMPORTED_MODULE_1__chunks_gray__["a" /* default */])()}

        void main(void) {
            vec3 a = texture2D(texture1, texcoord).rgb;
            vec3 b = ${b instanceof WebGLTexture ?
        'texture2D(texture2, texcoord).rgb'
        : (b instanceof Array ?
            'color'
            : 'vec3(value)')};
            ${preExpressions}
            gl_FragColor = vec4(${expression}, 1.0);
        }`
    }
});

/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/runtime/fourier.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__chunks_gray__ = __webpack_require__("./node_modules/texturity.js/src/shaders/chunks/gray.js");


/* harmony default export */ __webpack_exports__["a"] = (function (w, h, inverse) {
    
    var assign = `
    float gray = texture2D(texture, (coord+offset)/screen).r;

    real += gray * cos(-angle); 
    imag += gray * sin(-angle);
    `;
    var fragColor = `
    gl_FragColor = vec4(real,imag,magnitude(real,imag),1.0);
    `;

    var inverseAssign = `vec2 source = texture2D(texture, (coord+offset)/screen).rg;
    real += source.r * cos(angle) - source.g * sin(angle);
    imag += source.r * sin(angle) + source.g * cos(angle);`;
    var inverseFragColor = `
    real = real / screen.x / screen.y;
    gl_FragColor = vec4(vec3(real),1.0);`;

    return {
        vertex: `
        precision highp float;

        attribute vec2 position;
        uniform vec2 resolution;
        void main(void) {
            vec2 np = position/resolution;
            np.x=np.x*2.0-1.0;
            np.y=1.0-np.y*2.0;
            gl_Position = vec4(np, 0.0, 1.0);
        }`,
        fragment: `
        precision highp float;

        const int W = ${w};
        const int H = ${h};
        const float M_PI = 3.1415926535897932384626433832795;
        const vec2 screen = vec2(${w},${h});

        uniform sampler2D texture;
        uniform vec2 resolution;

        float magnitude(float real, float imag){
            return sqrt(real*real+imag*imag);
        }

        float phase(float real, float imag){
            return atan(real*real+imag*imag);
        }

        ${Object(__WEBPACK_IMPORTED_MODULE_0__chunks_gray__["a" /* default */])()}
        
        void main(void) {
            float real = 0.0;
            float imag = 0.0;
            vec2 offset = vec2(0.5,0.5);
            float x = gl_FragCoord.x-offset.x;
            float y = gl_FragCoord.y-offset.y;

            for(int j = 0; j < H; j++)
                for(int i = 0; i < W; i++){
                    vec2 coord = vec2(float(i),float(j));
                    float angle = 2.0*M_PI*(x*coord.x/screen.x+y*coord.y/screen.y);
                    ${inverse ? inverseAssign : assign}
                }
                ${inverse ? inverseFragColor : fragColor}
            }`
    }
});

/***/ }),

/***/ "./node_modules/texturity.js/src/shaders/runtime/neighbors.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function(expression) {
    return {
        vertex: `#version 300 es

        precision mediump float;
        in vec2 position;
        uniform vec2 resolution;
        void main(void) {
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `,
        fragment: `#version 300 es
        precision mediump float;

        uniform sampler2D tex;
        uniform vec2 resolution;
        uniform float matrix[9];

        void getDataMatrix(sampler2D t, vec2 c, out vec3 arr[9]){
            int i=0;
            for(int x=-1;x<=1;x++)
                for(int y=-1;y<=1;y++){
                    vec2 offset = vec2(x,y)/resolution;
                    arr[i] = texture(t,c+offset).rgb;
                    i=i+1;
            }
        }

        out vec4 FragColor;

        void main(void) {
            vec2 texcoord = gl_FragCoord.xy/resolution;
            vec3 arr[9];
            getDataMatrix(tex, texcoord, arr);
            
            vec3 color = vec3(0.0);
            ${expression};
            FragColor = vec4(color, 1.0);
        }`
    }
});


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/texturity.js/src/index.js");


/***/ })

},[2]);
//# sourceMappingURL=texturity.js.map