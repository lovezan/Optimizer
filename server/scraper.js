import * as cheerio from 'cheerio';

export async function fetchAmazonProduct(asin) {
  try {
    const url = `https://www.amazon.com/dp/${asin}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      throw new Error(`Amazon returned status ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let title = $('#productTitle').text().trim() ||
                $('span[id="productTitle"]').text().trim();

    const bullets = [];
    $('#feature-bullets ul li span.a-list-item').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && !text.includes('Make sure') && text.length > 10) {
        bullets.push(text);
      }
    });

    let description = $('#productDescription p').text().trim();
    if (!description) {
      const descSpans = $('#productDescription span');
      if (descSpans.length > 0) {
        description = descSpans.first().text().trim();
      }
    }

    const needsFallback = !title || bullets.length === 0 || !description || description.length < 20;

    if (needsFallback) {
      // Fallback: fetch readable rendering through Jina AI reader proxy (no JS, cleaner HTML)
      const readerUrl = `https://r.jina.ai/http://www.amazon.com/dp/${asin}`;
      const readerResp = await fetch(readerUrl, { headers: { 'User-Agent': 'curl/8' }});
      if (readerResp.ok) {
        const readerHtml = await readerResp.text();
        const $r = cheerio.load(readerHtml);

        if (!title) {
          title = $r('title').first().text().replace('Amazon.com: ', '').trim() || title;
        }

        if (bullets.length === 0) {
          $r('li').each((i, el) => {
            const t = $r(el).text().trim();
            if (t && t.length > 20 && t.length < 300 && /\w/.test(t)) {
              bullets.push(t);
            }
          });
        }

        if (!description || description.length < 20) {
          let bodyText = $r('body').text().replace(/\s+/g, ' ').trim();
          // Attempt to slice around common sections
          const aboutIdx = bodyText.toLowerCase().indexOf('about this item');
          if (aboutIdx !== -1) {
            bodyText = bodyText.substring(aboutIdx, aboutIdx + 1800);
          } else {
            bodyText = bodyText.substring(0, 1800);
          }
          description = bodyText;
        }
      }
    }

    if (!title) title = 'Title not found';
    if (bullets.length === 0) bullets.push('Feature information not available');
    if (!description || description.length < 20) description = 'Product description not available';

    return {
      asin,
      title,
      bullets: bullets.slice(0, 8),
      description: description.substring(0, 2000)
    };
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
}
