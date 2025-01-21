import { X, Send } from 'lucide-react';

const Header = () => {
  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="mx-[114px] mt-[14px] h-[63px] rounded-full bg-[#9A0222] px-[14px] py-[14px] flex items-center justify-between">
          {/* Logo */}
          <div className="h-[35px] w-[35px] rounded-full overflow-hidden">
            <img 
              src="https://howlcoin.xyz/wp-content/uploads/2025/01/howl-logo-compressed.png"
              alt="Howl Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Menu */}
          <div className="flex gap-6">
            <a href="what-is-howl" className="cursor-pointer text-white hover:text-gray-200">
              WHAT IS HOWL
            </a>
            <a href="why-choose-us" className="cursor-pointer text-white hover:text-gray-200">
              WHY CHOOSE US
            </a>
            <a href="tokenomics" className="cursor-pointer text-white hover:text-gray-200">
              OUR TOKENOMICS
            </a>
            <a href="coin-ttp" className="cursor-pointer text-white hover:text-gray-200">
              COIN TTP
            </a>
            <a href="how-to-buy" className="cursor-pointer text-white hover:text-gray-200">
              HOW TO BUY
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="text-white hover:text-gray-200">
              <X size={20} />
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <Send size={20} />
            </a>
            {/* Medium icon (you might need to import a custom Medium icon) */}
            <a href="#" className="text-white hover:text-gray-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 12C13 15.3137 10.3137 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C10.3137 6 13 8.68629 13 12Z" />
                <path d="M23 12C23 14.7614 22.1046 17 21 17C19.8954 17 19 14.7614 19 12C19 9.23858 19.8954 7 21 7C22.1046 7 23 9.23858 23 12Z" />
                <path d="M17 12C17 14.7614 16.5523 17 16 17C15.4477 17 15 14.7614 15 12C15 9.23858 15.4477 7 16 7C16.5523 7 17 9.23858 17 12Z" />
              </svg>
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section with Background */}
      <div 
        className="bg-cover bg-center pt-[77px] pb-[250px] h-[1127px]" 
        style={{
          backgroundImage: `url(https://howlcoin.xyz/wp-content/uploads/2025/01/wolf-banner-3-2-1.png)`
        }}
      >
        <div className="flex items-end justify-center h-[calc(100vh-250px)] z-50">
          <button className="px-8 py-3 bg-gradient-to-r from-[#FF6A00] to-[#FF4000] text-white border-2 border-black rounded-lg hover:opacity-90 transition-opacity">
            Join Community
          </button>
        </div>
      </div>
       {/* New Launch Date Section */}
  <section className="bg-[#FFE100] mt-[-75px] z-[-1] relative h-[1308px]">
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-wrap items-center">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 mt-[100px] text-black">
          <h3 className="text-[30px] font-medium">Launch Date:</h3>
          <div className="font-['Handjet'] text-black text-[120px] font-bold leading-tight">
            JAN 20, 2025
          </div>
          <p className="mt-6 text-lg max-w-2xl">
            On January 20, 2025, the world will witness the rise of the Blue Wolf—a powerful fusion of Trump's legacy and Elon Musk's revolutionary D.O.G.E. initiative. Together, they ignite H.O.W.L., a decentralized force that champions freedom, unity, and resilience. This moment is not just about a transfer of power; it's about giving power back to the people—a beacon of democracy, innovation, and strength.
          </p>
        </div>
        
        {/* Right Image */}
        <div className="w-full lg:w-1/2">
          <img 
            src="https://howlcoin.xyz/wp-content/uploads/2025/01/Group-60-1-1.png"
            alt="Blue Wolf"
            className="w-full"
            style={{ margin: '-13% 0 0 0',position:'absolute',right:'0' }}
          />
        </div>
      </div>
    </div>
  </section>

    </>
  );
};

export default Header;