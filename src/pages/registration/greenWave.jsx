import React, { useEffect, useRef } from 'react';
// import gsap from 'gsap';

const fragmentShader = `
  precision mediump float;
  uniform float time;
  uniform vec2 resolution;

  #define PI 3.14159265359

  vec3 colorA = vec3(0.0, 0.9, 0.4);  // Green
  vec3 colorB = vec3(0.0, 0.3, 0.9);  // Teal

  float createWave(vec2 pos, float freq, float phase) {
    return sin(pos.x * freq + time * 2.0 + phase) * 
           cos(pos.y * freq * 0.5 + time + phase) * 0.5;
  }

  void main() {
    vec2 pos = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    pos.x *= resolution.x / resolution.y;
    
    float dist = length(pos);
    
    float wave1 = createWave(pos, 5.0, 0.0);
    float wave2 = createWave(pos, 3.0, PI / 4.0);
    float wave3 = createWave(pos, 7.0, PI / 2.0);
    
    float waves = (wave1 + wave2 + wave3) / 3.0;
    
    float mask = smoothstep(0.8, 0.2, dist);
    
    vec3 color = mix(colorA, colorB, waves + 0.5);
    
    color *= mask;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const GreenWaveShader = () => {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const frameRef = useRef(null);
  // const h1Ref = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    glRef.current = gl;

    const program = gl.createProgram();
    
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vs));
      return;
    }
    
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fs));
      return;
    }
    
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }
    
    programRef.current = program;

    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const animate = (time) => {
      if (!gl) return;
      
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      
      const timeLocation = gl.getUniformLocation(program, 'time');
      gl.uniform1f(timeLocation, time * 0.001);
      
      const resolutionLocation = gl.getUniformLocation(program, 'resolution');
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    animate(0);
    // gsap.fromTo(
    //   h1Ref.current,
    //   { opacity: 0, y: -100 },
    //   { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
    // );

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <div className='relative'>
      {/* <h1 ref={h1Ref} className='absolute w-full min-h-screen flex justify-center pt-10 z-10 text-green-400 text-6xl md:text-7xl lg:text-8xl font-bold'>LostAndFound</h1> */}
      <canvas ref={canvasRef} className='w-full h-full bg-black' />
    </div>
  );
};

export default GreenWaveShader;
