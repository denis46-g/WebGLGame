var lightLocation = [0.0, 2.0, 0.0];
const AmbientLightColor = [0.2, 0.2, 0.2];
const DiffuseLightColor = [0.5, 0.5, 0.5];
const SpecularLightColor = [0.8, 0.8, 0.8];
const teasurePoints = [[4, 6], [-5, -6], [-3, 9]];
var scorpionPoints = [[2, 10], [7, 10]];
const mainZkoef = 4;
var a2 = 0.0;

function GetSunCoords() {
    const k0 = document.getElementById("sunX").value
    const k1 = document.getElementById("sunY").value
    const k2 = document.getElementById("sunZ").value
    return [k0, k1, k2];
}
function GetSunCoords2() {
    const k0 = document.getElementById("sunX2").value
    const k1 = document.getElementById("sunY2").value
    const k2 = document.getElementById("sunZ2").value
    return [k0, k1, k2];
}

function GetHren() {
    const k0 = document.getElementById("ambient").value
    const k1 = document.getElementById("atten").value
    const k2 = document.getElementById("attenL").value
    return [k0, k1, k2];
}

window.onload = function () {
    document.getElementById('lightingSpace').checked = true;
    document.getElementById('lightingSpace2').checked = true;
    x_location = 0;
    z_location = 0;
    angle = 0;
    xfish = 0;
    const gl = document.getElementById('glcanvas').getContext('webgl2');
    const program = initShaderProgram(gl, vsSource, fsSource);
    var imgs = [];
    var objs = [];
    ["field2", "tank", "barrel", "ufo", "fly"].forEach((name) =>
    {
        imgs.push(document.getElementById("textures_" + name));
        objs.push(parseOBJ(name));
    });

    gl.enableVertexAttribArray(vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition"));
    gl.enableVertexAttribArray(vertexTextureAttribute = gl.getAttribLocation(program, "aTextureCoord"));
    gl.enableVertexAttribArray(normalAttribute = gl.getAttribLocation(program, "aNormal"));
    gl.useProgram(program);

    squareVerticesBuffer = [];
    textureBuffer = [];
    normalBuffer = [];
    indexBuffer = [];

    for (var i = 0; i < 5; i++) {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i]);
    }
    
    render(objs, gl, program, true);
}

function render(objs, gl, program, first) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    var [x, y, z] = GetSunCoords();
    scorpionPoints[0][0] = -x / 2.0;
    scorpionPoints[0][1] = z / 2.0;

    [x, y, z] = GetSunCoords2();
    scorpionPoints[1][0] = -x / 2.0;
    scorpionPoints[1][1] = z / 2.0;

    draw_elem(objs[0], gl, program, 0, 0, 0, 1, first, 0, true, false);
    draw_elem(objs[2], gl, program, teasurePoints[0][0], teasurePoints[0][1], 0, 1, first, 2, true, false);
    draw_elem(objs[2], gl, program, teasurePoints[1][0], teasurePoints[1][1], 0, 1, false, 2, false, false);
    draw_elem(objs[2], gl, program, teasurePoints[2][0], teasurePoints[2][1], 0, 1, false, 2, false, false);
    draw_elem(objs[3], gl, program, scorpionPoints[0][0], scorpionPoints[0][1], 0, 0.5, first, 3, true, false);
    draw_elem(objs[3], gl, program, scorpionPoints[1][0], scorpionPoints[1][1], 0, 0.3, false, 3, false, false);
    draw_elem(objs[1], gl, program, x_location, mainZkoef + z_location, 0.12, 0.5, first, 1, true, true);
    draw_elem(objs[4], gl, program, xfish, 15, 4, 1.1, first, 4, true, false);
    draw_elem(objs[4], gl, program, xfish - 7, 15, 4, 1.1, false, 4, false, false);
    draw_elem(objs[4], gl, program, xfish + 7, 15, 4, 1.1, false, 4, false, false);

    requestAnimationFrame(function () {
        document.getElementById("coord").textContent = "x = " + x_location.toFixed(4) + "; z = " + (-z_location - 4).toFixed(4) + ";";
        render(objs, gl, program, false);
        xfish+=0.1;
        if (xfish > 27)
            xfish = -27;
    });
}

window.addEventListener("keydown", function (e) {
    if (e.code == "ArrowRight") {
        x_location += 0.1 * Math.cos(angle);
        z_location -= 0.1 * Math.sin(angle);
        if (nearObjPoints()) {
            x_location -= 0.1 * Math.cos(angle);
            z_location += 0.1 * Math.sin(angle);
            beep();
        }
    }
    if (e.code == "ArrowLeft") {
        x_location -= 0.1 * Math.cos(angle);
        z_location += 0.1 * Math.sin(angle);
        if (nearObjPoints()) {
            x_location += 0.1 * Math.cos(angle);
            z_location -= 0.1 * Math.sin(angle);
            beep();
        }
    }
    if (e.code == "ArrowUp") {
        x_location += 0.1 * Math.sin(Math.PI - angle);
        z_location -= 0.1 * Math.cos(Math.PI - angle);
        if (nearObjPoints()) {
            x_location -= 0.1 * Math.sin(Math.PI - angle);
            z_location += 0.1 * Math.cos(Math.PI - angle);
            beep();
        }
    }
    if (e.code == "ArrowDown") {
        x_location -= 0.1 * Math.sin(Math.PI - angle);
        z_location += 0.1 * Math.cos(Math.PI - angle);
        if (nearObjPoints()) {
            x_location += 0.1 * Math.sin(Math.PI - angle);
            z_location -= 0.1 * Math.cos(Math.PI - angle);
            beep();
        }
    } 
    if (e.key == " ") {
        angle = (angle + 0.1) % (2 * Math.PI);
    }
    if (e.key == "1") {
        a2 = (a2 + 0.1) % (2 * Math.PI);
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "1"].indexOf(e.code) > -1)
        e.preventDefault();
}, false);

