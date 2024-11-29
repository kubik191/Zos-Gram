// layouts/PrivateLayout.tsx
import React from 'react';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  return (
    <div>
      <header>Private Header</header>
      <main>{children}</main>
    </div>
  );
};

export default PrivateLayout;

