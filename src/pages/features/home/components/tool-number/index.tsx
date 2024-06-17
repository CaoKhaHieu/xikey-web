import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import DynamicPopover from '@/shared/components/popover';

import CloseIcon from "@/assets/icons/close.svg?react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@/shared/components/tabs';
import { useForm } from 'react-hook-form';
import Input from '@/shared/components/input';
import { showToast } from '@/shared/utils/utils';

// function generateNumberStrings() {
//   return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
// }

// const extractNumber = (text: string) => {
//   const matches = text.match(/\d/g);
//   return matches ? matches : [];
// };

function extractNumber(text: string): string[] {
  const matches = text.match(/\d/g);
  return matches ? matches : [];
}

function sumOfDigits(numString: string): number {
  return numString.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Function to generate an array of strings from 00 to 99
function generateNumberStrings(): string[] {
  return Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));
}

export const ChamContent = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    mode: 'onBlur',
  });

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const subscription = watch((data) => {
      const result = filterNumbers(data.cham, data.dau, data.duoi, data.tong);
      const resultText = result.join(',');

      setValue(resultText);
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  function filterNumbers(cham: string, dau: string, duoi: string, tong: string,) {
    const chamNumber = extractNumber(cham);
    const dauNumber = extractNumber(dau);
    const duoiNumber = extractNumber(duoi);
    const numberStrings = generateNumberStrings();
    
    let filterNumbers = numberStrings.filter(numString =>
      chamNumber.some(digit => numString.includes(digit))
    );
    
    // Further filter based on dauNumber
    if (dauNumber.length) {
      filterNumbers = filterNumbers.filter(numString =>
        dauNumber.includes(numString.charAt(0))
      );
    }

    if (duoiNumber.length) {
      // Further filter based on duoiNumber
      filterNumbers = filterNumbers.filter(numString =>
        duoiNumber.some(digit => numString.endsWith(digit))
      );
    }

    if (tong) {
      filterNumbers = filterNumbers.filter(numString =>
        sumOfDigits(numString) === +tong
      );
    }

    return filterNumbers;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Copied successfully');
  };

  return (
    <form className='px-2 py-1'>
      <div className='flex space-x-2'>
        <Input className='border border-gray2 p-1' type='text' label='Chạm' {...register('cham')} />
        <Input className='border border-gray2 p-1' type='text' label='Đầu' {...register('dau')} />
        <Input className='border border-gray2 p-1' type='text' label='Đuôi' {...register('duoi')} />
        <Input className='border border-gray2 p-1' type='text' label='Tổng' {...register('tong')} />
      </div>

      <div className='flex space-x-2 mt-2'>
        <Input className='border border-gray2 p-1' type='text' label='Thêm' {...register('them')} />
        <Input className='border border-gray2 p-1' type='text' label='Bỏ' {...register('bo')} />
      </div>

      <div className='mt-2'>
        <textarea className='w-full outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
      </div>

      <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover' onClick={handleCopy}>
        Sao chép
      </div>
    </form>
  )
};

export const KepContent = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: 'onBlur',
  });
  const [value, setValue] = useState<string>('');

  const kepbang = '00,55,11,66,22,77,33,88,44,99';
  const keplech = '05,50,16,61,27,72,38,83,49,94';
  const kepam = '07,70,14,41,29,92,36,63,58,85';
  const satkep = '07,70,14,41,29,92,36,63,58,85';

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Copied successfully');
  };

  return (
    <form className='px-2 py-1'>
      <div className='grid grid-cols-2 gap-2'>
        <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 hover:bg-primaryHover hover:text-white' onClick={() => setValue(kepbang)}>
          Kép bằng
        </div>
        <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 hover:bg-primaryHover hover:text-white' onClick={() => setValue(kepam)}>
          Kép âm
        </div>
        <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 hover:bg-primaryHover hover:text-white' onClick={() => setValue(keplech)}>
          Kép lệch
        </div>
        <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 hover:bg-primaryHover hover:text-white' onClick={() => setValue(satkep)}>
          Sát kép
        </div>
      </div>

      <div className='mt-2'>
        <textarea className='w-full outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
      </div>

      <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover' onClick={handleCopy}>
        Sao chép
      </div>
    </form>
  )
};

export const BoContent = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: 'onBlur',
  });

  return (
    <form className='px-2 py-1'>
      <div className='flex space-x-2'>
        <Input className='border border-gray2 p-1' type='number' label='Bộ' {...register('name')} />
        <Input className='border border-gray2 p-1' type='number' label='Tổng' {...register('name')} />
      </div>

      <div className='flex space-x-2 mt-2'>
        <Input className='border border-gray2 p-1' type='number' label='Thêm' {...register('name')} />
        <Input className='border border-gray2 p-1' type='number' label='Bỏ' {...register('name')} />
      </div>

      <div className='mt-2'>
        <textarea className='w-full outline-none border border-gray2 p-1' disabled placeholder='Kết quả ...'></textarea>
      </div>

      <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover'>
        Sao chép
      </div>
    </form>
  )
};

const ToolNumber = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  const popoverRef: any = useRef();

  const handleClose = () => {
    popoverRef.current.closePopover();
  };

  return (
    <div>
      {
        currentConversation.id &&
        <div className='tools-number fixed top-1/2 right-0 -translate-y-1/2 flex flex-col space-y-2'>
          <DynamicPopover
            ref={ popoverRef }
            padding={10}
            positions={['left', 'top']}
            triggerElm={
              <div className='bg-gray2 rounded-full flex items-center justify-center w-10 h-10 font-semibold cursor-pointer hover:text-white hover:bg-primaryHover duration-150'>
                2D
              </div>
            }
            content={
              <div className="shadow-2xl bg-white p-1 w-[315px] border border-gray2 rounded-md flex flex-col">
                <div className='flex items-center justify-between px-1'>
                  <p className='font-semibold'>Tạo dàn số 2D</p>
                  <div className='text-xs cursor-pointer' onClick={handleClose}>
                    <CloseIcon />
                  </div>
                </div>

                <Tabs defaultTab={0}>
                  <TabList>
                    <Tab>
                      <p>Chạm</p>
                    </Tab>
                    <Tab>
                      <p>Kép</p>
                    </Tab>
                    <Tab>
                      <p>Bộ</p>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <ChamContent />
                    </TabPanel>
                    <TabPanel>
                      <KepContent />
                    </TabPanel>
                    <TabPanel>
                      <BoContent />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>
            }
          />
          {/* <DynamicPopover
            ref={ popoverRef }
            positions={['left', 'top']}
            triggerElm={
              <div className='bg-gray2 rounded-full flex items-center justify-center w-10 h-10 font-semibold cursor-pointer hover:text-white hover:bg-primaryHover duration-150'>
                3D
              </div>
            }
            content={
              <div className="shadow-2xl bg-white px-8 py-3 w-44 border border-gray2 rounded-md flex flex-col space-y-2">
                cdcas
              </div>
            }
          />
          <DynamicPopover
            ref={ popoverRef }
            positions={['left']}
            triggerElm={
              <div className='bg-gray2 rounded-full flex items-center justify-center w-10 h-10 font-semibold cursor-pointer hover:text-white hover:bg-primaryHover duration-150'>
                Xiên
              </div>
            }
            content={
              <div className="shadow-2xl bg-white px-8 py-3 w-44 border border-gray2 rounded-md flex flex-col space-y-2">
                cdcas
              </div>
            }
          /> */}
        </div>
      }
    </div>
  );
};

export default ToolNumber;
