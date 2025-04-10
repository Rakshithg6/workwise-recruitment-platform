
import { ReactNode, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTheme } from '@/contexts/ThemeContext';

type ThemeAwareDashboardLayoutProps = {
  children: ReactNode;
  type: 'candidate' | 'employer';
};

function ThemeAwareDashboardLayout({ children, type }: ThemeAwareDashboardLayoutProps) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <div className={`${theme} min-h-screen bg-background text-foreground`}>
      <DashboardLayout type={type}>
        {children}
      </DashboardLayout>
    </div>
  );
}

export default ThemeAwareDashboardLayout;
