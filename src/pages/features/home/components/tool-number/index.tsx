import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import DynamicPopover from '@/shared/components/popover';
import { showToast } from '@/shared/utils/utils';
import Input from '@/shared/components/input';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@/shared/components/tabs';

import CloseIcon from "@/assets/icons/close.svg?react";

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
    watch,
  } = useForm<any>({
    mode: 'onBlur',
  });

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const subscription = watch((data) => {
      const result = filterNumbers(data.cham, data.dau, data.duoi, data.tong, data.them, data.bo);
      const resultText = result.join(', ');

      setValue(resultText);
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  function filterNumbers(cham: string, dau: string, duoi: string, tong: string, them: string, bo: string) {
    const chamNumber = extractNumber(cham);
    const dauNumber = extractNumber(dau);
    const duoiNumber = extractNumber(duoi);
    const themNumber = them.trim().split(',').filter(number => !isNaN(+number)).map(number => number.trim().padStart(2, '0'));
    const boNumber = bo.trim().split(',').filter(number => !isNaN(+number)).map(number => number.trim().padStart(2, '0'));
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

    if (them) {
      filterNumbers = [...filterNumbers, ...themNumber];
    }

    if (bo) {
      filterNumbers = filterNumbers.filter(numString =>
        !boNumber.includes(numString)
      );
    }

    return [...new Set(filterNumbers)];
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
        <textarea className='w-full h-20 outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
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
        <textarea className='w-full h-20 outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
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
    watch,
  } = useForm<any>({
    mode: 'onBlur',
  });

  const [value, setValue] = useState<string>('');

  const pairs: { [key: number]: number } = {
    0: 5,
    1: 6,
    2: 7,
    3: 8,
    4: 9,
    5: 0,
    6: 1,
    7: 2,
    8: 3,
    9: 4
  };

  useEffect(() => {
    const subscription = watch((data) => {
      const result = generatePairs(data.bo1, data.tong, data.them, data.bo);
      setValue(result);
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  function generatePairs(bo1: string, tong: string, them: string, bo: string) {
    const bo1Numbers = bo1.split(',');
    const themNumber = them.trim().split(',').filter(number => !isNaN(+number) && number !== '').map(number => number.trim().padStart(2, '0'));
    const boNumber = bo.trim().split(',').filter(number => !isNaN(+number) && number !== '').map(number => number.trim().padStart(2, '0'));

    let allPairs: string[] = [];

    for (const number of bo1Numbers) {
      // Kiểm tra đầu vào
      if (number.length !== 2 || isNaN(+number)) {
        return '';
      }

      const num1 = +number[0];
      const num2 = +number[1];

      // Lấy các số liên quan
      const relatedNum1 = pairs[num1];
      const relatedNum2 = pairs[num2];

      // Tạo các cặp số liên quan
      const resultPairs = [
        `${relatedNum1}${num2}`,
        `${num2}${relatedNum1}`,
        `${relatedNum1}${relatedNum2}`,
        `${relatedNum2}${relatedNum1}`,
        `${num1}${relatedNum2}`,
        `${relatedNum2}${num1}`,
        `${num1}${num2}`,
        `${num2}${num1}`
      ];

      allPairs = [...allPairs, ...resultPairs];
    }

    if (tong) {
      allPairs = allPairs.filter(numString =>
        sumOfDigits(numString) === +tong
      );
    }

    if (them) {
      allPairs = [...allPairs, ...themNumber];
    }

    if (bo) {
      allPairs = allPairs.filter(numString =>
        !boNumber.includes(numString)
      );
    }

    return [...new Set(allPairs)].join(', ');
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Copied successfully');
  };

  return (
    <form className='px-2 py-1'>
      <div className='flex space-x-2'>
        <Input className='border border-gray2 p-1' type='text' label='Bộ' {...register('bo1')} />
        <Input className='border border-gray2 p-1' type='text' label='Tổng' {...register('tong')} />
      </div>

      <div className='flex space-x-2 mt-2'>
        <Input className='border border-gray2 p-1' type='text' label='Thêm' {...register('them')} />
        <Input className='border border-gray2 p-1' type='text' label='Bỏ' {...register('bo')} />
      </div>

      <div className='mt-2'>
        <textarea className='w-full h-20 outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
      </div>

      <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover' onClick={handleCopy}>
        Sao chép
      </div>
    </form>
  )
};

export const ThreeDNumber = () => {
  const [value, setValue] = useState<string>('');

  const {
    register,
    watch,
  } = useForm<any>({
    mode: 'onBlur',
  });

  useEffect(() => {
    const subscription = watch((data) => {
      const result = generateNumberStrings(data.cang, data.dan, data.them, data.bo)
      setValue(result);
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  const generateNumberStrings = (cang: string, dan: string, them: string, bo: string) => {
    const cangNumber = cang.trim().split(',').filter(number => !isNaN(+number) && number !== '').map(number => number.trim());
    const danNumber = dan.trim().split(',').filter(number => !isNaN(+number) && number !== '').map(number => number.trim());
    const themNumber = them.trim().split(',').filter(number => !isNaN(+number)).map(number => number.trim().padStart(2, '0'));
    const boNumber = bo.trim().split(',').filter(number => !isNaN(+number)).map(number => number.trim().padStart(2, '0'));

    let result = [];

    for (let i = 0; i < cangNumber.length; i++) {
      for (let j = 0; j < danNumber.length; j++) {
        result.push(`${cangNumber[i]}${danNumber[j]}`);
      }
    }

    if (them) {
      result = [...result, ...themNumber];
    }

    if (bo) {
      result = result.filter(numString =>
        !boNumber.includes(numString)
      );
    }

    return [...new Set(result)].join(', ');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Copied successfully');
  };

  return (
    <form className='px-2 py-1'>
      <div className='flex space-x-2'>
        <div className='w-1/3'>
          <Input className='border border-gray2 p-1' type='text' label='Càng' {...register('cang')} />
        </div>
        <Input className='border border-gray2 p-1' type='text' label='Dàn 2D - 3D' {...register('dan')} />
      </div>

      <div className='flex space-x-2 mt-2'>
        <Input className='border border-gray2 p-1' type='text' label='Thêm' {...register('them')} />
        <Input className='border border-gray2 p-1' type='text' label='Bỏ' {...register('bo')} />
      </div>

      <div className='mt-2'>
        <textarea className='w-full h-20 outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
      </div>

      <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover' onClick={handleCopy}>
        Sao chép
      </div>
    </form>
  );
};

export const Xien2Number = () => {
  const {
    register,
    watch,
  } = useForm<any>({
    mode: 'onBlur',
  });

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const subscription = watch((data) => {
      const result = handleGenNumbers(data.bo);
      setValue(result);
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Copied successfully');
  };

  const handleGenNumbers = (bo: string) => {
    const boNumber = bo.trim().split(',').filter(number => !isNaN(+number) && number !== '').map(number => number.trim());
    const combinations = [];

    for (let i = 0; i < boNumber.length; i++) {
      for (let j = i + 1; j < boNumber.length; j++) {
        combinations.push(`${boNumber[i]}&${boNumber[j]}`);
      }
    }

    return [...new Set(combinations)].join(', ');
  };

  return (
    <form className='px-2 py-1'>
      <div className='flex space-x-2'>
        <textarea className='w-full h-20 border border-gray2 p-1' placeholder='Bộ số' {...register('bo')}></textarea>
      </div>

      <div className='mt-2'>
        <textarea className='w-full h-20 outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
      </div>

      <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover' onClick={handleCopy}>
        Sao chép
      </div>
    </form>
  )
};

export const XienNumber = () => {
  const [number, setNumber] = useState<number>(2);
  const [value, setValue] = useState<string>('');

  const numberRef = useRef<number>(number);

  const {
    register,
    watch,
    getValues,
  } = useForm<any>({
    mode: 'onBlur',
  });

  useEffect(() => {
    const subscription = watch((data) => {
      const result = handleGenNumbers(data.bo, numberRef.current);
      setValue(result);
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  useEffect(() => {
    if (number) {
      const data = getValues();
      const result = handleGenNumbers(data.bo, number);
      setValue(result);

      numberRef.current = number;
    }
  }, [number])

  const handleChange = (value: number) => {
    setNumber(value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Copied successfully');
  };

  const handleGenNumbers = (bo: string, combinationLength: number) => {
    const boNumber = bo.trim().split(',').filter(number => !isNaN(+number) && number !== '').map(number => number.trim());
    const combinations: any = [];
  
    function combine(prefix: string[], start: number) {
      if (prefix.length === combinationLength) {
        combinations.push(prefix.join('&'));
        return;
      }
      
      for (let i = start; i < boNumber.length; i++) {
        combine([...prefix, boNumber[i]], i + 1);
      }
    }
    
    combine([], 0);

    return [...new Set(combinations)].join(', ');
  };

  return (
    <div>
      <div className='flex space-x-4 p-1.5'>
        <div className={classNames('py-1.5 px-4 text-center border border-gray2 rounded-md w-full cursor-pointer', {
          'bg-primary text-white': number === 2
        })} onClick={() => handleChange(2)}>
          Xiên 2
        </div>
        <div className={classNames('py-1.5 px-4 text-center border border-gray2 rounded-md w-full cursor-pointer', {
          'bg-primary text-white': number === 3
        })} onClick={() => handleChange(3)}>
          Xiên 3
        </div>
        <div className={classNames('py-1.5 px-4 text-center border border-gray2 rounded-md w-full cursor-pointer', {
          'bg-primary text-white': number === 4
        })} onClick={() => handleChange(4)}>
          Xiên 4
        </div>
      </div>

      <form className='px-2 py-1'>
        <div className='flex space-x-2'>
          <textarea className='w-full h-20 border border-gray2 p-1' placeholder='Bộ số' {...register('bo')}></textarea>
        </div>

        <div className='mt-2'>
          <textarea className='w-full h-20 outline-none border border-gray2 p-1' value={value} disabled placeholder='Kết quả ...'></textarea>
        </div>

        <div className='border border-gray2 rounded-md text-center p-1 cursor-pointer duration-300 text-white bg-primary hover:bg-primaryHover' onClick={handleCopy}>
          Sao chép
        </div>
      </form>
    </div>
  )
}

const ToolNumber = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  const popoverRef: any = useRef();
  const popoverRef2: any = useRef();
  const popoverRef3: any = useRef();

  const handleClose = () => {
    popoverRef.current.closePopover();
  };

  const handleClose2D = () => {
    popoverRef2.current.closePopover();
  };

  const handleCloseXien = () => {
    popoverRef3.current.closePopover();
  };

  const handleCloseAllPopover = () => {
    popoverRef.current.closePopover();
    popoverRef2.current.closePopover();
    popoverRef3.current.closePopover();
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
              <div className='bg-gray2 rounded-full flex items-center justify-center w-10 h-10 font-semibold cursor-pointer hover:text-white hover:bg-primaryHover duration-150' onClick={handleCloseAllPopover}>
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
          <DynamicPopover
            ref={ popoverRef2 }
            padding={10}
            positions={['left', 'top']}
            triggerElm={
              <div className='bg-gray2 rounded-full flex items-center justify-center w-10 h-10 font-semibold cursor-pointer hover:text-white hover:bg-primaryHover duration-150' onClick={handleCloseAllPopover}>
                3D
              </div>
            }
            content={
              <div className="shadow-2xl bg-white p-1 w-[315px] border border-gray2 rounded-md flex flex-col">
                <div className='flex items-center justify-between px-1'>
                  <p className='font-semibold'>Ghép dàn 3D/4D</p>
                  <div className='text-xs cursor-pointer' onClick={handleClose2D}>
                    <CloseIcon />
                  </div>
                </div>
                <ThreeDNumber />
              </div>
            }
          />
          <DynamicPopover
            ref={ popoverRef3 }
            padding={10}
            positions={['left', 'top']}
            triggerElm={
              <div className='bg-gray2 rounded-full flex items-center justify-center w-10 h-10 font-semibold cursor-pointer hover:text-white hover:bg-primaryHover duration-150' onClick={handleCloseAllPopover}>
                Xiên
              </div>
            }
            content={
              <div className="shadow-2xl bg-white p-1 w-[315px] border border-gray2 rounded-md flex flex-col">
                <div className='flex items-center justify-between px-1'>
                  <p className='font-semibold'>Ghép lô xiên</p>
                  <div className='text-xs cursor-pointer' onClick={handleCloseXien}>
                    <CloseIcon />
                  </div>
                </div>
                <XienNumber />
              </div>
            }
          />
        </div>
      }
    </div>
  );
};

export default ToolNumber;
