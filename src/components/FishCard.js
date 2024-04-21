`useclient`
import React from 'react';

const FishData = ({icon, name, chance}) => {
  return (
    <div className='flex flex-row gap-4 px-6 py-2 hover:bg-sky-200 place-items-center'>
        <div className='h-full w-10'>
                {icon && (
                <img 
                    src={icon}
                    className="block w-10 h-10"
                    style={{imageRendering: 'pixelated'}}
                />
                )}
            </div>
        <div className='grid auto-rows-auto'>
            <span className="font-bold">
                {name}
            </span>
            <span>{chance}</span>
        </div>
    </div>
  );
};

export default FishData;
