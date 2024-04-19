'use client';

import loadingAnimation from '@assets/lotties/loading.json';
import Lottie from 'lottie-react';
import React from 'react';

const Page = () => {
  return (
    <div className="bg-project_black flex h-screen w-full items-center justify-center">
      <Lottie animationData={loadingAnimation} />
    </div>
  );
};

export default Page;
