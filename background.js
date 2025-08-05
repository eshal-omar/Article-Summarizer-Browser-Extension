let articleText = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ARTICLE_TEXT") {
    articleText = message.text;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SUMMARY") {
    fetch("https://article-extractor-and-summarizer.p.rapidapi.com/summarize-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "your api key",                                       // replace with your api key
        "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com"
      },
      body: JSON.stringify({
        lang: "en",
        text: articleText
      })
    })
      .then(res => res.json())
      .then(data => {
  console.log("API Response:", data);
    
    
    let summary;
    if (data.summary) {
        summary = data.summary;
    } else if (data.text) {
        summary = data.text;
    } else if (data.message) {
        summary = data.message;
    } else {
        summary = JSON.stringify(data); 
    }
    
    sendResponse({ summary: summary });
})

      .catch(err => {
        console.error(err);
        sendResponse({ summary: "Error occurred while summarizing." });
      });
    return true; 
  }
});
