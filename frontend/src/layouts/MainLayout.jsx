// MainLayout.jsx
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const SIDEBAR_WIDTH = "280px";

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div style={{ marginLeft: SIDEBAR_WIDTH }} className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>

    );
};

export default MainLayout;