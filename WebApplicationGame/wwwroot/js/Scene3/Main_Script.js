var lightLocation = [0.0, 2.0, 0.0];
const AmbientLightColor = [0.2, 0.2, 0.2];
const DiffuseLightColor = [0.5, 0.5, 0.5];
const SpecularLightColor = [0.8, 0.8, 0.8];
const house1Points = [[-4, -7], [6, 7]];
const house2Points = [[-6, 7], [4, -7]];
//var scorpionPoints = [[-2, 10], [7, 10]];
var scorpionPoints = [[-4, -7], [6, 7]];
var [xhorse, zhorse] = [-17.0, 17.0];
var [xspongebob, xpatrick] = [-7, 7];
const mainZkoef = 4;
var a2 = 0.0;
var f3 = false;
var f4 = false;

var mLeft = false;
var mRight = false;
var mUp = false;
var mDown = false;

var rLeft = false;
var rRight = false;

var jump = false;
var hero_fall = false;

var f = false;
var f2 = false;
var lift = false;
var lift_ups = false;

var eps = 0.00001;

var spongebob = false;
var patrick = false;

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
    y_location = 0;
    y_lift = 0;
    angle = 0;

    const gl = document.getElementById('glcanvas').getContext('webgl2');
    const program = initShaderProgram(gl, vsSource, fsSource);
    var imgs = [];
    var objs = [];
    ["chess", "rabbit", "house1", "house2", "ufo", "horse", "floor", "lift", "spongebob", "patrick"].forEach((name) =>
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

    for (var i = 0; i < objs.length; i++) {
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
    draw_elem(objs[6], gl, program, 0, 46, 15, 1, first, 6, true, false);
    draw_elem(objs[7], gl, program, 0, 23, y_lift, 0.15, first, 7, true, false);

    draw_elem(objs[2], gl, program, house1Points[0][0], house1Points[0][1], 0, 1.5, first, 2, true, false);
    draw_elem(objs[2], gl, program, house1Points[1][0], house1Points[1][1], 0, 1.5, false, 2, false, false);

    draw_elem(objs[3], gl, program, house2Points[0][0], house2Points[0][1], 0, 1.5, first, 3, true, false);
    draw_elem(objs[3], gl, program, house2Points[1][0], house2Points[1][1], 0, 1.5, false, 3, false, false);

    draw_elem(objs[4], gl, program, scorpionPoints[0][0], scorpionPoints[0][1], 0, 0, first, 4, true, false);
    draw_elem(objs[4], gl, program, scorpionPoints[1][0], scorpionPoints[1][1], 0, 0, false, 4, false, false);

    draw_elem(objs[1], gl, program, x_location, mainZkoef + z_location, y_location + 0.63, 0.5, first, 1, true, true);

    draw_elem(objs[5], gl, program, xhorse, zhorse, 1.1, 1, first, 5, true, false);

    draw_elem(objs[8], gl, program, xspongebob, 46, 16, 1, first, 8, true, false);

    draw_elem(objs[9], gl, program, xpatrick, 46, 16, 1, first, 9, true, false);

    requestAnimationFrame(function () {
        document.getElementById("coord").textContent = "x = " + x_location.toFixed(4) + "; z = " + z_location.toFixed(4) + "; y = " + y_location.toFixed(4) + ";";
        render(objs, gl, program, false);

        [xhorse, zhorse] = horseMoving(xhorse, zhorse);
        if (nearHorse()) {
            if (xhorse < 18.0 && zhorse == 17.0) {
                x_location += 2.5;
            }
            else if (xhorse >= 18.0 && zhorse > -18.0) {
                z_location -= 2.5;
            }
            else if (xhorse >= -17.0 && zhorse <= -18.0) {
                x_location -= 2.5;
            }
            else if (xhorse < -17.0 && zhorse <= 17.0) {
                z_location += 2.5;
            }
            doIfOutOfGround();
        }

        if (nearSp()) {
            if (!spongebob)
                x_location += 0.5;
            else
                x_location -= 0.5;
        }

        if (nearPt()) {
            if (!patrick)
                x_location -= 0.5;
            else
                x_location += 0.5;
        }
        

        [xspongebob, xpatrick] = heroesMoving(xspongebob, xpatrick);

        f = x_location < -20.0 || x_location > 20.4 || (Math.abs(-z_location - 4) > 20.2 && !(y_location >= 15 && z_location >= 22 && z_location <= 62));
        lift = Math.abs(x_location) < 3.1 && z_location > 16 && z_location < 22 && (Math.abs(y_lift * 0.15 - y_location) < eps || jump && Math.abs(y_lift * 0.15 - y_location) < 1 + eps);
        if (hero_fall && (!f || lift) && y_location == 0)
            hero_fall = false;

        if (y_lift < 100 && lift_ups) {
            y_lift += 1;
            if (y_lift > 100)
                y_lift = 100;
            if (lift) {
                y_location += 1 * 0.15;
                if (y_location > 15)
                    y_location = 15;
            }
        }
        if (y_lift > 0 && !lift_ups) {
            y_lift -= 1;
            if (y_lift < 0)
                y_lift = 0;
            if (lift) {
                y_location -= 1 * 0.15;
                if (y_location < 0)
                    y_location = 0;
            }
        }
    });
}

function horseMoving(x, z) {
    if (x < 18.0 && z == 17.0)
        x += 0.05;
    else if (x >= 18.0 && z > -18.0)
        z -= 0.05;
    else if (x >= -17.0 && z <= -18.0)
        x -= 0.05;
    else if (x < -17.0 && z <= 17.0)
        z += 0.05;
    else {
        x = -17.0;
        z = 17.0;
    }
    return [x, z];
}



function heroesMoving(xs, xp) {
    if (xs < -1.0 && !spongebob)
        xs += 0.05;
    if (Math.abs(xs - -1.0) < eps) {
        xs = -1.0;
        spongebob = true;
    }
    if (xs > -7.0 && spongebob)
        xs -= 0.05;
    if (Math.abs(xs - -7.0) < eps) {
        xs = -7.0;
        spongebob = false;
    }

    if (xp > 1.0 && !patrick)
        xp -= 0.05;
    if (Math.abs(xp - 1.0) < eps) {
        xp = 1.0;
        patrick = true;
    }
    if (xp < 7.0 && patrick)
        xp += 0.05;
    if (Math.abs(xp - 7.0) < eps) {
        xp = 7.0;
        patrick = false;
    }
    
    return [xs, xp];
}

function doIfOutOfGround() {
    var flag = x_location < -20.0 || x_location > 20.4 || (Math.abs(-z_location - 4) > 20.2 && !(y_location >= 15 && z_location >= 22 && z_location <= 62)) || (!(Math.abs(-z_location - 4) > 20.2) && y_location > 0 && y_location != 1);
    lift = Math.abs(x_location) < 3.1 && z_location > 16 && z_location < 22 && (Math.abs(y_lift * 0.15 - y_location) < eps || jump && Math.abs(y_lift * 0.15 - y_location) < 1 + eps);
    if (flag && !lift)
    {
        hero_fall = true;
        y_location = Math.floor(y_location);
        var k = 1;
        var s = y_location;
        for (var i = s; i > 0; i--) {
            (function (k) {
                setTimeout(function () {
                    if(!jump)
                        y_location--;
                }, k * 500);
            })(k);
            k++;
        }

        var b = false;
        for (var i = 0; i > -5; i--) {
            (function (k) {
                setTimeout(function () {
                    var ff = x_location < -20.0 || x_location > 20.4 || Math.abs(-z_location - 4) > 20.2;
                    var ll = Math.abs(x_location) < 3.1 && z_location > 16 && z_location < 22 && Math.abs(y_lift * 0.15 - y_location) < eps;
                    if (ff && !ll || b) {
                        b = true;
                        y_location -= 1;
                    }
                }, k * 500);
            })(k);
            k++;
        }

        setTimeout(function () {
            
            if (y_location <= -5) {
                x_location = 0;
                z_location = 0;
                y_location = 0;
            }
        }, k * 500);
    }
}

function nearHorse() {
    if (Math.abs(xhorse - x_location) < 1.2 && Math.abs(zhorse - z_location - mainZkoef) < 2 && y_location < 2)
        return true;
    return false;
}

function nearSp() {
    if (Math.abs(xspongebob - x_location) < 1 && Math.abs(46 - z_location - mainZkoef) < 1.5 && y_location >= 15)
        return true;
    return false;
}

function nearPt() {
    if (Math.abs(xpatrick - x_location) < 1 && Math.abs(46 - z_location - mainZkoef) < 1.5 && y_location >= 15)
        return true;
    return false;
}

window.addEventListener("keydown", function (e) {
    if (e.code == "ArrowRight") {
        mRight = true;
        if (!mLeft) {
            x_location += 0.1 * Math.cos(angle);
            z_location -= 0.1 * Math.sin(angle);
            if (nearObjPoints()) {
                x_location -= 0.1 * Math.cos(angle);
                z_location += 0.1 * Math.sin(angle);

            }

            if (!hero_fall)
                doIfOutOfGround();
        }
    }
    if (e.code == "ArrowLeft") {
        mLeft = true;
        if (!mRight) {
            x_location -= 0.1 * Math.cos(angle);
            z_location += 0.1 * Math.sin(angle);
            if (nearObjPoints()) {
                x_location += 0.1 * Math.cos(angle);
                z_location -= 0.1 * Math.sin(angle);

            }
            
            if (!hero_fall)
                doIfOutOfGround();
        }
    }
    if (e.code == "ArrowUp") {
        mUp = true;
        if (!mDown) {
            x_location += 0.1 * Math.sin(Math.PI - angle);
            z_location -= 0.1 * Math.cos(Math.PI - angle);
            if (nearObjPoints()) {
                x_location -= 0.1 * Math.sin(Math.PI - angle);
                z_location += 0.1 * Math.cos(Math.PI - angle);

            }
            
            if (!hero_fall)
                doIfOutOfGround();
        }
    }
    if (e.code == "ArrowDown") {
        mDown = true;
        if (!mUp) {
            x_location -= 0.1 * Math.sin(Math.PI - angle);
            z_location += 0.1 * Math.cos(Math.PI - angle);
            if (nearObjPoints()) {
                x_location += 0.1 * Math.sin(Math.PI - angle);
                z_location -= 0.1 * Math.cos(Math.PI - angle);

            }
            
            if (!hero_fall)
                doIfOutOfGround();
        }
    } 
    if (e.key == "1") {
        rLeft = true;
        if (!rRight)
          angle = (angle + 0.1) % (2 * Math.PI);
    }
    if (e.key == "2") {
        rRight = true;
        if (!rLeft)
          angle = (angle - 0.1) % (2 * Math.PI);
    }
    if (e.key == "3") {
        a2 = (a2 + 0.1) % (2 * Math.PI);
    }
    if (e.key == "4") {
        a2 = (a2 - 0.1) % (2 * Math.PI);
    }

    if (e.key == " ") {
        var flag = x_location < -20.0 || x_location > 20.4 || (Math.abs(-z_location - 4) > 20.2 && !(y_location == 15 && z_location >= 22 && z_location <= 62));
        if (!jump && (lift && (y_lift == 0 || y_lift == 100) || !flag)) {
            jump = true;
            y_location += 1;
            setTimeout(function () {
                y_location -= 1;
                jump = false;
            }, 1500);
        }
    }

    if (e.key == "q") {
        if(!jump)
            lift_ups = true;
    }

    if (e.key == "e") {
        if (!jump)
            lift_ups = false;
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "1", "2", "3", "4", " ", "q", "e"].indexOf(e.code) > -1)
        e.preventDefault();
}, false);


window.addEventListener("keyup", function (e) {
    if (e.code == "ArrowRight") {
        mRight = false;
    }
    if (e.code == "ArrowLeft") {
        mLeft = false;
    }
    if (e.code == "ArrowUp") {
        mUp = false;
    }
    if (e.code == "ArrowDown") {
        mDown = false;
    }
    if (e.key == "1") {
        rLeft = false;
    }
    if (e.key == "2") {
        rRight = false;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "1", "2"].indexOf(e.code) > -1)
        e.preventDefault();
}, false);

/*function beep() { 
    var ctx = new AudioContext();
    var oscillator = ctx.createOscillator();
    // частота в герцах
    oscillator.frequency.value = 600;
    oscillator.connect(ctx.destination);
    oscillator.start();
    // длительность в секундах
    oscillator.stop(0.15);
}*/

function nearObjPoints() {
    for (let i = 0; i < house1Points.length; i++) {
        if (Math.abs(house1Points[i][0] - x_location) < 2 && Math.abs(house1Points[i][1] - z_location - mainZkoef) < 2.2)
            return true;
    }
    for (let i = 0; i < house2Points.length; i++) {
        if (Math.abs(house2Points[i][0] - x_location) < 2 && Math.abs(house2Points[i][1] - z_location - mainZkoef) < 2.2)
            return true;
    }
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

    if (x >= 18.0 && z > -18.0 && !isMain) {
        mat4.translate(mvMatrix, mvMatrix, [-x, 0, z]);
        mat4.rotateY(mvMatrix, mvMatrix, -Math.PI / 2.0);
        mat4.translate(mvMatrix, mvMatrix, [x, 0, -z]);
    }
    else if (x >= -17.0 && z <= -18.0 && !isMain) {
        mat4.translate(mvMatrix, mvMatrix, [-x, 0, z]);
        mat4.rotateY(mvMatrix, mvMatrix, -Math.PI);
        mat4.translate(mvMatrix, mvMatrix, [x, 0, -z]);
    }
    else if (x < -17.0 && z <= 17.0 && !isMain) {
        mat4.translate(mvMatrix, mvMatrix, [-x, 0, z]);
        mat4.rotateY(mvMatrix, mvMatrix, -3 * Math.PI / 2.0);
        mat4.translate(mvMatrix, mvMatrix, [x, 0, -z]);
    }

    if (x == xspongebob && y == 16 && !isMain && spongebob) {
        mat4.translate(mvMatrix, mvMatrix, [-x, -y, z]);
        mat4.rotateY(mvMatrix, mvMatrix, -Math.PI);
        mat4.translate(mvMatrix, mvMatrix, [x, y, -z]);
    }
    if (x == xpatrick && y == 16 && !isMain && patrick) {
        mat4.translate(mvMatrix, mvMatrix, [-x, -y, z]);
        mat4.rotateY(mvMatrix, mvMatrix, -Math.PI);
        mat4.translate(mvMatrix, mvMatrix, [x, y, -z]);
    }


    if (y == y_location + 0.63)
        mat4.translate(mvMatrix, mvMatrix, [-(1 / k) * x, -(1.25 / k) + (1 / k) * y, (1 / k) * z]);
    else
        mat4.translate(mvMatrix, mvMatrix, [-(1 / k) * x, -(1.25 / k) + y, (1 / k) * z]);

    mat4.lookAt(vMatrix = mat4.create(), [- x_location, y_location, z_location], [- x_location, y_location, 1000], [0, 1, 0]);

    if (isMain) {
        mat4.translate(mvMatrix, mvMatrix, [0, 0, 0.2]);
        mat4.rotateY(mvMatrix, mvMatrix, -angle);
        mat4.translate(mvMatrix, mvMatrix, [0, 0, -0.2]);
    }

    mat3.normalFromMat4(nMatrix = mat3.create(), mvMatrix);
    mat4.perspective(pMatrix = mat4.create(), 45 * Math.PI / 180, gl.canvas.height / gl.canvas.width, 0.01, 100.0);
    
    mat4.rotateY(pMatrix, pMatrix, a2);


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









   

