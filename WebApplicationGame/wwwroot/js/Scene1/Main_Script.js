const lightLocation = [15.0, 6.0, 15.0];
var xfish;

window.onload = function () {
    x_location = 0;
    z_location = 0;
    xfish = 0;

    const gl = document.getElementById('glcanvas').getContext('webgl2');
    const program = initShaderProgram(gl, vsSource, fsSource);
    var imgs = [];
    var objs = [];
    ["Field", "octopus", "teasure", "scorpion", "fish"].forEach((name) =>
    {
        imgs.push(document.getElementById("textures_" + name));
        objs.push(parseOBJ(name));
    });

    vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    vertexTextureAttribute = gl.getAttribLocation(program, "aTextureCoord");
    gl.enableVertexAttribArray(vertexTextureAttribute);
    gl.useProgram(program);
    const texture1UniformLocation = gl.getUniformLocation(program, "texture");
    gl.uniform1i(texture1UniformLocation, 0);
    squareVerticesBuffer = [];
    textureBuffer = [];
    indexBuffer = [];
    texture = [];

    render(imgs, objs, gl, program, lightLocation, x_location, z_location, true);
}

function render(imgs, objs, gl, program, first) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw_elem(imgs[0], objs[0], gl, program, 0, 0, 0, 1, first, 0, true);
    draw_elem(imgs[1], objs[1], gl, program, x_location, 4 + z_location, 1, 0.07, first, 1, true);
    draw_elem(imgs[2], objs[2], gl, program, 5, 5, 0, 1, first, 2, true);
    draw_elem(imgs[2], objs[2], gl, program, -5, -3, 0, 1, false, 2, false);
    draw_elem(imgs[2], objs[2], gl, program, -7, 9, 0, 1, false, 2, false);
    draw_elem(imgs[3], objs[3], gl, program, 2, 10, 0, 0.5, first, 3, true);
    draw_elem(imgs[3], objs[3], gl, program, 7, 10, 0, 0.3, false, 3, false);
    draw_elem(imgs[4], objs[4], gl, program, xfish, 15, 1, 2, first, 4, true);
    draw_elem(imgs[4], objs[4], gl, program, xfish - 7, 15, 1, 2, false, 4, false);
    draw_elem(imgs[4], objs[4], gl, program, xfish + 7, 15, 1, 2, false, 4, false);

    requestAnimationFrame(function () {
        render(imgs, objs, gl, program, false);
        xfish-=0.1;
        if (xfish < -27)
            xfish = 27;
    });
}

window.addEventListener("keydown", function (e) {
    if (e.code == "ArrowRight")
        x_location += 0.1;
    if (e.code == "ArrowLeft")
        x_location -= 0.1;
    if (e.code == "ArrowUp")
        z_location += 0.1;
    if (e.code == "ArrowDown")
        z_location -= 0.1;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1)
        e.preventDefault();
}, false);

function draw_elem(img, obj, gl, program, x, z, y, k, first, i, first_in_item) {
    if (first) {
        squareVerticesBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.position.flat()), gl.STATIC_DRAW);

        textureBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.texcoord.flat()), gl.STATIC_DRAW);

        indexBuffer[i] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer[i]);
        let indices = [];
        for (let i = 0; i < obj.position.length; i++) {
            indices.push(i);
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        texture[i] = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, texture[i]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    }
    if (first_in_item) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer[i]);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer[i]);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);
    }

    var mvMatrix = [
        k, 0, 0, 0,
        0, k, 0, 0,
        0, 0, k, 0,
        0, 0, 0, 1];
    mat4.translate(mvMatrix, mvMatrix, [(1 / k) * (x - x_location), -(1.25 / k) + y, (1 / k) * (z_location - z)]);
    var nMatrix = mat3.create();
    mat3.normalFromMat4(nMatrix, mvMatrix);
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45 * Math.PI / 180, gl.canvas.height / gl.canvas.width, 0.01, 100.0);

    const AmbientLightColor = [0.5, 0.5, 0.5, 1.0]
    const DiffuseLightColor = [0.5, 0.5, 0.5, 1.0]
    const SpecularLightColor = [0.5, 0.5, 0.5, 1.0]

    const _AmbientLightColor = gl.getUniformLocation(program, "ambientLightColor");
    gl.uniform4fv(_AmbientLightColor, AmbientLightColor);
    const _DiffuseLightColor = gl.getUniformLocation(program, "diffuseLightColor");
    gl.uniform4fv(_DiffuseLightColor, DiffuseLightColor);
    const _SpecularLightColor = gl.getUniformLocation(program, "specularLightColor");
    gl.uniform4fv(_SpecularLightColor, SpecularLightColor);
    const _uLightPosition = gl.getUniformLocation(program, "lightLocation");
    gl.uniform3fv(_uLightPosition, lightLocation);

    const mvMatUni = gl.getUniformLocation(program, "mvMatrix");
    gl.uniformMatrix4fv(mvMatUni, false, mvMatrix);
    const nMatUni = gl.getUniformLocation(program, "nMatrix");
    gl.uniformMatrix3fv(nMatUni, false, nMatrix);
    const pMatUni = gl.getUniformLocation(program, "pMatrix");
    gl.uniformMatrix4fv(pMatUni, false, pMatrix);

    gl.drawElements(gl.TRIANGLES, obj.position.length - 2, gl.UNSIGNED_SHORT, 0);
}









   

