import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout.jsx';
import SiteLayout from './components/SiteLayout.jsx';
import AccountPages from './pages/AccountPages.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import DescuentosPage from './pages/DescuentosPage.jsx';
import InfoPages from './pages/InfoPages.jsx';
import ReportesPage from './pages/ReportesPage.jsx';
import ShopPages from './pages/ShopPages.jsx';
import TicketsPage from './pages/TicketsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<AccountPages.LoginPage />} />
        <Route path="/registro" element={<AccountPages.RegisterPage />} />
        <Route path="/menu" element={<ShopPages.MenuPage />} />
        <Route path="/viajes/:slug" element={<ShopPages.TripDetailPage />} />
        <Route path="/blog" element={<InfoPages.BlogPage />} />
        <Route path="/nosotros" element={<InfoPages.AboutPage />} />
        <Route path="/servicio" element={<AccountPages.ServicePage />} />
        <Route path="/descuentos" element={<DescuentosPage />} />
        <Route path="/boletos/:saleCode" element={<TicketsPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="usuarios" element={<AdminUsersPage />} />
        <Route path="reportes" element={<ReportesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}