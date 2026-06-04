import { useNavigate, useLocation } from 'react-router-dom'

interface UseScrollToSectionReturn {
  scrollTo: (sectionId: string) => void
}

export function useScrollToSection(): UseScrollToSectionReturn {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollTo = (sectionId: string) => {
    const doScroll = () => {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    if (location.pathname === '/') {
      doScroll()
    } else {
      navigate('/')
      // Wait for page mount then scroll
      setTimeout(doScroll, 400)
    }
  }

  return { scrollTo }
}
