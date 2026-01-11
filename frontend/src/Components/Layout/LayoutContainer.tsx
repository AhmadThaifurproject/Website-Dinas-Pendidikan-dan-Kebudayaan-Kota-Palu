import React from "react";

interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({ children, className }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-6 ${className || ""}`}>
      {children}
    </div>
  );
};

export default LayoutContainer;
