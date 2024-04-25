function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const textureAttributeLocation = gl.getAttribLocation(shaderProgram, 'aTextureCoord');

    var pMatrix = mat4.create();
    mat4.perspective(pMatrix, 45 * Math.PI / 180, gl.canvas.height / gl.canvas.width, 0.01, 100.0);
    var vMatrix = mat4.create();
    mat4.lookAt(vMatrix, [x_location, 2, z_location], [0, 0, 0], [0, 1, 0]);

    var mvMatrixs = [];
    var nMatrixs = [];
    //
    mvMatrixs[0] = mat4.create();
    mat4.translate(mvMatrixs[0], mvMatrixs[0], [0, 0, 0]);
    mat4.scale(mvMatrixs[0], mvMatrixs[0], [0.1, 0.1, 0.1]);
    nMatrixs[0] = mat3.create();
    mat3.normalFromMat4(nMatrixs[0], mvMatrixs[0]);
    //
    mvMatrixs[1] = mat4.create();
    mat4.translate(mvMatrixs[1], mvMatrixs[1], [0, 0, 0]);
    mat4.scale(mvMatrixs[1], mvMatrixs[1], [0.1, 0.1, 0.1]);
    nMatrixs[1] = mat3.create();
    mat3.normalFromMat4(nMatrixs[1], mvMatrixs[1]);
    //
    mvMatrixs[2] = mat4.create();
    mat4.translate(mvMatrixs[2], mvMatrixs[2], [0, 0, 0]);
    mat4.scale(mvMatrixs[2], mvMatrixs[2], [0.1, 0.1, 0.1]);
    nMatrixs[2] = mat3.create();
    mat3.normalFromMat4(nMatrixs[2], mvMatrixs[2]);
    //
    mvMatrixs[3] = mat4.create();
    mat4.translate(mvMatrixs[3], mvMatrixs[3], [0, 0, 0]);
    mat4.scale(mvMatrixs[3], mvMatrixs[3], [0.1, 0.1, 0.1]);
    nMatrixs[3] = mat3.create();
    mat3.normalFromMat4(nMatrixs[3], mvMatrixs[3]);
    //
    mvMatrixs[4] = mat4.create();
    mat4.translate(mvMatrixs[4], mvMatrixs[4], [0, 0, 0]);
    mat4.scale(mvMatrixs[4], mvMatrixs[4], [0.1, 0.1, 0.1]);
    nMatrixs[4] = mat3.create();
    mat3.normalFromMat4(nMatrixs[4], mvMatrixs[4]);
    //
    mvMatrixs[5] = mat4.create();
    mat4.translate(mvMatrixs[5], mvMatrixs[5], [0, 0, 0]);
    mat4.scale(mvMatrixs[5], mvMatrixs[5], [0.1, 0.1, 0.1]);
    nMatrixs[5] = mat3.create();
    mat3.normalFromMat4(nMatrixs[5], mvMatrixs[5]);

    const uniformLightLocation = gl.getUniformLocation(shaderProgram, 'lightLocation');
    gl.uniform3fv(uniformLightLocation, lightLocation );
    const uniformAmbientLightColorLocation = gl.getUniformLocation(shaderProgram, 'ambientLightColor');
    gl.uniform3fv(uniformAmbientLightColorLocation, [0.5, 0.5, 0.5]);
    const uniformDiffuseLightColorLocation = gl.getUniformLocation(shaderProgram, 'diffuseLightColor');
    gl.uniform3fv(uniformDiffuseLightColorLocation, [0.5, 0.5, 0.5]);
    const uniformSpecularLightColorLocation = gl.getUniformLocation(shaderProgram, 'specularLightColor');
    gl.uniform3fv(uniformSpecularLightColorLocation, [0.5, 0.5, 0.5]);

    const mvMatrixLocation = gl.getUniformLocation(shaderProgram, 'mvMatrix');
    const nMatrixLocation = gl.getUniformLocation(shaderProgram, 'nMatrix');
    const pMatrixLocation = gl.getUniformLocation(shaderProgram, 'pMatrix');
    const vMatrixLocation = gl.getUniformLocation(shaderProgram, 'vMatrix');
    gl.uniformMatrix4fv(pMatrixLocation, false, pMatrix);
    gl.uniformMatrix4fv(vMatrixLocation, false, vMatrix);

    const texture1UniformLocation = gl.getUniformLocation(shaderProgram, "texture");
    gl.uniform1i(texture1UniformLocation, 0);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(textureAttributeLocation);

    for (var i = 0; i < 6; i++) {
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrixs[i]);
        gl.uniformMatrix3fv(nMatrixLocation, false, nMatrixs[i]);

        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffers[i]);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffers[i]);
        gl.vertexAttribPointer(textureAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, objs[i].position.length - 2, gl.UNSIGNED_SHORT, 0);
    }

    requestAnimationFrame(render);
}








   

