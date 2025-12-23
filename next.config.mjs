/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@supabase/ssr', '@supabase/supabase-js'],
    experimental: {
        serverComponentsExternalPackages: ['pdf-parse'],
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'static.nike.com' },
            { protocol: 'https', hostname: 'm.media-amazon.com' },
            { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
            { protocol: 'https', hostname: 'assets.adidas.com' },
            { protocol: 'https', hostname: 'dyson-h.assetsadobe2.com' },
            { protocol: 'https', hostname: 'www.ikea.com' },
            { protocol: 'https', hostname: 'via.placeholder.com' },
        ]
    }
};

export default nextConfig;
