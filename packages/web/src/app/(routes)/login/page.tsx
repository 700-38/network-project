'use client';

import { RealmContext } from '@context/realm';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';

// Corrected import for useRouter

const RegisterPage = () => {
  const Realm = useContext(RealmContext);

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleNext = async () => {
    try {
      const userExist = await Realm.isUserExist(username);
      if (userExist) {
        setIsLogin(true);
      } else {
        setIsRegister(true);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRegister = () => {
    Realm.registerUser(username, password)
      .then(() => {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        router.push('/chat');
      })
      .catch((error) => {
        setError(error.message);
        console.log('Register error: ', error.message);
      });
  };

  const handleLogin = () => {
    Realm.login(username, password)
      .then(() => {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        router.push('/chat');
      })
      .catch((error) => {
        setError(error.message);
        console.log('Login error: ', error.message);
      });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-project_black px-4">
      <div className="w-full max-w-lg space-y-8 rounded-lg border-2 border-project_gray bg-project_black p-8 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-project_white">
            {!isRegister && !isLogin && 'Enter your username'}

            {isRegister && 'Enter password to register'}

            {isLogin && 'Enter password to login'}
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
                className={`relative block w-full ${isRegister || isLogin ? 'rounded-t-md' : 'rounded-md'} appearance-none bg-project_gray px-3 py-2 text-project_white placeholder-project_light_gray focus:outline-none sm:text-sm`}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {(isRegister || isLogin) && (
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
                  className="relative block w-full appearance-none rounded-none rounded-b-md border-t-[1px] border-project_light_gray bg-project_gray px-3 py-2 text-project_white placeholder:text-project_light_gray focus:outline-none sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>
          <div>
            {!isRegister && !isLogin && (
              <button
                type="button"
                onClick={handleNext}
                className="group relative flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Next
              </button>
            )}

            {isRegister && (
              <button
                type="button"
                onClick={handleRegister}
                className="group relative flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Register
              </button>
            )}

            {isLogin && (
              <button
                type="button"
                onClick={handleLogin}
                className="group relative flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
