import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

export default function ThemeToggle() {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)

  const getIcon = () => {
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) return <Monitor size={20} />
    return theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />
  }

  const handleThemeChange = (newTheme) => {
    if (newTheme === 'light') setLightTheme()
    else if (newTheme === 'dark') setDarkTheme()
    else setSystemTheme()
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Toggle theme"
      >
        {getIcon()}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  theme === 'light' && localStorage.getItem('theme') ? 'text-primary font-semibold' : ''
                }`}
              >
                <Sun size={18} />
                <span>Light</span>
              </button>
              
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  theme === 'dark' && localStorage.getItem('theme') ? 'text-primary font-semibold' : ''
                }`}
              >
                <Moon size={18} />
                <span>Dark</span>
              </button>
              
              <button
                onClick={() => handleThemeChange('system')}
                className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  !localStorage.getItem('theme') ? 'text-primary font-semibold' : ''
                }`}
              >
                <Monitor size={18} />
                <span>System</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
