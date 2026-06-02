import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { NavigationProps } from '../types';
import { fetchStories } from '../../../api';
import { Search, Twitter, Facebook, Linkedin } from 'lucide-react';

// No default fallback stories; relies fully on fetched DB content.

export const StoriesPage: React.FC<NavigationProps> = ({ onHomeClick, onAboutClick, onStoriesClick, onPlantClick, onLoginClick }) => {
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

  const handleShare = (platform: string, url: string, title: string) => {
    const text = encodeURIComponent(title);
    const link = encodeURIComponent(url || window.location.href);
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${link}&title=${text}`;
        break;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

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
          <div className="columns-1 md:columns-2 lg:columns-3 gap-12 mb-32">
            {filteredAndSortedStories.map((story, i) => (
              <motion.article 
                key={story.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col break-inside-avoid border-t border-black pt-6 mb-12"
              >
                <h2 
                  className="text-2xl font-bold tracking-tight leading-snug group-hover:text-[#247114] transition-colors cursor-pointer mb-4"
                  onClick={() => story.linkUrl && window.open(story.linkUrl, '_blank')}
                >
                  {story.title}
                </h2>
                
                <div 
                  className="w-full aspect-[16/10] overflow-hidden mb-4 cursor-pointer bg-gray-100"
                  onClick={() => story.linkUrl && window.open(story.linkUrl, '_blank')}
                >
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
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                <p className="text-gray-800 leading-relaxed text-sm mb-6 flex-1 text-justify">
                  {story.description}
                </p>
                
                {/* Editorial Footer */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-black uppercase tracking-widest">
                      Published {story.date}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-black">
                    <button onClick={() => handleShare("twitter", story.linkUrl, story.title)} className="hover:text-[#247114] transition-colors">
                      <Twitter size={14} />
                    </button>
                    <button onClick={() => handleShare("facebook", story.linkUrl, story.title)} className="hover:text-[#247114] transition-colors">
                      <Facebook size={14} />
                    </button>
                    <button onClick={() => handleShare("linkedin", story.linkUrl, story.title)} className="hover:text-[#247114] transition-colors">
                      <Linkedin size={14} />
                    </button>
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
