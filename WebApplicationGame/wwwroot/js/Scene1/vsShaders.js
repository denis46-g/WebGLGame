    const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aNormal;

    
    uniform mat4 pMatrix;
    uniform mat4 mvMatrix;
    varying vec2 v_aTextureCoord;
    varying vec3 v_aVertexPosition;
    varying vec3 v_aNormal;

    void main(void) {
        v_aTextureCoord = aTextureCoord;
        v_aVertexPosition = aVertexPosition;
        v_aNormal = aNormal;
        gl_Position = pMatrix * mvMatrix * vec4(aVertexPosition, 1.0);
    }`;



   