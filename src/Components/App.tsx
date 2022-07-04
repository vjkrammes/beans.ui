import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
// pages
import AboutPage from './About/AboutPage';
import AdminPage from './Admin/AdminPage';
import ArchitecturePage from './About/ArchitecturePage';
import BeanDetailsPage from './BeanDetails/BeanDetailsPage';
import DetailsPage from './Details/DetailsPage';
import ExchangePage from './Exchange/ExchangePage';
import FatalPage from './Fatal/FatalPage';
import HoldingsPage from './Holdings/HoldingsPage';
import HomePage from './Home/HomePage';
import LeaderboardPage from './Leaderboard/LeaderboardPage';
import NotFoundPage from './NotFound/NotFoundPage';
import NoticesPage from './Notices/NoticePage';
import PrivacyPage from './Privacy/PrivacyPage';
import ProfilePage from './Profile/ProfilePage';
import TradePage from './Trade/TradePage';
// Providers
import { AlertProvider } from '../Contexts/AlertContext';
import { SettingsProvider } from '../Contexts/SettingsContext';
import { UserProvider } from '../Contexts/UserContext';
// Miscellaneous
import AlertPopup from './Widgets/AlertPopup/AlertPopup';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from './Widgets/Spinner/Spinner';
// CSS
import './App.css';
import { NoticeProvider } from '../Contexts/NoticeCountContext';

export default function App() {
  const { isLoading, error } = useAuth0();
  if (isLoading) {
    return (
      <div className="loading">
        <Spinner /> Loading...
      </div>
    );
  }
  if (error) {
    return <div className="errorpage">Oops ... {error.message}</div>;
  }
  //
  // NoticeProvider depends on UserProvider
  // UserProvider depends on SettingsProvider
  //
  return (
    <AlertProvider>
      <SettingsProvider>
        <UserProvider>
          <NoticeProvider>
            <Router>
              <header>
                <Header />
              </header>
              <div className="page">
                <main>
                  <Routes>
                    <Route path="" element={<HomePage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/About" element={<AboutPage />} />
                    <Route
                      path="/Admin"
                      element={
                        <>
                          <AlertPopup />
                          <AdminPage />
                        </>
                      }
                    />
                    <Route
                      path="/Architecture"
                      element={<ArchitecturePage />}
                    />
                    <Route
                      path="/BeanDetails/:beanId"
                      element={
                        <>
                          <AlertPopup />
                          <BeanDetailsPage />
                        </>
                      }
                    />
                    <Route
                      path="/Details/:userid"
                      element={
                        <>
                          <AlertPopup />
                          <DetailsPage />
                        </>
                      }
                    />
                    <Route
                      path="/Exchange"
                      element={
                        <>
                          <AlertPopup />
                          <ExchangePage />
                        </>
                      }
                    />
                    <Route path="/Fatal" element={<FatalPage />} />
                    <Route path="/Holdings" element={<HoldingsPage />} />
                    <Route
                      path="/Notices"
                      element={
                        <>
                          <AlertPopup />
                          <NoticesPage />
                        </>
                      }
                    />
                    <Route path="/Privacy" element={<PrivacyPage />} />
                    <Route
                      path="/Profile"
                      element={
                        <>
                          <AlertPopup />
                          <ProfilePage />
                        </>
                      }
                    />
                    <Route path="/Scores" element={<LeaderboardPage />} />
                    <Route
                      path="/Trade"
                      element={
                        <>
                          <AlertPopup />
                          <TradePage />
                        </>
                      }
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>
              <footer>
                <Footer />
              </footer>
            </Router>
          </NoticeProvider>
        </UserProvider>
      </SettingsProvider>
    </AlertProvider>
  );
}
