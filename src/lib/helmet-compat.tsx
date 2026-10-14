"use client";
import React, { useEffect } from 'react';

interface HelmetProps {
  children?: React.ReactNode;
}

export const Helmet: React.FC<HelmetProps> = ({ children }) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const childArray = React.Children.toArray(children);
    childArray.forEach((child) => {
      if (!React.isValidElement(child)) return;

      const { type, props } = child as React.ReactElement<any>;

      if (type === 'title') {
        const titleText = typeof props.children === 'string' ? props.children : '';
        // Only update title if current document.title is empty or generic, and new title is meaningful
        if (
          titleText &&
          titleText !== 'Medingen Product' &&
          titleText !== 'Blog' &&
          !document.title.includes(titleText)
        ) {
          document.title = titleText;
        }
      } else if (type === 'meta') {
        if (props.name) {
          let meta = document.querySelector(`meta[name="${props.name}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', props.name);
            document.head.appendChild(meta);
            meta.setAttribute('content', props.content || '');
          }
        } else if (props.property) {
          let meta = document.querySelector(`meta[property="${props.property}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', props.property);
            document.head.appendChild(meta);
            meta.setAttribute('content', props.content || '');
          }
        }
      } else if (type === 'link') {
        if (props.rel === 'canonical') {
          let link = document.querySelector(`link[rel="canonical"]`);
          if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            link.setAttribute('href', props.href || '');
            document.head.appendChild(link);
          }
        }
      }
    });
  }, [children]);

  return null;
};

export const HelmetProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;
