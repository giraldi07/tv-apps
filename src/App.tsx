import React, { useState, useEffect } from 'react';
import { Tv2, Menu, X, Settings, Info, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Channel } from './types';
import ImageBackground from './assets/3840x2160-evening-light-thorsmork-mountains-4k_1540133474.jpg';
import VideoPlayer from './components/VideoPlayer';
import { Link } from 'react-router-dom';


function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChannelList, setShowChannelList] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showControls, setShowControls] = useState(true);
  const [touchStartY, setTouchStartY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('https://tv-api-opal.vercel.app/api/channels')
      .then(response => response.json())
      .then(data => {
        setChannels(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err)
        setError('Failed to load channels');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let timeout: number;
    if (showControls && selectedChannel) {
      timeout = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, selectedChannel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowChannelList(false);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setShowControls(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchDelta = touchStartY - e.touches[0].clientY;
    if (Math.abs(touchDelta) > 50) {
      setShowChannelList(touchDelta < 0);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const switchChannel = (direction: 'next' | 'prev') => {
    if (!selectedChannel || !channels.length) return;
    
    const currentIndex = channels.findIndex(ch => ch.name === selectedChannel.name);
    let newIndex = direction === 'next' 
      ? (currentIndex + 1) % channels.length
      : (currentIndex - 1 + channels.length) % channels.length;
    
    setSelectedChannel(channels[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Tv2 className="h-16 w-16 text-red-600 animate-pulse" />
          <p className="text-white mt-4 text-xl">Loading Channels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${ImageBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#141414' // fallback color
      }}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      tabIndex={0}
    >

      {/* Top Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black via-black/50 to-transparent transition-opacity duration-300 ${
          showControls || !selectedChannel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a href="/" className="flex items-center space-x-4 cursor-pointer">
          <Tv2 className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Smart Indo TV
          </h1>
        </a>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-xl">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </span>
          <button
            onClick={() => setShowChannelList(!showChannelList)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors text-sm md:text-base"
          >
            <Menu className="h-5 w-5" />
            <span className="hidden md:inline">Browse</span>
          </button>
        </div>
      </div>

      {/* Channel Navigation Buttons */}
      {selectedChannel && showControls && (
        <>
          <button
            onClick={() => switchChannel('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/75 p-3 rounded-full transition-all"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={() => switchChannel('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/75 p-3 rounded-full transition-all"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Channel List Overlay */}
      {showChannelList && (
        <div 
          className="fixed inset-0 bg-black/90 z-30 backdrop-blur-sm"
          onClick={() => setShowChannelList(false)}
        >
          <div 
            className="absolute right-0 top-0 bottom-0 w-full md:w-[400px] bg-[#181818] p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Browse Channels</h2>
                <button
                  onClick={() => setShowChannelList(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#232323] text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid gap-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {filteredChannels.map((channel) => (
                  <button
                    key={channel.name}
                    onClick={() => {
                      setSelectedChannel(channel);
                      setShowChannelList(false);
                    }}
                    className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                      selectedChannel?.name === channel.name 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'hover:bg-[#232323]'
                    }`}
                  >
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-12 h-12 object-contain bg-[#232323] rounded-lg p-1"
                    />
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">{channel.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative h-screen">
        {selectedChannel ? (
          <>
            <VideoPlayer url={selectedChannel.url} />
            <div 
              className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={selectedChannel.logo}
                  alt={selectedChannel.name}
                  className="w-16 h-16 object-contain bg-[#232323] rounded-lg p-2"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedChannel.name}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
                      <Info className="h-4 w-4" />
                      <span>Info</span>
                    </button>
                    <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center flex-col p-6 text-center">
            <Tv2 className="h-24 w-24 text-red-600 mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Smart Indo TV
            </h2>

            <p className="text-gray-400 text-lg max-w-md">
              Discover and watch your favorite Indonesian TV channels with a modern streaming experience.
            </p>

            <span className="text-gray-400 text-md max-w-md m-4">
              By Giraldi Prama Yudistira
            </span>

            <button
              onClick={() => setShowChannelList(true)}
              className="mt-8 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Browse Channels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;