    const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 mvMatrix;
    uniform mat3 nMatrix;
    uniform mat4 pMatrix;
    uniform mat4 vMatrix;

    uniform vec3 lightLocation;
    uniform vec3 ambientLightColor;
    uniform vec3 diffuseLightColor;
    uniform vec3 specularLightColor;

    varying vec3 v_LightWeighting;
    varying vec2 v_aTextureCoord;

    void main(void) {
        float shininess = 0.5;
        vec4 vertexPositionEye4 = vMatrix * mvMatrix * vec4(aVertexPosition, 1.0);
        vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;
        vec3 lightDirection = normalize(lightLocation - vertexPositionEye3);
        vec3 normal = normalize(nMatrix * aVertexPosition.xyz);
        float lightDist = length(lightDirection);
        float lightIntens = 1.0 / (1.0 + 0.1 * lightDist + 0.01 * lightDist * lightDist);
        float diffuseLightDot = max(dot(normal, lightDirection), 0.0);
        vec3 reflectionVector = normalize(reflect(-lightDirection, normal));
        vec3 viewVectorEye = -normalize(vertexPositionEye3);
        float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
        float specularLightParam = pow(specularLightDot, shininess);

        v_LightWeighting = ambientLightColor + (diffuseLightColor * diffuseLightDot + specularLightColor * specularLightParam) * lightIntens;
        v_aTextureCoord = aTextureCoord;
        gl_Position = pMatrix * vMatrix * mvMatrix * vec4(aVertexPosition, 1.0);
    }`;



   