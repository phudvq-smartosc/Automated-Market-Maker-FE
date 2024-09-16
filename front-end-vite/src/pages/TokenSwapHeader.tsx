import React from 'react';
import BackIcon from '../components/icon/BackIcon';
import SettingsIcon from '../components/icon/SettingIcon';

const TokenSwapHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <button className="flex items-center text-gray-600">
        <BackIcon />
      </button>
      <h1 className="text-2xl text-gray-800">Add Liquidity</h1>
      <button className="text-gray-600">
        <SettingsIcon />
      </button>
    </div>
  );
};

export default TokenSwapHeader;