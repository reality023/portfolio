/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  export default Component;
}
