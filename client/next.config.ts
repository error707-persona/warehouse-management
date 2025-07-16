import type { NextConfig } from "next";

const nextConfig: NextConfig = {
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({});


export default nextConfig;
