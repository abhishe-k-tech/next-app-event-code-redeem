'use client';
import { useState, useEffect } from 'react';
import { 
  Menu,
  LogOut, 
  Settings, 
  LayoutGrid, 
  BookLock,
  Search, 
  Sun, 
  Moon 
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [businessCards, setBusinessCards] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 0,
    perPage: 10
  });
  const router = useRouter();

  useEffect(() => {
  

    const debounceTimer = setTimeout(() => {
      fetchBusinessCards();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm]);

  const fetchBusinessCards = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken');
      
      const response = await axios.get('http://localhost:3006/api/business-cards', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBusinessCards(response.data.businessCards);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching business cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear the auth token cookie
    Cookies.remove('authToken');
    // Redirect to admin login page
    router.push('/admin');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <img src="https://www.solulab.com/wp-content/themes/Avada/assets/images/solulab-logo-dark-75.png" alt="Logo" className="h-8 mx-auto" />
        </div>
        <nav className="mt-8">
          <a  href="/admin/dashboard" className={`flex items-center p-4 ${
            darkMode 
              ? 'text-white bg-gray-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}>
            <LayoutGrid className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Dashboard</span>}
          </a>
          <a href="/admin/coupons" className={`flex items-center p-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <BookLock className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Coupons</span>}
          </a>
          <a href="#" className={`flex items-center p-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <Settings className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Settings</span>}
          </a>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center p-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <LogOut className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className={`p-4 flex items-center justify-between ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`p-2 rounded-lg ${
              darkMode 
                ? 'text-white hover:bg-gray-700' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Menu className="h-6 w-6" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Search Bar */}
          <div className="mb-6 relative w-[300px] ml-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white text-gray-900 placeholder-gray-500'
              } border border-transparent focus:outline-none`}
            />
            <Search className={`absolute left-3 top-3 h-5 w-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className={`w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Company Name</th>
                  <th className="p-4 text-left">Reedem code</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : businessCards.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8">
                      <div className="text-gray-500">No business cards found</div>
                    </td>
                  </tr>
                ) : (
                  businessCards.map((card) => (
                    <tr key={card._id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="p-4">{card?.fullName} {card?.title}</td>
                      <td className="p-4">{card?.phone}</td>
                      <td className="p-4">{card?.email}</td>
                      <td className="p-4">{card?.companyName}</td>
                      <td className="p-4">{card?.redeemCode}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && businessCards.length > 0 && pagination.total > pagination.perPage && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white disabled:bg-gray-800' 
                    : 'bg-white text-gray-700 disabled:bg-gray-100'
                } disabled:cursor-not-allowed`}
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                // Show first page, last page, current page, and pages around current page
                if (
                  i === 0 || // First page
                  i === pagination.totalPages - 1 || // Last page
                  (i >= currentPage - 2 && i <= currentPage) || // 2 pages before current
                  (i <= currentPage + 2 && i >= currentPage) // 2 pages after current
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (
                  i === currentPage - 3 || // Show ellipsis before
                  i === currentPage + 3 // Show ellipsis after
                ) {
                  return <span key={i} className="px-2">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-1 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white disabled:bg-gray-800' 
                    : 'bg-white text-gray-700 disabled:bg-gray-100'
                } disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}