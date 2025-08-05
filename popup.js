document.getElementById("summarizeBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "GET_SUMMARY" }, (response) => {
    document.getElementById("summary").innerText = response.summary || "No summary found.";
  });
});

