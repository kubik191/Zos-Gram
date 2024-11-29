// layouts/PublicLayout.tsx
import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div>
      <header>Public Header</header>
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;
