    const fsSource = `
    #ifdef GL_ES
    precision highp float;
    #endif

    uniform sampler2D texture;
    uniform mat4 mvMatrix;
    uniform mat4 mvMatrix2;
    uniform mat3 nMatrix;
    uniform vec3 lightLocation;
    uniform vec3 lightLocation2;
    uniform vec3 ambientLightColor;
    uniform vec3 diffuseLightColor;
    uniform vec3 specularLightColor;
    uniform bool lightingSpace;
    uniform bool lightingSpace2;

    uniform float amb;
    uniform float att;
    uniform float attL;

    varying vec2 v_aTextureCoord;
    varying vec3 v_aVertexPosition;
    varying vec3 v_aNormal;


    vec3 phong(vec3 loc)
    {
        float shininess = 0.5;
        vec4 vertexPositionEye4 = mvMatrix * vec4(v_aVertexPosition, 1.0);
        vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;
        vec3 lightDirection = normalize(loc - vertexPositionEye3);

        float distanceToLight = length(lightDirection);
        float attenuation = 1.0 / (att + attL * distanceToLight);

        vec3 normal = normalize(nMatrix * v_aNormal.xyz);
        float diffuseLightDot = max(dot(normal, lightDirection), 0.0);
        vec3 reflectionVector = normalize(reflect(-lightDirection, normal));
        vec3 viewVectorEye = -normalize(vertexPositionEye3);
        float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
        float specularLightParam = pow(specularLightDot, shininess);
        return (diffuseLightColor * diffuseLightDot + specularLightColor * specularLightParam) * attenuation;
    }

    void main(void) {
        vec4 pixel = texture2D(texture, v_aTextureCoord);
        vec3 lightWeighting = ambientLightColor * amb;
        if(lightingSpace){
            lightWeighting += phong(lightLocation);
        }
        if(lightingSpace2){
            lightWeighting += phong(lightLocation2);
        }

        gl_FragColor = vec4(lightWeighting * pixel.rgb, pixel.a);
    }`;


   