// src/components/Sidebar.tsx
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ShoppingOutlined, TagsOutlined, TeamOutlined, FileTextOutlined, ShoppingCartOutlined, DropboxOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/logout';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Sider collapsible>
      <div style={{ height: 32, margin: 16, color: '#fff', fontWeight: 'bold' }}>Admin Panel</div>
      <Menu
        theme="dark"
        mode="inline"
        onClick={({ key }) => navigate(key)}
        items={[
          { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
          { key: '/customers', icon: <TeamOutlined />, label: 'Customers' },
          { key: '/products', icon: <ShoppingOutlined />, label: 'Products' },
          { key: '/categories', icon: <TagsOutlined />, label: 'Categories' },
          { key: '/orders', icon: <FileTextOutlined />, label: 'Orders' },
          { key: '/order-items', icon: <DropboxOutlined />, label: 'Order Items' },
          { key: '/payments', icon: <FileTextOutlined />, label: 'Payments' },
          { key: '/cart-items', icon: <ShoppingCartOutlined />, label: 'Cart Items' },
          { key: '/', icon: <LogoutOutlined />, onClick: logout, label: 'Logout' },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
