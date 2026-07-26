import React from 'react';

export const CardTitle = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 
      className={`text-xl font-bold mb-2 text-black dark:text-white ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardBody = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardText = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p 
      className={`text-gray-700 dark:text-gray-300 mb-2 ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};

export const CardMain = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`border rounded-xl shadow-sm overflow-hidden mb-4 bg-white dark:bg-[#2b3035] border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card = Object.assign(CardMain, {
  Body: CardBody,
  Title: CardTitle,
  Text: CardText
});