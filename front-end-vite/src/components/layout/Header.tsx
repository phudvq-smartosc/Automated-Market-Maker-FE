import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 text-white bg-gray-800">
            <div className="logo">
                <h1 className="text-2xl font-bold">My Website</h1>
            </div>
            <nav className="navigation">
                <ul className="flex space-x-6">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/about" className="hover:underline">About</a></li>
                    <li><a href="/services" className="hover:underline">Services</a></li>
                    <li><a href="/contact" className="hover:underline">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;