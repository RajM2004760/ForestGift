import React from 'react';
import { motion } from 'framer-motion';

export const Memories: React.FC = () => {
  return (
    <section className="py-12 px-6 bg-white overflow-hidden flex flex-col items-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">


        {/* Image moved towards the bottom with a very tight gap */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-[100vw] max-w-[100vw] shrink-0 mt-8 md:mt-0 translate-y-0 md:-translate-y-8 flex justify-center"
        >
          <video 
            src="/footer_video.mp4" 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto md:h-[100vh] object-contain mix-blend-multiply" 
          />
        </motion.div>

        {/* Call to action at the very bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="-mt-20 relative z-20"
        >
          <button className="px-14 py-4 bg-black text-white rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-2xl hover:bg-[#247114] transition-all">
            EXPLORE GLOBAL STORIES
          </button>
        </motion.div>
      </div>
    </section>
  );
};
