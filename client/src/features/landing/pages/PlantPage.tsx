import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Plans } from '../components/Plans';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';
import { Check, X as XIcon } from 'lucide-react';

const faqs = [
  {
    q: "How does it <span class='text-[#247114]'>work</span>?",
    a: "You pay for our planting service, and we deliver healthy plants to your chosen spot."
  },
  {
    q: "Is this <span class='text-[#247114]'>social work</span>?",
    a: "No, unlike other groups, we operate as a service business focused on planting."
  },
  {
    q: "Can I celebrate birthdays <span class='text-[#247114]'>here</span>?",
    a: "Yes! We make your birthday special by planting a tree in your name during the celebration."
  },
  {
    q: "What <span class='text-[#247114]'>types</span> of plants?",
    a: "We offer a variety of native and seasonal plants suited to the local environment."
  },
  {
    q: "Do you <span class='text-[#247114]'>deliver</span> plants?",
    a: "Yes, we deliver and plant them at your preferred location within the forest."
  },
  {
    q: "How do I book a <span class='text-[#247114]'>planting service</span>?",
    a: "Simply contact us through our website or phone, and we'll schedule your planting and celebration."
  }
];

const comparisonData = [
  { benefit: "Tree Plantation", tier1: true, tier2: true, tier3: true },
  { benefit: "Birthday Cake", tier1: "Small", tier2: "Medium", tier3: "Premium" },
  { benefit: "Eco-Friendly Gift", tier1: "Basic", tier2: "Premium", tier3: "Premium Gift Box" },
  { benefit: "Certificate", tier1: true, tier2: true, tier3: true },
  { benefit: "Dashboard Access", tier1: true, tier2: true, tier3: true },
  { benefit: "Tree Tracking", tier1: true, tier2: true, tier3: true },
  { benefit: "Community Badge", tier1: "Supporter", tier2: "Creator", tier3: "Guardian" },
  { benefit: "Website Recognition", tier1: false, tier2: true, tier3: true },
  { benefit: "Event Invitations", tier1: false, tier2: true, tier3: true },
  { benefit: "Eco-Tourism Discount", tier1: false, tier2: true, tier3: true },
  { benefit: "Complimentary Eco-Tourism Pass", tier1: false, tier2: false, tier3: true },
  { benefit: "Annual Impact Report", tier1: false, tier2: false, tier3: true },
];

const renderCell = (value: boolean | string) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-6 h-6 mx-auto text-[#247114]" />
    ) : (
      <XIcon className="w-6 h-6 mx-auto text-gray-300" />
    );
  }
  return <span className="text-gray-800 font-semibold">{value}</span>;
};

export const PlantPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32">
        {/* Main Plans Section */}
        <Plans />

        {/* Plan Comparison Table Section */}
        <section className="py-24 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">
               Compare <span className="text-[#247114]">Benefits</span>
             </h2>
             <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="py-6 px-4 font-bold text-gray-500 uppercase tracking-wider text-sm w-1/3">Benefits</th>
                      <th className="py-6 px-4 text-center font-bold text-xl text-black">1 Tree</th>
                      <th className="py-6 px-4 text-center font-bold text-xl text-black">5 Trees</th>
                      <th className="py-6 px-4 text-center font-bold text-xl text-black">10 Trees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4 font-medium text-gray-700">{row.benefit}</td>
                        <td className="py-5 px-4 text-center">{renderCell(row.tier1)}</td>
                        <td className="py-5 px-4 text-center">{renderCell(row.tier2)}</td>
                        <td className="py-5 px-4 text-center">{renderCell(row.tier3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-24 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-[80px] font-bold tracking-tighter leading-none mb-20">
              FA<span className="text-[#247114]">Q</span>s
            </h2>

            <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <h3 
                    className="text-xl md:text-2xl font-bold tracking-tight"
                    dangerouslySetInnerHTML={{ __html: faq.q }}
                  />
                  <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
