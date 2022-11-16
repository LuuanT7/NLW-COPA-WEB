import Image from 'next/image'
import appPreviewImage from '../assets/app-preview.png'
import logoImage from '../assets/svg/logo.svg'
import avatares from '../assets/avatares.png'
import Icon from '../assets/svg/checkIcon.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')


  async function createPool (event: FormEvent) {
    //usado para previnir o  corportamento padrão de recarregar a pagina quando der o submit
    event.preventDefault()

    try{
      const response = await api.post('pools',{
        title: poolTitle,
      })
      const {code} = response.data
      console.log(code)

      // usado para copiar algo diretmente para o Ctrl C do usuário 
      await navigator.clipboard.writeText(code)
      alert('Bolão criado com sucesso, código copiado para área de transferencia!')

      setPoolTitle('')


    }catch (err){
      console.log(err)
      alert('Falha ao criar o Bolão, tente novamente !')
    }


  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2  items-center gap-28'>
      <main>
        <Image src={logoImage} alt="Logo"  />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu própior bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={avatares} alt='' />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span>  pessoas já estão usando
          </strong>
        </div>

          <form onSubmit={createPool}className="mt-10 flex gap-2 ">
            <input 
            className='flex 1 px-6 py-4 rounded bg-gray-800  border border-gray-600 text-sm text-gray-100' 
            type="text"
            required 
            placeholder="Qual nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />

          <button 
            type="submit"
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
          >
            criar meu bolão
          </button>
          </form>
          <p className='text-gray-100 mt-4 text-sm leading-relaxed'>
            Após criar seu bolão, você receberá um código único que poderá usar
            para convidar outras pessoas 🚀
          </p>

          <div className='mt-10 pt-10 border-t border-gray-600  items-center flex justify-between text-gray-100'>
            <div className='flex items-center gap-6 '>
              <Image
                src={Icon}
                alt="Dois Celulares com previa do App NLW_COPA"
                quality={100}
              />

              <div className=' flex flex-col '>
                <span className='font-bold text-2xl'>+{props.poolCount} </span>
                <span>Bolões Criados</span>               
              </div>
            </div>

            <div className='w-px h-14 bg-gray-600'/>

            <div className=' flex items-center gap-6 '>
              <div>
                <Image src={Icon} alt="" quality={100} />
              </div>
              <div className=' flex flex-col'>
                <span className='font-bold text-2xl'>+{props.guessCount} </span>
                <span>Palpites enviados</span>               
            </div>
           </div>
          </div>
        
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois Celulares com previa do App NLW_COPA"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async ()=>{
  const [
    poolCountResponse,
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])
  
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count
    }
  }
}
