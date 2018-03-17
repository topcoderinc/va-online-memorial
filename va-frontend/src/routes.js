import { META } from './config';
import Landing from './containers/Landing';
import Search from './containers/Search';
import Dashboard from './containers/Dashboard';
import AdminDashboard from './containers/AdminDashboard';
import Setting, {AdminSetting} from './containers/Setting';

/**
 * Generate an object with all necessary fields to render a page.
 * @param {string} path - The page path
 * @param {string} title - THe page title (for SEO)
 * @param {Function} component - The component to be rendered. Containers can also be used
 * @param {string} description - The page description (for SEO) [OPTIONAL]
 * @param {string} keywords - The comma separated page keywords (for SEO) [OPTIONAL]
 * @returns {object}
 */
const createPage = (path, title, component, description, keywords) => ({
  path,
  title: `${title} | ${META.PAGE_TITLE_SUFFIX}`,
  description: description || META.PAGE_DESCRIPTION,
  keywords: keywords || META.PAGE_KEYWORDS,
  component
});

export default [
  createPage('/', 'Landing', Landing),
  createPage('/home', 'Landing', Landing),
  createPage('/search', 'Search', Search),
  createPage('/dashboard', 'Dashboard', Dashboard),
  createPage('/admin/dashboard', 'Admin Dashboard', AdminDashboard),
  createPage('/setting', 'Setting', Setting),
  createPage('/admin/setting', 'Admin Setting', AdminSetting),
];
