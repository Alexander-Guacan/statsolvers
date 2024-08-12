import { Download } from '@mui/icons-material'
import { LinkButton } from '../components/common/LinkButton'
import { LinkIcon } from '../components/common/LinkIcon'
import { useState } from 'react'
import './Home.css'

export function Home() {
  const [csvUrl] = useState('https://www.kaggle.com/datasets/juanmerinobermejo/smartphones-price-dataset')

  return (
    <main className='main presentation'>
      <span className='presentation__greeting'>Bievenido a </span>
      <h2 className='logo__text presentation__title'><span className='lighted-text'>statsolvers</span></h2>
      <p className='presentation__description'>
        Nos especializamos en la creación de software avanzado para el análisis estadístico, diseñado para transformar datos en decisiones inteligentes. En esta página, te invitamos a explorar un ejemplo concreto de lo que nuestro software puede hacer. Hemos aplicado nuestro análisis estadístico a un dataset público llamado Smartphones, revelando puntos clave que ilustran la capacidad de nuestra herramienta para manejar y extraer valor de grandes volúmenes de datos.
      </p>
      <footer className='presentation__footer'>
        <LinkButton to='/numeric'>Comenzar</LinkButton>
        <LinkIcon to={csvUrl} target={'_blank'} icon={<Download />} className={'link-icon--gray'}>
          Descargar CSV
        </LinkIcon>
      </footer>
    </main>
  )
}