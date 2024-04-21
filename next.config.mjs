/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
    return [
        {
        source: "/page",
        destination: "/home",
        permanent: true,
        },
    ];
    },
};

export default nextConfig;
