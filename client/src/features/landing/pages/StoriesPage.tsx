import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';
import { fetchStories } from '../../../api';
import { Search, Facebook, Youtube, Instagram, Linkedin, Share2 } from 'lucide-react';

// No default fallback stories; relies fully on fetched DB content.

export const StoriesPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick }) => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await fetchStories();
        if (data && data.length > 0) {
          const formatted = data.map((s: any) => ({
            id: s._id,
            title: s.title,
            description: s.content,
            image: s.imageUrl,
            linkUrl: s.linkUrl,
            date: new Date(s.createdAt).toLocaleDateString(),
            createdAt: new Date(s.createdAt).getTime(),
            readTime: "1 min read"
          }));
          setStories(formatted);
        } else {
          setStories([]);
        }
      } catch (error) {
        console.error('Failed to load stories:', error);
      }
    };
    loadStories();
  }, []);

  const filteredAndSortedStories = useMemo(() => {
    let result = stories.filter(story => 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      story.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt - a.createdAt;
      } else {
        return a.createdAt - b.createdAt;
      }
    });

    return result;
  }, [stories, searchQuery, sortOrder]);

  // No handleShare needed anymore.

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white">
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Newspaper Masthead Section */}
          <section className="text-center mb-12 border-b-2 border-black pb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-[90px] font-bold tracking-tighter leading-none mb-6"
            >
              Let's hear <span className="text-[#247114]">Stories</span>
            </motion.h1>
            <p className="text-gray-900 text-xl md:text-2xl font-medium">
              Stories from around the world.
            </p>
          </section>

          {/* Editorial Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-gray-200 pb-6">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none text-black">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search the archive..." 
                className="w-full bg-transparent border-none pl-8 pr-4 py-2 text-sm font-bold focus:ring-0 outline-none placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort By:</span>
              <select 
                className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none cursor-pointer text-black"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              >
                <option value="newest">Latest Editions</option>
                <option value="oldest">From the Archive</option>
              </select>
            </div>
          </div>

          {/* Newspaper Columns Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {filteredAndSortedStories.map((story, i) => (
              <motion.article 
                key={story.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                <div className="w-full aspect-[16/10] bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={(() => {
                      const url = story.image;
                      if (!url) return '';
                      const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
                      if (driveMatch && driveMatch[1]) return `https://drive.google.com/uc?id=${driveMatch[1]}`;
                      const driveIdMatch = url.match(/id=([a-zA-Z0-9-_]+)/);
                      if (url.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) return `https://drive.google.com/uc?id=${driveIdMatch[1]}`;
                      return url;
                    })()}
                    alt={story.title} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold tracking-tight leading-snug group-hover:text-[#247114] transition-colors mb-3 line-clamp-2">
                    {story.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed text-sm mb-6 flex-1 line-clamp-3">
                    {story.description}
                  </p>
                
                {/* Editorial Footer */}
                <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Published {story.date}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-400">
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        const storyUrl = window.location.origin + `/story/${story.id}`;
                        const shareData = {
                          title: story.title,
                          text: `Check out this inspiring story from ForestGift:\n\n"${story.title}"\n\nRead more here: `,
                          url: storyUrl
                        };
                        try {
                          if (navigator.share) {
                            await navigator.share(shareData);
                          } else {
                            await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}${shareData.url}`);
                            alert('Link copied to clipboard!');
                          }
                        } catch (err) {
                          console.log('Error sharing:', err);
                        }
                      }}
                      className="hover:text-[#247114] transition-colors bg-gray-50 p-1.5 rounded-full text-gray-500 mr-2"
                      title="Share Story"
                    >
                      <Share2 size={14} />
                    </button>
                    <a href="https://www.facebook.com/profile.php?id=61572164207632" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-[#247114] transition-colors"><Facebook size={14} /></a>
                    <a href="https://www.youtube.com/@forestgift_india" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-[#247114] transition-colors"><Youtube size={14} /></a>
                    <a href="https://www.instagram.com/forestgift_india/" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-[#247114] transition-colors"><Instagram size={14} /></a>
                    <a href="https://www.linkedin.com/company/forestgift/" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-[#247114] transition-colors"><Linkedin size={14} /></a>
                  </div>
                </div>
              </div>
              </motion.article>
            ))}
          </div>
            
          {filteredAndSortedStories.length === 0 && (
            <div className="py-20 text-center w-full border-t border-black pt-12">
              <p className="text-2xl text-gray-400 font-medium">No stories found in the archive.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 px-8 py-3 bg-black text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};
