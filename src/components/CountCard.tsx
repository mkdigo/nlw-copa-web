import Image from 'next/image';

type Props = {
  imgSrc: string;
  count: string;
  text: string;
};

export function CountCard({ imgSrc, count, text }: Props) {
  return (
    <div className='flex items-center gap-6'>
      <Image src={imgSrc} alt='' />
      <div className='flex flex-col'>
        <span className='font-bold text-2xl'>+{count}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
