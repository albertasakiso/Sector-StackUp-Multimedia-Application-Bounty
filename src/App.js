import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
 const getFileType = (filename) => {
    const extension = filename.split('.').pop();
    switch (extension) {
      case 'mp4':
      case 'mkv':
        return 'video';
      case 'mp3':
      case 'wav':
        return 'audio';
      case 'pdf':
        return 'document';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'unknown';
    }
  };
export default function App() {
 const [myFiles, setMyFiles] = useState([])
 const [selectedFile, setSelectedFile] = useState(null)
 const [filePath, setFilePath] = useState("/file-server/")
 const [showChartModal, setShowChartModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

 useEffect(() => {
  setMyFiles(data)
 }, [])
 useEffect(() => {
    const results = myFiles.filter(
      (file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery, myFiles]);

 var barChartOptions = {
  responsive: true,
  plugins: {
   legend: {
    position: 'top',
   },
   title: {
    display: true,
    text: 'Files Breakdown',
   },
  },
 };


const handleSearch = (event) => {
  const query = event.target.value;
  setSearchQuery(query);
  const results = myFiles.filter(file =>
    file.name.toLowerCase().includes(query.toLowerCase()) ||
    file.type.toLowerCase().includes(query.toLowerCase())
  );
  setSearchResults(results);
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  // Process the uploaded files (e.g., save to server or update state)

  // Convert the FileList object to an array
  const uploadedFiles = Array.from(files);

  // Create a new array by combining the existing files with the uploaded files
  const updatedFiles = [...myFiles, ...uploadedFiles];

  // Update the state with the new array of files
  setMyFiles(updatedFiles);

  // Update the file path, type, and name for each uploaded file
  const updatedUploadedFiles = uploadedFiles.map((file, index) => {
    const objectURL = URL.createObjectURL(file);

    const newFile = {
      id: myFiles.length + index + 1, // Generate a unique ID for the file
      name: file.name, // Set the name as the original file name
      type: getFileType(file.name), // Get the file type based on the file name
      path: objectURL, // Set the file path as the object URL
    };

    return newFile;
  });

  // Combine the updated uploaded files with the existing files
  const mergedFiles = [...myFiles, ...updatedUploadedFiles];

  // Sort the files based on type
  const sortedFiles = mergedFiles.sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    return 0;
  });

  // Update the state with the sorted files
  setMyFiles(sortedFiles);
};


 return (
  <>
  {showChartModal && (
    <div style={styles.modal}>
     <div style={styles.modalContent}>
      <div style={styles.modalHeader}>
       <p style={{ fontWeight: "bold" }}>Files Breakdown</p>
       <button style={styles.closeButton} onClick={() => setShowChartModal(false)}>close</button>
      </div>
      <div style={styles.modalBody}>
       <Pie
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
       />
       <Bar
        data={{
         labels: ['Video', 'Audio', 'Document', 'Image'],
         datasets: [
          {
           label: 'Files Breakdown',
           data: [myFiles.filter(file => file.type === 'video').length, myFiles.filter(file => file.type === 'audio').length, myFiles.filter(file => file.type === 'document').length, myFiles.filter(file => file.type === 'image').length],
           backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
           ],
           borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
           ],
           borderWidth: 1,
          },
         ],
        }}
        options={barChartOptions}
       />
      </div>
     </div>
    </div>
   )}
   <div className="App">
    <Header />
    <div style={styles.container}>
     <div style={{ padding: 10, paddingBottom: 0, }}>
      <p style={{ fontWeight: "bold" }}>My Files</p>
      <p>{selectedFile ? selectedFile.path : filePath}</p>
      
     </div>
     <div style={styles.controlTools}>
   
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map(file => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        name: prompt("Enter new name")
                      }
                    }
                    return file
                  })
                  setMyFiles(newFiles)
                  setSelectedFile(null)
                }
              }}
            >Rename</button>
            <button style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true)
              }}
            >Files Breakdown</button>
            <button style={styles.controlButton}
              onClick={() => {
                if (selectedFile){
                  window.open(selectedFile.path, "_blank")
                }
              }}
            >Download</button>
            <button style={styles.controlButton}
  onClick={() => {
    if (selectedFile) {
      const newFiles = myFiles.filter(file => file.id !== selectedFile.id);
      setMyFiles(newFiles);
      setSelectedFile(null);
    }
  }}
>Delete</button>
<div>
  <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search files"
            />
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              style={{ margin: '10px'}}
            />
</div>
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: '100%', padding: 10 }}>
              {searchQuery.length > 0
                ? searchResults.map((file) => (
                    <div
                      style={styles.file}
                      className="files"
                      key={file.id}
                      onClick={() => {
                        if (selectedFile && selectedFile.id === file.id) {
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(file);
                      }}
                    >
                      <p>{file.name}</p>
                    </div>
                  ))
                : myFiles.map((file) => (
                    <div
                      style={styles.file}
                      className="files"
                      key={file.id}
                      onClick={() => {
                        if (selectedFile && selectedFile.id === file.id) {
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(file);
                      }}
                    >
                      <p>{file.name}</p>
                    </div>
                  ))}
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === 'video' && (
         <VideoPlayer path={selectedFile.path} />
        )}
        {selectedFile.type === 'audio' && (
         <AudioPlayer path={selectedFile.path} />
        )}
        {selectedFile.type === 'document' && (
         <DocumentViewer path={selectedFile.path} />
        )}
        {selectedFile.type === 'image' && (
         <ImageViewer path={selectedFile.path} />
        )}
        <p style={{ fontWeight: "bold", marginTop: 10 }}>{selectedFile.name}</p>
        <p>path: <span style={{ fontStyle: "italic" }}>{selectedFile.path}</span></p>
        <p>file type: <span style={{fontStyle: "italic"}}>{selectedFile.type}</span></p>
              </div>
            )}
          </div>
     
    </div>
   </div>
  </>
 );
}
 
const styles = {
 container: {
  backgroundColor: '#fff',
  color: '#000',
 },
 fileContainer: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'row',
 
 },
 file: {
  backgroundColor: '#eee',
  padding: '10px',
  marginBottom: '10px',
  cursor: 'pointer',
  width: '100%',
 },
 fileViewer: {
  padding: '10px',
  margin: '10px',
  width: '30vw',
  height: '100vh',
  cursor: 'pointer',
  borderLeft: '1px solid #000'
 },
 controlTools: {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  flexDirection: 'row',
  padding: '10px',
 },
 controlButton: {
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
 },
  // modal
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    height: '50vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  modalClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px',
    cursor: 'pointer',
  },
  modalBody:{
    width: '100%',
    height: '90%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '10px',
  },
  modalHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  closeButton: {
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#eee',
  }
};
