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

    var mvMatrix0 = mat4.create();
    mat4.scale(mvMatrix0, mvMatrix0, [0.1, 0.1, 0.1]);
    var nMatrix0 = mat3.create();
    mat3.normalFromMat4(nMatrix0, mvMatrix0);
    //
    var mvMatrix1 = mat4.create();
    mat4.scale(mvMatrix1, mvMatrix1, [0.1, 0.1, 0.1]);
    var nMatrix1 = mat3.create();
    mat3.normalFromMat4(nMatrix1, mvMatrix1);
    //
    var mvMatrix2 = mat4.create();
    mat4.scale(mvMatrix2, mvMatrix2, [0.1, 0.1, 0.1]);
    var nMatrix2 = mat3.create();
    mat3.normalFromMat4(nMatrix2, mvMatrix2);
    //
    var mvMatrix3 = mat4.create();
    mat4.scale(mvMatrix3, mvMatrix3, [0.1, 0.1, 0.1]);
    var nMatrix3 = mat3.create();
    mat3.normalFromMat4(nMatrix3, mvMatrix3);
    //
    var mvMatrix4 = mat4.create();
    mat4.scale(mvMatrix4, mvMatrix4, [0.1, 0.1, 0.1]);
    var nMatrix4 = mat3.create();
    mat3.normalFromMat4(nMatrix4, mvMatrix4);
    //
    var mvMatrix5 = mat4.create();
    mat4.scale(mvMatrix5, mvMatrix5, [0.1, 0.1, 0.1]);
    var nMatrix5 = mat3.create();
    mat3.normalFromMat4(nMatrix5, mvMatrix5);

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

    for (var i = 0; i < 6; i++) {
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix0);
        gl.uniformMatrix3fv(nMatrixLocation, false, nMatrix0);
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffers[i]);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffers[i]);
        gl.vertexAttribPointer(textureAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawElements(gl.TRIANGLES, objs[i].position.length - 2, gl.UNSIGNED_SHORT, 0);
    }

    requestAnimationFrame(render);
}








   

