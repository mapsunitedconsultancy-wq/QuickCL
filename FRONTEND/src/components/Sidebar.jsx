import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  Upload,
  Clock,
  Search,
  Users,
  Settings,
  LogOut,
  FileText,
  Image as ImageIcon,
  CreditCard
} from 'lucide-react';


const navLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },

  { to: '/extract', icon: Upload, label: 'New Extraction' },

  { to: '/image-extract', icon: ImageIcon, label: 'Image Extraction' },

  { to: '/history', icon: Clock, label: 'History' },

  { to: '/hs-lookup', icon: Search, label: 'HS Code Lookup' },

  { to: '/clients', icon: Users, label: 'Client Master' },

  { to: '/pricing', icon: CreditCard, label: 'Pricing & Plans' },

  { to: '/settings', icon: Settings, label: 'Settings' },
];


export default function Sidebar() {

  const { user, logout } = useAuth();


  return (
    <aside
      className="
        w-60
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        h-screen
        sticky
        top-0
      "
    >

      {/* =====================================================
          BRAND
      ====================================================== */}

      <div className="px-5 py-4 border-b border-gray-100">

        <div className="flex items-center gap-2">

          <div
            className="
              w-8
              h-8
              bg-blue-800
              rounded-lg
              flex
              items-center
              justify-center
            "
          >
            <FileText
              size={16}
              className="text-white"
            />
          </div>


          <div>

            <h1
              className="
                text-sm
                font-black
                text-blue-900
                leading-tight
              "
            >
              QuickCL
            </h1>


            <p
              className="
                text-[9px]
                font-semibold
                text-gray-400
                tracking-wider
              "
            >
              MAPS TECH & AI
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          flex-1
          px-3
          py-4
          space-y-1
          overflow-y-auto
        "
      >

        {navLinks.map(
          ({ to, icon: Icon, label }) => (

            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-all

                ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 font-bold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }
                `
              }
            >

              <Icon size={18} />

              <span>
                {label}
              </span>

            </NavLink>

          )
        )}

      </nav>


      {/* =====================================================
          USER + LOGOUT
      ====================================================== */}

      <div
        className="
          px-4
          py-3
          border-t
          border-gray-100
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            mb-3
          "
        >

          <div
            className="
              w-8
              h-8
              bg-blue-100
              rounded-full
              flex
              items-center
              justify-center
              text-xs
              font-bold
              text-blue-800
            "
          >
            {user?.firmName?.charAt(0) || 'U'}
          </div>


          <div
            className="
              flex-1
              min-w-0
            "
          >

            <p
              className="
                text-xs
                font-bold
                text-gray-800
                truncate
              "
            >
              {user?.firmName || 'My Firm'}
            </p>


            <p
              className="
                text-[10px]
                text-gray-400
                truncate
              "
            >
              {user?.email}
            </p>

          </div>

        </div>


        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-2
            text-xs
            text-red-600
            hover:text-red-800
            font-semibold
            transition-colors
            w-full
            px-2
            py-1.5
            rounded
            hover:bg-red-50
          "
        >

          <LogOut size={14} />

          Logout

        </button>

      </div>

    </aside>
  );
}