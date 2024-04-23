window.onload = function () {
    gl = document.getElementById('glcanvas').getContext('webgl2');
    shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    loadImgsAndBuffers(["Field", "Rock", "Stone", "teasure", "buddha_head", "octopus"]);
    render();
}

function loadImgsAndBuffers(names) {
    imgs = [];
    objs = [];
    verticesBuffers = [];
    textureBuffers = [];
    indexBuffers = [];

    for (var i = 0; i < names.length; i++) {
        imgs[i] = document.getElementById(names[i]);
        objs[i] = parseOBJ(names[i]);

        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffers[i] = gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objs[i].position.flat()), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffers[i] = gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objs[i].texcoord.flat()), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffers[i] = gl.createBuffer());
        let indices = [];
        for (let j = 0; j < objs[i].position.length; j++)
            indices.push(j);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
}

function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);



    requestAnimationFrame(render);
}








   

