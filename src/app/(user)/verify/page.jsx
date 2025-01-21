'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod"
import { BusinessCardModal } from '../../../components/businessCardModal';

// Email verification schema
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Business card schema
const businessCardSchema = z.object({
  // Personal Info
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title is required'),
  
  // Contact Info
  phone: z.string().min(10, 'Invalid phone number'),
  // email: z.string().email('Invalid email address'),
  
  // Business Info
  companyName: z.string().min(2, 'Company name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  
  // Additional fields
  redeemCode: z.string().optional(),
  
  // Optional fields with default empty values
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.string()
  })).optional().default([])
});

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const redeemCode = sessionStorage.getItem('redeemCode');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(emailSchema)
  });

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const onEmailSubmit = async (data) => {
    try {
      setIsLoading(true);
      setUserEmail(data.email);
      
      const response = await fetch('http://localhost:3006/api/tokens/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      const result = await response.json();
      
      // Only set isVerifying to true if the code was sent successfully
      if (result.message === 'Verification code sent successfully') {
        setIsVerifying(true);
        // Optionally start the resend timer here
        setCanResend(false);
        setTimer(30);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyCode = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/tokens/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code: verificationCode,
          email: userEmail
        })
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();
      if (data.message === 'Code verified successfully') {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setCanResend(false);
      setTimer(30); // Start 30 second countdown

      const response = await fetch('http://localhost:3006/api/tokens/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail
        })
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification code');
      }
    } catch (error) {
      console.error('Error resending code:', error);
    } finally {
      setIsLoading(false);
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
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {isVerifying ? 'Verify Your Email' : 'Welcome'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isVerifying 
                ? 'Please enter the verification code sent to your email'
                : 'Enter your email address to get started'}
            </p>
          </div>

          {!isVerifying ? (
            <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-black placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ✉️
                  </span>
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-black"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                </div>
              </div>
              <button
                onClick={onVerifyCode}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Verify Code
              </button>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleResendCode}
                  disabled={!canResend || isLoading}
                  className={`w-full text-sm px-4 py-2 rounded-md transition-colors duration-200 
                    ${canResend 
                      ? 'text-blue-600 hover:bg-blue-50' 
                      : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? (
                    'Sending...'
                  ) : canResend ? (
                    'Resend Code'
                  ) : (
                    `Resend code in ${timer}s`
                  )}
                </button>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="w-full text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  Back to Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BusinessCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        schema={businessCardSchema}
        email={userEmail}
        redeemCode={redeemCode}
      />
    </div>
  );
}
  