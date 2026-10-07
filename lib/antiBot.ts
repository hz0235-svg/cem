/**
 * Edge-compatible Anti-Bot & Bad Crawler Detection
 * Filters out automated scrapers, headless browsers, and vulnerability bots
 */

const BAD_BOT_SIGNATURES = [
  'python-requests',
  'python-urllib',
  'aiohttp',
  'scrapy',
  'httpclient',
  'curl',
  'wget',
  'libwww-perl',
  'nikto',
  'sqlmap',
  'zgrab',
  'masscan',
  'nmap',
  'headlesschrome',
  'phantomjs',
  'selenium',
  'puppeteer',
  'playwright',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'mj12bot',
  'petalbot',
  'bytespider',
  'megaindex',
  'blexbot',
  'seznambot',
  'censys',
  'shodan',
];

export function isBadBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.trim().length < 10) {
    return true; // Empty or abnormally short UA is almost always a raw scraper
  }

  const lowerUA = userAgent.toLowerCase();

  for (const bot of BAD_BOT_SIGNATURES) {
    if (lowerUA.includes(bot)) {
      return true;
    }
  }

  return false;
}
