// robots.txt — UMA TRAVELS
// ─────────────────────────────────────────────────────────────────────
// STRATEGY:
//  • Google, Bing, and all major search engines — full access
//  • Google-Extended — ALLOWED (required for Google AI Overviews / SGE)
//    Blocking this removes UMA TRAVELS from Google AI answers entirely.
//  • PerplexityBot, OAI-SearchBot, ChatGPT-User — ALLOWED for GEO
//    (Generative Engine Optimisation — appear in AI search answers)
//  • ClaudeBot / Claude-Web — ALLOWED (Anthropic search)
//  • GPTBot — ALLOWED (factual business content benefits from AI training)
//  • Pure training/scraping crawlers with no search benefit — BLOCKED
// ─────────────────────────────────────────────────────────────────────
import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Pure data scrapers (no search result benefit) — blocked ──────
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Diffbot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'meta-externalagent', disallow: '/' },

      // ── General crawlers — full access ───────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── Googlebot — explicit full access ─────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── Google-Extended — MUST ALLOW for Google AI Overviews (AEO) ──
      // Blocking this = site is excluded from Google AI Overviews, SGE,
      // and Gemini search answers. This is the #1 AEO signal.
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── Googlebot-Image ───────────────────────────────────────────────
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── Bingbot ───────────────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── Apple Applebot (Siri) ─────────────────────────────────────────
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── DuckDuckBot ───────────────────────────────────────────────────
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── PerplexityBot — site appears in Perplexity AI answers (GEO) ──
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Perplexity-User',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── OpenAI search crawlers — ChatGPT Browse & web search (GEO) ───
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── GPTBot — OpenAI training crawler ─────────────────────────────
      // Allowing helps factual business info appear in ChatGPT trained data.
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── ClaudeBot / Claude-Web — Anthropic AI search (GEO) ───────────
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },

      // ── Alexa crawler ─────────────────────────────────────────────────
      {
        userAgent: 'ia_archiver',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
    host: SITE_CONFIG.siteUrl,
  };
}