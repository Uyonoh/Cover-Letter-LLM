function generateLetter() {
  const token = localStorage.getItem("token");
  const job_description = document.getElementById("job_description");
  const jsonData = {
    job_description: job_description.innerText,
  };

  console.log(jsonData);

  fetch("http://127.0.0.1:8000/letters/generate-letter", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jsonData),
  })
    .then((res) => res.json())
    .then((data) => {return data})
    .catch((err) => console.error("Error:", err));
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generateLetter"){
        const response = generateLetter();
        sendResponse({response: response});
    }
    return true;
});