import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, LayoutDashboard, ShieldCheck, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  function handleLogout() {
    logout()
    setProfileOpen(false)
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/admin', label: 'Admin' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-navy-900 tracking-tight">
          <div className="bg-navy-900 p-1.5 rounded-lg">
            <ShieldCheck className="text-saffron-500" size={20} />
          </div>
          Scheme Saathi
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
  <Link
    to="/schemes"
    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive('/schemes')
        ? 'text-navy-900 bg-navy-50'
        : 'text-gray-500 hover:text-navy-800 hover:bg-gray-50'
    }`}
  >
    Schemes
  </Link>
  {token && navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-navy-900 bg-navy-50'
                  : 'text-gray-500 hover:text-navy-800 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {token ? (
            <div className="relative ml-3">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-navy-900 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-navy-800 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-saffron-500 hover:bg-saffron-600 shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 -mr-2 text-navy-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-1 bg-white">
  <Link
    to="/schemes"
    onClick={() => setMenuOpen(false)}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
      isActive('/schemes') ? 'bg-navy-50 text-navy-900' : 'text-gray-600'
    }`}
  >
    <LayoutDashboard size={17} /> Schemes
  </Link>
  {token ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(link.to) ? 'bg-navy-50 text-navy-900' : 'text-gray-600'
                  }`}
                >
                  <LayoutDashboard size={17} /> {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600"
              >
                <LogOut size={17} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-gray-600">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-saffron-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar