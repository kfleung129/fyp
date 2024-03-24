/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: [
        {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
        },
    ],
    webpack: (config) => {
        // See https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
}

module.exports = nextConfig
