import { useSidebar } from '@/context/SidebarContext';
import Sidebar from "../components/Sidebar";      // ← ADD THIS LINE
import Navbar from "../components/Navbar";        // assuming you have this too

const MainLayout = ({ children }) => {
    const { collapsed } = useSidebar();

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div
                className="flex-1 flex flex-col transition-all duration-300"
                style={{ marginLeft: collapsed ? '64px' : '280px' }}
            >
                <Navbar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
};

export default MainLayout;