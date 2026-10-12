import { useState } from "react";

const TOKEN = "paste your key from setting generate key";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage("Error: Please select a file to upload.");
      return;
    }

    setStatusMessage("Uploading file, please wait...");
    try {
      const response = await fetch(
        "https://content.dropboxapi.com/2/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Dropbox-API-Arg": JSON.stringify({
              path: "/" + selectedFile.name,
              mode: "overwrite",
              autorename: true,
              mute: false,
              strict_conflict: false,
            }),
            "Content-Type": "application/octet-stream",
          },
          body: selectedFile,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("Upload successful: " + data.name);
      } else {
        setStatusMessage("Upload failed: " + (data.error_summary || JSON.stringify(data)));
      }
    } catch (error) {
      setStatusMessage("Error: " + error.message);
    }
  };

  const handleDownload = async () => {
    if (!downloadFileName.trim()) {
      setStatusMessage("Error: Please enter a file name to download.");
      return;
    }

    setStatusMessage("Downloading file, please wait...");

    try {
      const response = await fetch(
        "https://content.dropboxapi.com/2/files/download",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Dropbox-API-Arg": JSON.stringify({
              path: "/" + downloadFileName.trim(),
            }),
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "downloaded_" + downloadFileName.trim();
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setStatusMessage("Download successful: downloaded_" + downloadFileName.trim());
      } else {
        const errorData = await response.json();
        setStatusMessage("Download failed: " + (errorData.error_summary || "File not found"));
      }
    } catch (error) {
      setStatusMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <h1>Dropbox File Upload & Download</h1>
      <div>
        <h2>1. Upload File</h2>
        <input type="file" onChange={handleFileChange} />
        <br />
        <br />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <hr />

      <div>
        <h2>2. Download File</h2>
        <input
          type="text"
          value={downloadFileName}
          onChange={(e) => setDownloadFileName(e.target.value)}
          placeholder="Enter Dropbox file name (e.g. test.txt)"
        />
        <button onClick={handleDownload}>Download</button>
      </div>

      <div>
        <h3>Status Message</h3>
        <p>{statusMessage || "Waiting for action..."}</p>
      </div>
    </div>
  );
}

export default App;
