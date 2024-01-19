import React, { useState, useRef } from 'react';
import axios from 'axios';
import './styles.css'; // импорт стилей
import './stylesInput.css'; // импорт стилей

const App = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileInputDisabled, setFileInputDisabled] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleCustomInputClick = () => {
    fileInputRef.current.click(); // Запускаем нативный input при клике на кастомную кнопку
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Пожалуйста, выберите файл');
      return;
    }

    setLoading(true);
    setFileInputDisabled(true);
    const formData = new FormData();
    formData.append('table', file); // изменение имени ключа для файла

    try {
      const response = await axios.post('https://planetshop.by/api-postDocument-Roma/createShipment', formData, {
        responseType: 'blob',
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'documents.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setFileInputDisabled(false);
      setFile(null);
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="container">
      <input
        className="input-file"
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        disabled={loading || fileInputDisabled}
        ref={fileInputRef}
      />
      <div className="custom-input-file" onClick={handleCustomInputClick} disabled={loading}>
        Выбрать файл
      </div>
      <button className="button" onClick={handleSubmit} disabled={loading || !file}>
        {loading ? 'Ожидание...' : 'Создать документы'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default App;
