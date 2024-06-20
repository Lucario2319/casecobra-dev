import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // used for images that are hosted on upload thing
        // domains: ["utfs.io"], // console says deprecated, use remotePatterns instead
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io'
            },
        ],
    }
};

export default nextConfig;
