import React, { useState } from "react";
import * as XLSX from "xlsx";

const AiDashboard = () => {
  const [inputText, setInputText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fileHandle, setFileHandle] = useState(null);

  const extractEmailsWithWebsites = (text) => {
    const emailsPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailsPattern) || [];

    return emails.map((email) => {
      const domain = email.split("@")[1];
      const website = `https://${domain}`;
      return { Email: email, Website: website };
    });
  };

  const handleProcessText = () => {
    const data = extractEmailsWithWebsites(inputText);
    setFilteredData(data);
  };

  const handleConfigureMasterFile = async () => {
    try {
      const handles = await window.showOpenFilePicker({
        types: [{ description: "Excel Files", accept: { "application/vnd.ms-excel": [".xls", ".xlsx"] } }],
        multiple: false,
      });

      if (handles.length > 0) {
        setFileHandle(handles[0]);
        alert(`Master file configured: ${await handles[0].name}`);
      }
    } catch (error) {
      console.error("Error configuring master file:", error);
      alert("Failed to configure the master file. Please try again.");
    }
  };

  const handleAppendData = async () => {
    if (!fileHandle) {
      alert("No master file configured. Please configure a master file first.");
      return;
    }

    if (filteredData.length === 0) {
      alert("No valid data to append.");
      return;
    }

    try {
      // Create a writable stream to the master file
      const writableFile = await fileHandle.createWritable();

      // Create a new workbook
      const newWorkbook = XLSX.utils.book_new();

      // Try reading the existing file to get the current data
      const fileData = await fileHandle.getFile();
      const arrayBuffer = await fileData.arrayBuffer();
      const existingWorkbook = XLSX.read(arrayBuffer, { type: "array" });

      // Get the existing sheet or create a new one if it doesn't exist
      let existingSheet = existingWorkbook.Sheets[existingWorkbook.SheetNames[0]];
      if (!existingSheet) {
        existingSheet = XLSX.utils.aoa_to_sheet([["Email", "Website"]]); // Headers if no data exists
        XLSX.utils.book_append_sheet(existingWorkbook, existingSheet, "Sheet1");
      }

      // Append new data to the existing sheet
      const newRows = filteredData.map(item => [item.Email, item.Website]);
      XLSX.utils.sheet_add_aoa(existingSheet, newRows, { origin: -1 }); // Appends data

      // Write the updated workbook with both old and new data
      const updatedFile = XLSX.write(existingWorkbook, { bookType: "xlsx", type: "array" });

      // Write the updated data into the file
      await writableFile.write(updatedFile);
      await writableFile.close();

      alert("Data successfully appended to the master file!");

      // Clear input and processed data
      setInputText("");
      setFilteredData([]);
    } catch (error) {
      console.error("Error appending data:", error);
      alert("An error occurred while appending data. Please try again.");
    }
  };

  return (
    <div style={{ height: "100vh", margin: 0, display: "flex", flexDirection: "column" }}>
      <style>{`
        body {
          background-color: #121212;
          color: #e0e0e0;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
        }
        .container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background-color: #1e1e1e;
          color: #e0e0e0;
        }
        .text-area {
          flex: 1;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .button-row {
          display: flex;
          justify-content: space-between;
        }
        textarea {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background-color: #333;
          color: #ffffff;
          resize: none;
        }
        button {
          padding: 10px 20px;
          background-color: #3a3a3a;
          border: none;
          border-radius: 5px;
          color: #ffffff;
          cursor: pointer;
        }
        button:hover {
          background-color: #555;
        }
      `}</style>

      <div className="container">
        <div className="text-area">
          <h2 style={{ fontSize: "1.5em", color: "white", textAlign: "center", margin: "20px 0" }}>
            Enter Text to Extract Emails and Website Links
          </h2>
          <textarea
            placeholder="Enter text here... (e.g., someone@example.com)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <div className="button-row">
            <button onClick={handleProcessText}>Process</button>
            <button onClick={handleConfigureMasterFile}>
              {fileHandle ? `File Configured` : "Configure Master File"}
            </button>
          </div>
        </div>
        <div className="text-area">
          <h2>Filtered Data</h2>
          <textarea
            readOnly
            placeholder="Filtered emails and websites will appear here..."
            value={filteredData
              .map((item) => `${item.Email}, ${item.Website}`)
              .join("\n")}
          ></textarea>
          <button onClick={handleAppendData}>Append to Master File</button>
        </div>
      </div>
    </div>
  );
};

export default AiDashboard;
