'use client';

import loadingAnimation from '@assets/lotties/loading.json';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import React from 'react';

const Page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-project_black">
      <Lottie animationData={loadingAnimation} />
    </div>
  );
};

export default Page;
