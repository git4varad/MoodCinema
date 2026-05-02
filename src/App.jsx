import { useCallback, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Splash from './components/Splash'
import { HomeBrowseProvider } from './context/HomeBrowseContext'
import Home from './pages/Home'
import LanguageBrowse from './pages/LanguageBrowse'
import MovieDetails from './pages/MovieDetails'
import SearchPage from './pages/SearchPage'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashFinish = useCallback(() => setShowSplash(false), [])

  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />
  }

  return (
    <HomeBrowseProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/browse/language/:code" element={<LanguageBrowse />} />
          <Route path="/details/:type/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </HomeBrowseProvider>
  )
}

export default App
