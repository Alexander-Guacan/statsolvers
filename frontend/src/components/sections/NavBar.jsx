import './NavBar.css'
import LogoIcon from './../../assets/statsolvers-icon.webp'
import { Link } from 'react-router-dom'
import { LinkIcon } from '../common/LinkIcon'
import { Download } from '@mui/icons-material'
import { useState } from 'react'

export function NavBar() {
  const [csvUrl] = useState('https://www.kaggle.com/datasets/juanmerinobermejo/smartphones-price-dataset')
  
  const pages = [
    {
      url: "/numeric",
      text: "Numéricas"
    },
    {
      url: "/categoric",
      text: "Categóricas"
    },
    {
      url: "/bivariable",
      text: "Bivariable"
    }
  ]

  return (
    <header className="navbar">
      <Link className='logo' to={'/'}>
        <img className='logo__icon lighted-img' src={LogoIcon} alt="statsolvers icon" />
        <h1 className='logo__text'><span className='lighted-text'>statsolvers</span></h1>
      </Link>

      <nav>
        <ul className='menu'>
          {
            pages.map((page, index) => (
              <li key={index}>
                <Link className='link' to={page.url} >{page.text}</Link>
              </li>

            ))
          }
          <LinkIcon to={csvUrl} target={'_blank'} icon={<Download />} className={'link-icon--gray'}>
          Descargar CSV
        </LinkIcon>
        </ul>
      </nav>
    </header>
  )
}