import React, { FC } from 'react';

interface Props {
  black?: boolean;
}

const BouncingDotsLoader: FC<Props> = ({ black = false }) => {
  return black ? (
    <div className="flex items-center justify-center gap-1 p-1">
      <div className="animate-bouncing-loader bg-ss_gray-200 h-2 w-2 rounded-full opacity-100"></div>
      <div
        className="animate-bouncing-loader bg-ss_gray-200 h-2 w-2 rounded-full opacity-100"
        style={{ animationDelay: '0.2s' }}></div>
      <div
        className="animate-bouncing-loader bg-ss_gray-200 h-2 w-2 rounded-full opacity-100"
        style={{ animationDelay: '0.4s' }}></div>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-1 p-1">
      <div className="animate-bouncing-loader h-2 w-2 rounded-full bg-white opacity-100"></div>
      <div
        className="animate-bouncing-loader h-2 w-2 rounded-full bg-white opacity-100"
        style={{ animationDelay: '0.2s' }}></div>
      <div
        className="animate-bouncing-loader h-2 w-2 rounded-full bg-white opacity-100"
        style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default BouncingDotsLoader;
