import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '' }) => {
  return (
    <div className={`animate-fade-in ${className}`} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default PageWrapper;
