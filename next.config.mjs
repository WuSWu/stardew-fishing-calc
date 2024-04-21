/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // this is for GitHub Pages.
    // if you're running on local delete the basePath line and put the file on .gitignore
    // I'm not installing jekyll just for this 
    basePath: "/stardew-fishing-calc",
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
