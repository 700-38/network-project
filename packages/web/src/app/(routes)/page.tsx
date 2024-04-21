'use client';

import { RealmContext } from '@/context/realm';
import loadingAnimation from '@assets/lotties/loading.json';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const Page = () => {
  const Realm = useContext(RealmContext);

  const router = useRouter();

  useEffect(() => {
    const login = async () => {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (!username || !password) {
        console.log('no username or password');
        router.push('/login');
        return;
      }

      await Realm.login(username, password);
    };

    login();
  }, []);

  useEffect(() => {
    if (Realm.realm?.isLoggedIn) {
      router.push('/chat');
    }
  }, [Realm.realm?.isLoggedIn]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-project_black">
      <Lottie animationData={loadingAnimation} />
    </div>
  );
};

export default Page;