function beep() { 
    var ctx = new AudioContext();
    var oscillator = ctx.createOscillator();
    // частота в герцах
    oscillator.frequency.value = 600;
    oscillator.connect(ctx.destination);
    oscillator.start();
    // длительность в секундах
    oscillator.stop(0.15);
}

function nearObjPoints() {
    for (let i = 0; i < teasurePoints.length; i++) {
        if (Math.abs(teasurePoints[i][0] - x_location) < 0.6 && Math.abs(teasurePoints[i][1] - z_location - mainZkoef) < 1)
            return true;
    }
    if (Math.abs(scorpionPoints[0][0] - x_location) < 1.35 && Math.abs(scorpionPoints[0][1] - z_location - mainZkoef) < 1.6)
        return true;
    if (Math.abs(scorpionPoints[1][0] - x_location) < 1 && Math.abs(scorpionPoints[1][1] - z_location - mainZkoef) < 1.1)
        return true;
}

function draw_elem(obj, gl, program, x, z, y, k, first, i, first_in_item, isMain) {
    if (first) {
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer[i] = gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.position.flat()), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer[i] = gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.normal.flat()), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer[i] = gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.texcoord.flat()), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer[i] = gl.createBuffer());
        let indices = [];
        for (let i = 0; i < obj.position.length; i++) {
            indices.push(i);
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
    if (first_in_item) {
        gl.uniform1i(gl.getUniformLocation(program, "texture"), i);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer[i]);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer[i]);
        gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer[i]);
        gl.vertexAttribPointer(vertexTextureAttribute, 2, gl.FLOAT, false, 0, 0);
    }

    var mvMatrix = [
        k, 0, 0, 0,
        0, k, 0, 0,
        0, 0, k, 0,
        0, 0, 0, 1];


    mat4.translate(mvMatrix, mvMatrix, [-(1 / k) * x, -(1.25 / k) + y, (1 / k) * z]);

    

    mat4.lookAt(vMatrix = mat4.create(), [- x_location, 0, z_location], [- x_location, 0, 1000], [0, 1, 0]);

    if (isMain) {
        mat4.translate(mvMatrix, mvMatrix, [0, 0, 0.2]);
        mat4.rotateY(mvMatrix, mvMatrix, -angle);
        mat4.translate(mvMatrix, mvMatrix, [0, 0, -0.2]);

        //mat4.translate(vMatrix, vMatrix, [-x_location, -0.12, -mainZkoef - z_location]);
        //mat4.rotateY(vMatrix, vMatrix, angle);
        //mat4.translate(vMatrix, vMatrix, [x_location, 0.12, mainZkoef + z_location]);
    }

    mat3.normalFromMat4(nMatrix = mat3.create(), mvMatrix);
    mat4.perspective(pMatrix = mat4.create(), 45 * Math.PI / 180, gl.canvas.height / gl.canvas.width, 0.01, 100.0);

    //var off = [x_location, 0.12, mainZkoef + z_location];

    //mat4.translate(pMatrix, pMatrix, [-x_location, -0.12, -mainZkoef - z_location]);
    
    mat4.rotateY(pMatrix, pMatrix, a2);
    //mat4.translate(pMatrix, pMatrix, [-x, -y, z]);
    //mat4.translate(pMatrix, pMatrix, [x_location, 0.12, mainZkoef + z_location]);


    gl.uniform3fv(gl.getUniformLocation(program, "ambientLightColor"), AmbientLightColor);
    gl.uniform3fv(gl.getUniformLocation(program, "diffuseLightColor"), DiffuseLightColor);
    gl.uniform3fv(gl.getUniformLocation(program, "specularLightColor"), SpecularLightColor);

    var Invmat = mat4.create();
    mat4.invert(Invmat, mvMatrix);

    gl.uniform3fv(gl.getUniformLocation(program, "lightLocation"), GetSunCoords());
    gl.uniform1i(gl.getUniformLocation(program, "lightingSpace"), document.getElementById('lightingSpace').checked);

    gl.uniform3fv(gl.getUniformLocation(program, "lightLocation2"), GetSunCoords2());
    gl.uniform1i(gl.getUniformLocation(program, "lightingSpace2"), document.getElementById('lightingSpace2').checked);

    var [amb, att, attL] = GetHren();
    gl.uniform1f(gl.getUniformLocation(program, "amb"), amb);

    gl.uniform1f(gl.getUniformLocation(program, "att"), att);

    gl.uniform1f(gl.getUniformLocation(program, "attL"), attL);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "mvMatrix"), false, mvMatrix);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "mvMatrix2"), false, Invmat);

    gl.uniformMatrix3fv(gl.getUniformLocation(program, "nMatrix"), false, nMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "pMatrix"), false, pMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "vMatrix"), false, vMatrix);

    gl.drawElements(gl.TRIANGLES, obj.position.length - 2, gl.UNSIGNED_SHORT, 0);
}









   

