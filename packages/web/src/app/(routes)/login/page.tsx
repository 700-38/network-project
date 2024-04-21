'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Corrected import for useRouter

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);

  const [isUsernameExist, setIsUsernameExist] = useState(false);

  const handleRegister = async () => {
    try {
      setIsUsernameExist(true);
      // Register user with email and password
      //   const userCredential = await createUserWithEmailAndPassword(
      //     auth,
      //     email,
      //     password
      //   );
      //   localStorage.setItem('token', await userCredential.user.getIdToken());
      // Optional: Update user profile or link phone number here
      //   router.push('/success'); // Corrected the route
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-project_black px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border-2 border-project_gray bg-project_black p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-project_white">
            Enter your username
          </h2>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>
        <form className="space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Username
              </label>
              <input
                id="email-address"
                name="username"
                type="text"
                required
                className={`relative block w-full ${isUsernameExist ? 'rounded-t-md' : 'rounded-md'} appearance-none bg-project_gray px-3 py-2 text-project_white placeholder-project_light_gray focus:outline-none sm:text-sm`}
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {isUsernameExist && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={handleRegister}
              className="group relative flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
