    const fsSource = `
    #ifdef GL_ES
    precision highp float;
    #endif

    uniform sampler2D texture;

    varying vec3 v_LightWeighting;
    varying vec2 v_aTextureCoord;

    void main(void) {
        vec4 pixel = texture2D(texture, v_aTextureCoord);
        gl_FragColor = vec4(v_LightWeighting.rgb * pixel.rgb, pixel.a);
    }`;


   