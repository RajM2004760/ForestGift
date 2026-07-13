import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { NavigationProps } from '../types';
import { fetchStories } from '../../../api';
import { Facebook, Youtube, Instagram, Linkedin, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const StoryDetailPage: React.FC<NavigationProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const data = await fetchStories();
        const foundStory = data.find((s: any) => s._id === id);
        if (foundStory) {
          setStory({
            id: foundStory._id,
            title: foundStory.title,
            description: foundStory.content,
            image: foundStory.imageUrl,
            linkUrl: foundStory.linkUrl,
            date: new Date(foundStory.createdAt).toLocaleDateString(),
          });
        }
      } catch (error) {
        console.error('Failed to load story:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, [id]);

  // Share handles replaced by direct profile links

  const getImageUrl = (url: string) => {
    if (!url) return '';
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (driveMatch && driveMatch[1]) return `https://drive.google.com/uc?id=${driveMatch[1]}`;
    const driveIdMatch = url.match(/id=([a-zA-Z0-9-_]+)/);
    if (url.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) return `https://drive.google.com/uc?id=${driveIdMatch[1]}`;
    return url;
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-[#247114] selection:text-white flex flex-col">
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => navigate('/stories')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#247114] transition-colors mb-8 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Stories
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#247114]"></div>
            </div>
          ) : story ? (
            <motion.article 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="w-full bg-gray-50 flex justify-center py-8">
                <img 
                  src={getImageUrl(story.image)}
                  alt={story.title} 
                  className="max-h-[500px] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
              
              <div className="p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  {story.title}
                </h1>
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    Published {story.date}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={async () => {
                        const shareData = {
                          title: story.title,
                          text: `Check out this inspiring story from ForestGift:\n\n"${story.title}"\n\nRead more here: `,
                          url: window.location.href
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
                      className="flex items-center gap-2 px-4 py-2 bg-[#247114] text-white rounded-full hover:bg-green-800 transition-colors text-xs font-bold shadow-sm"
                    >
                      <Share2 size={14} /> Share Story
                    </button>
                    
                    <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

                    <span className="text-sm font-medium text-gray-500 hidden sm:block">Follow Us:</span>
                    <a href="https://www.facebook.com/profile.php?id=61572164207632" target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-[#247114] hover:text-white transition-colors"><Facebook size={18} /></a>
                    <a href="https://www.youtube.com/@forestgift_india" target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-[#247114] hover:text-white transition-colors"><Youtube size={18} /></a>
                    <a href="https://www.instagram.com/forestgift_india/" target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-[#247114] hover:text-white transition-colors"><Instagram size={18} /></a>
                    <a href="https://www.linkedin.com/company/forestgift/" target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-[#247114] hover:text-white transition-colors"><Linkedin size={18} /></a>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap text-justify">
                  {story.description}
                </div>
              </div>
            </motion.article>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold mb-4">Story not found</h2>
              <p className="text-gray-600 mb-8">The story you're looking for doesn't exist or has been removed.</p>
              <button 
                onClick={() => navigate('/stories')}
                className="px-8 py-3 bg-[#247114] text-white rounded-full font-semibold hover:bg-green-800 transition-colors"
              >
                Browse All Stories
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
