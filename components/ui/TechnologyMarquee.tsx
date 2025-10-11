"use client";

import { technologies } from "@/data/technologies";
import Marquee from "react-fast-marquee";

export default function TechnologyMarquee() {
  // Split technologies into two rows
  const midPoint = Math.ceil(technologies.length / 2);
  const row1 = technologies.slice(0, midPoint);
  const row2 = technologies.slice(midPoint);

  return (
    <section className="relative overflow-visible py-24">
      {/* Double Marquee */}
      <div className="relative space-y-8">
        {/* First Marquee - Primary gradient */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 py-6 transform -rotate-2 w-[110vw] -ml-[5vw]">
          <Marquee speed={50} gradient={false} autoFill={true}>
            {row1.map((tech) => (
              <div key={`row1-${tech.id}`} className="mx-8">
                <div className="w-16 h-16 md:w-20 md:h-20 relative hover:scale-110 transition-transform duration-300">
                  <div 
                    className="w-full h-full"
                    style={{
                      mask: `url(${tech.logo}) center/contain no-repeat`,
                      WebkitMask: `url(${tech.logo}) center/contain no-repeat`,
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Second Marquee - Secondary gradient, opposite direction */}
        <div className="bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 py-6 transform rotate-2 w-[110vw] -ml-[5vw]">
          <Marquee speed={45} gradient={false} autoFill={true} direction="right">
            {row2.map((tech) => (
              <div key={`row2-${tech.id}`} className="mx-8">
                <div className="w-16 h-16 md:w-20 md:h-20 relative shadow-lg hover:scale-110 transition-transform duration-300">
                  <div 
                    className="w-full h-full"
                    style={{
                      mask: `url(${tech.logo}) center/contain no-repeat`,
                      WebkitMask: `url(${tech.logo}) center/contain no-repeat`,
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}