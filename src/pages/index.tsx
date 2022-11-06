import { FormEvent, useState } from 'react';
import Image from 'next/image';

import { api } from '../lib/axios';

import { CountCard } from '../components/CountCard';

import imappPreviewImg from '../assets/app-nlw-copa-preview.png';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import logoImg from '../assets/logo.svg';
import iconCheckImg from '../assets/icon-check.svg';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('tes');

  async function createPool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const { code } = response.data;
      setPoolTitle('');

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);

        alert(
          'Bolão criado com sucesso, o código foi copiado para a área de transferência!'
        );
      } else {
        alert(`Bolão criado com sucesso, o código é ${code}`);
      }
    } catch (err) {
      console.log(err);
      alert('Falha ao criar o bolão, tente novamente.');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImg} alt='NLW Copa' quality={100} />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt='' quality={100} />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>
              +{Number(userCount).toLocaleString('BR')}
            </span>{' '}
            pessoas já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={createPool}>
          <input
            type='text'
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            placeholder='Qual nome do seu bolão?'
            required
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
          />
          <button
            type='submit'
            className='bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700'
          >
            Criar seu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100'>
          <CountCard
            imgSrc={iconCheckImg}
            count={Number(poolCount).toLocaleString('BR')}
            text='Bolões criados'
          />

          <div className='w-px h-14 bg-gray-600'></div>

          <CountCard
            imgSrc={iconCheckImg}
            count={Number(guessCount).toLocaleString('BR')}
            text='Palpites enviados'
          />
        </div>
      </main>

      <Image
        src={imappPreviewImg}
        alt='Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa'
        quality={100}
        priority
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
