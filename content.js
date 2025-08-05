const articleText = extractArticleText();
console.log("Extracted text:", articleText.substring(0, 200) + "..."); 
console.log("Text length:", articleText.length);

chrome.runtime.sendMessage({ type: "ARTICLE_TEXT", text: articleText });



function extractArticleText() {
    let text = "";
    
    const articleSelectors = [
        'article',
        'main#main-content', 
        '[role="main"]',
        '.article-content',
        '.post-content',
        '.entry-content',
        '.content',
        'main'
    ];
    
    for (let selector of articleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            const paragraphs = Array.from(element.querySelectorAll("p"))
                .map(p => p.innerText.trim())
                .filter(text => text.length > 15) 
                .join("\n\n");
            
            if (paragraphs.length > 100) {
                text = paragraphs;
                console.log("Method 1 success with selector:", selector);
                break;
            }
        }
    }
    
    
    if (!text || text.length < 100) {
        const allParagraphs = Array.from(document.querySelectorAll("p"))
            .map(p => p.innerText.trim())
            .filter(text => text.length > 15 && !isNavigationText(text))
            .join("\n\n");
        
        if (allParagraphs.length > 100) {
            text = allParagraphs;
            console.log("Method 2 success - all paragraphs");
        }
    }
    
    
    if (!text || text.length < 100) {
        const textBlocks = Array.from(document.querySelectorAll("div, span, section"))
            .map(el => el.innerText?.trim())
            .filter(text => text && text.length > 50 && text.length < 1000 && !isNavigationText(text))
            .join("\n\n");
        
        if (textBlocks.length > 100) {
            text = textBlocks;
            console.log("Method 3 success - text blocks");
        }
    }
    
    
    if (!text || text.length < 100) {
        const specificPs = Array.from(document.querySelectorAll("p[class*='sc-'], p[class*='text'], div[data-component='text-block'] p"))
            .map(p => p.innerText.trim())
            .filter(text => text.length > 15)
            .join("\n\n");
        
        if (specificPs.length > 100) {
            text = specificPs;
            console.log("Method 4 success - specific selectors");
        }
    }
    
    
    if (!text || text.length < 100) {
        const bodyText = document.body.innerText;
        const sentences = bodyText.split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 30 && !isNavigationText(s))
            .join(". ");
        
        if (sentences.length > 100) {
            text = sentences;
            console.log("Method 5 success - body text filtered");
        } else {
            text = bodyText; 
            console.log("Method 5 fallback - raw body text");
        }
    }
    
    return text;
}


function isNavigationText(text) {
    const navKeywords = [
        'menu', 'navigation', 'subscribe', 'login', 'sign in', 'register',
        'home', 'about', 'contact', 'privacy', 'terms', 'cookie',
        'follow us', 'social', 'share', 'tweet', 'facebook',
        'advertisement', 'sponsored', 'ad', 'promo'
    ];
    
    const lowerText = text.toLowerCase();
    return navKeywords.some(keyword => lowerText.includes(keyword)) ||
           text.length < 15 ||
           /^[A-Z\s]+$/.test(text) || 
           text.split(' ').length < 4; 
}


setTimeout(() => {
    const articleText = extractArticleText();
    
    console.log("=== EXTRACTION RESULTS ===");
    console.log("Extracted text length:", articleText.length);
    console.log("First 300 characters:", articleText.substring(0, 300));
    console.log("========================");
    
    if (articleText.length > 50) {
        chrome.runtime.sendMessage({ type: "ARTICLE_TEXT", text: articleText });
    } else {
        console.error("Failed to extract sufficient text from page");
    }
}, 2000); 