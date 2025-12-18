import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*', 
        headers: [
          {
            key: 'Access-Control-Allow-Origin', 
            value: 'http://localhost:3000'
          },
          { 
            key: 'Access-Control-Allow-Credentials', 
            value: 'true' 
          },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' 
          },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'Content-Type, Authorization' 
          },

          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }, 
          
          {
            key: 'X-Frame-Options', 
            value: 'DENY'
          }, 

          {
            key: 'Referrer-Policy',
            value: 'same-origin'
          },

          {
            key: 'Content-Secury-Policy', 
            value: "default-src 'self'"
          },

          {
            key: 'Strict-Tranport-Secury', 
            value: 'max-age=63072000 ; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
