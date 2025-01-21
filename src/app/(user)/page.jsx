'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function Home() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {

    try {
      // Call the coupon validation API
      const response = await fetch('http://localhost:3006/api/admin/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventCode: data.eventCode }),
      });

      const result = await response.json();

      if (response.ok && result.isValid) {
        // Store the event code in sessionStorage if valid
        sessionStorage.setItem('redeemCode', data.eventCode);
        // Navigate to verify page
        router.push('/verify');
      } else {
        toast.error('Invalid event code');
      }
    } catch (error) {
      console.error('Error:', error);

    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2340')",
        backgroundColor: 'rgba(243, 244, 246, 0.95)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 bg-white/80 backdrop-blur-sm rounded-lg p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to EventConnect
          </h1>
          <p className="text-lg text-gray-600">
            Join your event by entering the event code below
          </p>
        </div>

        {/* Event Code Form */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg mb-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="eventCode" className="block text-sm font-medium text-gray-700">
                Event Code
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="text"
                  id="eventCode"
                  {...register('eventCode')}
                  placeholder="Enter your event code"
                  className="block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Redeem
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Interaction</h3>
            <p className="text-gray-600">Connect with other participants instantly during the event.</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Access</h3>
            <p className="text-gray-600">Simple one-code entry to join any event seamlessly.</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Features</h3>
            <p className="text-gray-600">Participate in polls, Q&As, and discussions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
