'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    Menu,
    LogOut, 
    Settings, 
    LayoutGrid, 
    Search, 
    RefreshCwOff,
    RefreshCcwDot,
    BookLock,
    Sun, 
    Moon,
    Trash2
  } from 'lucide-react';
  import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// Define the schema for coupon form validation
const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validTo: z.string().min(1, 'Valid to date is required')
}).refine(data => new Date(data.validTo) >= new Date(data.validFrom), {
  message: 'Valid to date cannot be earlier than valid from date',
  path: ['validTo'], // This will attach the error to the validTo field
});

export default function CouponsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema)
  });
  const router = useRouter();
  const token = Cookies.get('authToken');


  useEffect(() => {
    fetchCoupons();
  }, [currentPage, searchTerm]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3006/api/admin/coupons', {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm
        },
        headers: {
            Authorization: `Bearer ${token}`
          }
      });
      console.log(response.data);
      setCoupons(response.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:3006/api/admin/coupons', data,{ headers: {
        Authorization: `Bearer ${token}`
      }});
      toast.success('Coupon created successfully!');
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  const handleLogout = () => {
    // Clear the auth token cookie
    Cookies.remove('authToken');
    // Redirect to admin login page
    router.push('/admin');
  };
  const togglePublish = async (id, publish) => {
    try {
      await axios.patch(`http://localhost:3006/api/admin/coupons/${id}/publish`, { isPublished: publish },{ headers: {
        Authorization: `Bearer ${token}`
      }});
      toast.success(`Coupon ${publish ? 'published' : 'unpublished'} successfully!`);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update coupon status');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3006/api/admin/coupons/${couponToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Coupon deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
<div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <img src="https://www.solulab.com/wp-content/themes/Avada/assets/images/solulab-logo-dark-75.png" alt="Logo" className="h-8 mx-auto" />
        </div>
        <nav className="mt-8">
          <a href="/admin/dashboard" className={`flex items-center p-4 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <LayoutGrid className="h-6 w-6" />
            {sidebarOpen && <span className="ml-4">Dashboard</span>}
          </a>
          <a  href="/admin/coupons" className={`flex items-center p-4 ${
            darkMode 
              ? 'text-white bg-gray-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}>
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
<main>
<div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Coupon
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`p-6 rounded-md shadow-md w-96 ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <h2 className="text-xl font-bold mb-4">Create Coupon</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  {...register('code')}
                  className={`mt-1 block w-full p-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  }`}
                  placeholder="Enter coupon code"
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valid From</label>
                <input
                  {...register('validFrom')}
                  type="date"
                  className={`mt-1 block w-full p-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                {errors.validFrom && <p className="text-red-500 text-sm">{errors.validFrom.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valid To</label>
                <input
                  {...register('validTo')}
                  type="date"
                  className={`mt-1 block w-full p-2 border rounded-md ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  }`}
                />
                {errors.validTo && <p className="text-red-500 text-sm">{errors.validTo.message}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-gray-700">
          <thead className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-700'}`}>
            <tr>
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Valid From</th>
              <th className="p-4 text-left">Valid To</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'}`}>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-8">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : coupons?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8">
                  <div className="text-gray-500">No coupons found</div>
                </td>
              </tr>
            ) : (
              coupons?.map((coupon) => (
                <tr key={coupon._id} className="border-b border-gray-200">
                  <td className="p-4">{coupon.code}</td>
                  <td className="p-4">{new Date(coupon.validFrom).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(coupon.validTo).toLocaleDateString()}</td>
                  <td className="p-4">{coupon.isPublished ? 'Published' : 'Unpublished'}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      onClick={() => togglePublish(coupon._id, !coupon.isPublished)}
                      className={`px-3 py-1 rounded-md ${
                        !coupon.isPublished ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      } hover:${!coupon.isPublished ? 'bg-red-600' : 'bg-green-600'}`}
                    >
                      {coupon.isPublished ? <RefreshCcwDot /> :  <RefreshCwOff />}
                    </button>
                    <button
                      onClick={() => {
                        setCouponToDelete(coupon._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && coupons?.length > 0 && pagination?.total > 10 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {[...Array(pagination?.totalPages)].map((_, i) => {
            if (
              i === 0 || // First page
              i === pagination?.totalPages - 1 || // Last page
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
            onClick={() => setCurrentPage(Math.min(pagination?.totalPages, currentPage + 1))}
            disabled={currentPage === pagination?.totalPages}
            className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
</main>

      </div>
      {isDeleteModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className={`p-6 rounded-md shadow-md w-96 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}>
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this coupon?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </div>

 

  );
}