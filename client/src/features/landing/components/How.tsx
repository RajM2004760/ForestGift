import React from 'react';
import { motion } from 'framer-motion';

const Step = ({
  label,
  title,
  subtitle,
  points,
  footer,
  image,
  isRight = false
}: {
  label: string;
  title: string;
  subtitle: string;
  points: string[];
  footer: string | React.ReactNode;
  image: string;
  isRight?: boolean;
}) => (
  <div className={`flex flex-col md:flex-row items-start gap-0 w-full ${isRight ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
    {/* Image Container */}
    <div className="flex flex-col items-center flex-shrink-0 w-[200px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[200px] h-[200px] flex items-center justify-center mb-0"
      >
        <img src={image} alt={label} className="w-full h-auto object-contain mix-blend-multiply rounded-3xl" />
      </motion.div>
      <motion.h4
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-black tracking-tighter mt-2"
      >
        {label}
      </motion.h4>
    </div>

    {/* Content Area */}
    <div className="flex-1 pt-4 space-y-2 px-2">
      <motion.div
        initial={{ opacity: 0, x: isRight ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-[#247114] text-[24px] md:text-[26px] font-bold leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm md:text-base font-medium">
          {subtitle}
        </p>
        <div className="mt-4 text-gray-800 text-[15px] md:text-[16px] leading-tight space-y-2 font-medium">
          {points.map((point, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {point}
            </motion.p>
          ))}
        </div>
        <div className="mt-4 text-[#247114] font-bold text-[16px] md:text-[17px]">
          {footer}
        </div>
      </motion.div>
    </div>
  </div>
);

export const How: React.FC = () => {
  return (
    <section className="py-6 px-6 bg-white overflow-hidden min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-[64px] font-bold tracking-tighter leading-none">
            Forest. <span className="text-[#247114]">How?</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium tracking-tight mt-1">
            How Can i Create my own forest.?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-8">
          {/* Step 1: Plant */}
          <Step
            label="Plant."
            title="Plant your birthday tree"
            subtitle="Start your journey with a tree planted in your name."
            image="/how/how_plant.png"
            points={[
              "Your tree is planted",
              "You receive a plantation certificate",
              "Your tree is added to your FOREST dashboard",
              "You create positive impact from day one"
            ]}
            footer=""
          />

          {/* Step 2: Pledge */}
          <Step
            isRight
            label="Pledge."
            title="Promise to return every birthday"
            subtitle="A forest is not created in a day. It is created by people who return every year."
            image="/how/how_pledge.png"
            points={[
              "Join the FOREST movement",
              "Receive annual birthday reminders",
              "Track your growing impact",
              "Build a lifelong relationship with nature"
            ]}
            footer=""
          />

          {/* Step 3: Create */}
          <Step
            label="Create."
            title="Grow your own forest"
            subtitle="Each birthday adds new trees to your journey."
            image="/how/how_create.png"
            points={[
              "Your personal forest grows every year",
              "Track your lifetime contribution",
              "Create a legacy for future generations",
              "Leave the world greener than you found it"
            ]}
            footer=""
          />

          {/* Step 4: Celebrate */}
          <Step
            isRight
            label="Celebrate."
            title="Celebrate your special day differently"
            subtitle="Turn your birthday into a celebration that creates life."
            image="/how/how_celebrate.png"
            points={[
              "Birthday cake from FOREST partners",
              "Eco-friendly gifts",
              "Sustainable celebration experience",
              "Meaningful memories with family and friends"
            ]}
            footer=""
          />
        </div>
      </div>
    </section>
  );
};
