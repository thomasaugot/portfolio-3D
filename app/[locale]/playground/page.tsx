export default function LinkedInBanner() {
  const technologies = [
    { id: "nextjs", name: "Next.js", logo: "/assets/images/technologies/nextjs-logo.png" },
    { id: "react", name: "React", logo: "/assets/images/technologies/react-logo.png" },
    { id: "nodejs", name: "Node.js", logo: "/assets/images/technologies/nodejs-logo.png" },
    { id: "javascript", name: "Javascript", logo: "/assets/images/technologies/javascript-logo.png" },
    { id: "sass", name: "Sass", logo: "/assets/images/technologies/scss-logo.png" },
    { id: "tailwindcss", name: "Tailwind CSS", logo: "/assets/images/technologies/tailwind-logo.png" },
    { id: "gsap", name: "GSAP", logo: "/assets/images/technologies/gsap-logo.png" },
    { id: "typescript", name: "TypeScript", logo: "/assets/images/technologies/typescript-logo.png" },
  ];

  const createHexPath = (cx: number, cy: number, size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const hexagons = [];
  const hexSize = 38;
  const hexWidth = hexSize * 2;
  const hexHeight = hexSize * Math.sqrt(3);
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 16; col++) {
      const x = col * hexWidth * 0.75 + 850;
      const y = row * hexHeight + (col % 2 === 0 ? 0 : hexHeight / 2) - 50;
      const color = (row + col) % 3 === 0 ? '#ccff02' : '#02bccc';
      const opacity = 0.25 + (Math.random() * 0.15);
      
      hexagons.push(
        <polygon
          key={`hex-${row}-${col}`}
          points={createHexPath(x, y, hexSize)}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          opacity={opacity}
        />
      );
    }
  }

  return (
    <div className="relative w-[1400px] h-[396px] overflow-hidden" style={{ background: '#1a1a1a' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60 z-[1]" />
      
      <svg className="absolute -right-24 top-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(18 1200 200)" className="opacity-40 z-0">
          {hexagons}
        </g>
      </svg>

      <div className="absolute bottom-0 right-0 w-[700px] h-[350px] opacity-30 blur-3xl z-[2]"
        style={{
          background: 'radial-gradient(ellipse, rgba(204, 255, 2, 0.5), rgba(2, 188, 204, 0.5))'
        }}
      />

      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] z-[3] overflow-visible">
        <div className="absolute bottom-[-100px] left-0 w-[350px] h-[350px]"
          style={{
            background: 'linear-gradient(135deg, rgba(204, 255, 2, 0.15), rgba(2, 188, 204, 0.15))',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }}
        />
      </div>

      <div className="relative h-full flex items-center justify-end gap-0 pr-20 z-[10]">
        <div className="text-right space-y-5">
          <div className="space-y-0 -rotate-90">
            <div className="text-6xl font-black leading-none"
              style={{
                background: 'linear-gradient(135deg, #ccff02 0%, #02bccc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(204, 255, 2, 0.4))'
              }}
            >
              Full Stack
            </div>
            <div className="text-5xl font-black leading-none text-white"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
              }}
            >
              Developer
            </div>
          </div>
          
        </div>

        <div className="flex flex-col gap-6 z-[999]">
          <div className="flex gap-6">
            {technologies.slice(0, 4).map((tech, index) => (
              <div 
                key={tech.id} 
                className="w-32 h-32 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 40px rgba(204, 255, 2, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div
                  className="w-24 h-24 relative z-10"
                  style={{
                    mask: `url(${tech.logo}) center/contain no-repeat`,
                    WebkitMask: `url(${tech.logo}) center/contain no-repeat`,
                    backgroundColor: '#ffffff',
                    filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3))'
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-6">
            {technologies.slice(4, 8).map((tech, index) => (
              <div 
                key={tech.id} 
                className="w-32 h-32 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 40px rgba(2, 188, 204, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div
                  className="w-24 h-24 relative z-10"
                  style={{
                    mask: `url(${tech.logo}) center/contain no-repeat`,
                    WebkitMask: `url(${tech.logo}) center/contain no-repeat`,
                    backgroundColor: '#ffffff',
                    filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.3))'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}