/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import ChatConversations from './pages/ChatConversations';
import Ecosystem from './pages/Ecosystem';
import Home from './pages/Home';
import InvestorPayments from './pages/InvestorPayments';
import MarketIntelligence from './pages/MarketIntelligence';
import ROICalculator from './pages/ROICalculator';
import ScheduleMeeting from './pages/ScheduleMeeting';
import Training from './pages/Training';
import ForecastEngine from './pages/ForecastEngine';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ChatConversations": ChatConversations,
    "Ecosystem": Ecosystem,
    "Home": Home,
    "InvestorPayments": InvestorPayments,
    "MarketIntelligence": MarketIntelligence,
    "ROICalculator": ROICalculator,
    "ScheduleMeeting": ScheduleMeeting,
    "Training": Training,
    "ForecastEngine": ForecastEngine,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};