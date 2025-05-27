import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    role?: string;
    isAdmin?: () => boolean;
  };
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline">{user.name}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            {(user.role === 'admin' || (typeof user.isAdmin === 'function' && user.isAdmin())) && (
              <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                Admin
              </span>
            )}
          </div>

          <Link
            href="/settings/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-2" />
            Mon profil
          </Link>

          <Link
            href="/settings/appearance"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Apparence
          </Link>

          {(user.role === 'admin' || (typeof user.isAdmin === 'function' && user.isAdmin())) && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              Administration
            </Link>
          )}

          <div className="border-t">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              preserveScroll
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
