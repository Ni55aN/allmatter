var Texturity = (function (exports) {
'use strict';

var BrickGenerator = class {
    
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

};

var BlendProgram = function (b, expression) {
    return createShaderProgram(
        `
        attribute vec2 position;
        varying mediump vec2 texcoord;
        void main(void) {
            texcoord = (position+1.0)/2.0;
            gl_Position = vec4(position, 0.0, 1.0);
        }
        `,
        `
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
        
        void main(void) {
            vec3 a = texture2D(texture1, texcoord).rgb;
            vec3 b = ${b instanceof WebGLTexture ?
        'texture2D(texture2, texcoord).rgb'
        : (b instanceof Array ?
            'color'
            : 'vec3(value)')};
            gl_FragColor = vec4(${expression}, 1.0);
        }`
    );
};

var TransformGenerator = class {
    
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

};

var BlurProgram = function(radius) {
    return createShaderProgram(
        `
        attribute vec2 position;
        uniform vec2 resolution;
        varying mediump vec2 texcoord;
        void main(void) {
            texcoord = (position+1.0)/2.0;
            gl_Position = vec4(position, 0.0, 1.0);
        }`,
        `#ifdef GL_ES
        precision highp float;
        #endif
        
        uniform vec2 resolution;
        varying mediump vec2 texcoord;
        uniform sampler2D texture;
        #define weight ${radius}

        void main(void) {
            vec4 sum = vec4(0.0);
            
            /// TODO 
            vec2 tc = texcoord;
            float blur = float(weight)/resolution.x; 
            
            float hstep = 1.0;
            float vstep = 1.0;
            
            sum += texture2D(texture, vec2(tc.x - 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;
            sum += texture2D(texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
            sum += texture2D(texture, vec2(tc.x - 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
            sum += texture2D(texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;
            
            sum += texture2D(texture, vec2(tc.x, tc.y)) * 0.2270270270;
            
            sum += texture2D(texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
            sum += texture2D(texture, vec2(tc.x + 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
            sum += texture2D(texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
            sum += texture2D(texture, vec2(tc.x + 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
        
            gl_FragColor =  vec4(sum.rgb, 1.0);
        }`
    )
};

var CircleProgram = function() {
    return createShaderProgram(
        `
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

        `
        varying lowp vec2 coord;
        uniform mediump float r;
        void main(void) {
            lowp float inten = sqrt(coord.x*coord.x+coord.y*coord.y);
            lowp vec3 color = vec3(distance(coord,vec2(0.0,0.0))<r?1.0:0.0);
            gl_FragColor = vec4(color,1.0);
        }`
    )
};

var RadialGradientProgram = function() {
    return createShaderProgram(
        `
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

        `
        varying lowp vec2 coord;
        uniform mediump vec3 color1;
        uniform mediump vec3 color2;
        void main(void) {
            lowp float inten = sqrt(coord.x*coord.x+coord.y*coord.y);
            mediump vec3 color = color1 * inten + color2 * (1.0 - inten);
            gl_FragColor = vec4(color,1.0);
        }`
    )
};

var ImageProgram = function() {
    return createShaderProgram(
        `
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
        `
    varying mediump vec2 texcoord;
    uniform sampler2D texture;
    void main(void) {
        gl_FragColor = vec4(texture2D(texture, texcoord).rgb,1.0);
    }`
    )
};

var NoiseProgram = function() {
    return createShaderProgram(`
    attribute vec2 position;
    varying lowp vec2 pos;
    void main(void) {
        pos = position;
        gl_Position = vec4(position, 0.0, 1.0);
    }
    `,
        `
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
    )
};

var NormalProgram = function() {
    return createShaderProgram(`
    attribute vec2 position;
    varying mediump vec2 texcoord;
    void main(void) {
        texcoord = (position+1.0)/2.0;
        gl_Position = vec4(position, 0.0, 1.0);
    }`,
        `
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
    )
};

var SimpleProgram = function() {
    return createShaderProgram(
        `
        attribute vec2 position;
        uniform vec2 resolution;
        void main(void) {
            vec2 np = position/resolution;
            np.x=np.x*2.0-1.0;
            np.y=1.0-np.y*2.0;
            gl_Position = vec4(np, 0.0, 1.0);
        }`,

        `
        uniform mediump vec4 color;
        void main(void) {
            gl_FragColor = color;
        }`
    )
};

var gl = null;
var element = null;
var programs = null;
var vertexBuffer = null;
var textures = [];
var format = null;

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
        this.drawTexture(this.backup.texture, 0, 0, w, h, true);

        this.backup = null;

        return this;
    }
	
    drawBuffer(vertices) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
        return this;
    }

    transform(texture, tx, ty, repeat) {
        var generator = new TransformGenerator(tx, ty, repeat);

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

        var generator = new BrickGenerator(count, margin);
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

    drawTexture(texture, x, y, w, h) {
        var drawArray = x instanceof Array;

        useProgram(programs.image);
        var uvBuffer = gl.createBuffer();
        var uvs = [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1];

        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
		
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        gl.bindTexture(gl.TEXTURE_2D, texture);
		
        if (drawArray)
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
	
    blur(texture, radius) {
        radius = Math.min(radius, 25);
        var blurProgram = BlurProgram(radius);

        useProgram(blurProgram);

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.uniform1i(gl.getUniformLocation(blurProgram, 'texture'), texture);

        this.drawBuffer([-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1]);

        useProgram(programs.simple);
        return this;
    }

    blend(texture, b, expression) {
        var blendProgram = BlendProgram(b, expression);

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
        gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, element.width, element.height);
       
        textures.push(texture);
        return texture;
    }

    toSrc() {
        return element.toDataURL('image/png');
    }

    async toSrcAsync() {
        return new Promise(resolve => {
            element.toBlob((blob) => {
                resolve(URL.createObjectURL(blob));
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

function disposeTextures() {
    textures.forEach(t => gl.deleteTexture(t));
    textures = [];
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
    
    programs = {
        simple: SimpleProgram(),
        normal: NormalProgram(),
        circle: CircleProgram(),
        image: ImageProgram(),
        noise: NoiseProgram(),
        radialGradient: RadialGradientProgram()
    };
    
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

function createShader(source, type) {
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

function createShaderProgram(vert, frag) {
    var vertShader = createShader(vert, gl.VERTEX_SHADER);
    var fragShader = createShader(frag, gl.FRAGMENT_SHADER);
    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.validateProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(shaderProgram);

        throw 'Could not compile WebGL program. \n\n' + info;
    }
    return shaderProgram;
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

exports.Canvas = Canvas;
exports.disposeTextures = disposeTextures;
exports.getGL = getGL;
exports.initGL = initGL;
exports.createBuffer = createBuffer;
exports.resize = resize;
exports.createShader = createShader;
exports.createShaderProgram = createShaderProgram;
exports.loadTexture = loadTexture;
exports.useProgram = useProgram;

return exports;

}({}));
