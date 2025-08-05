// function getSummary(text) {
//   const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
//   const topSentences = sentences.slice(0, 5); // simple summary
//   return topSentences.join(" ");
// }
//grabs all <p> tags 
const paragraphs = Array.from(document.querySelectorAll("p"))
  .map(p => p.innerText)
  .filter(text => text.length > 50)
  .join("\n\n");

chrome.runtime.sendMessage({ type: "ARTICLE_TEXT", text: paragraphs });
