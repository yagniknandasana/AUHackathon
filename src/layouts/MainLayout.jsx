import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '2rem' }}>
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;
