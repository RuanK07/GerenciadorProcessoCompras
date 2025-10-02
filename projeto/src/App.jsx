import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './App.css'

function App() {
  // Recuperar dados salvos do localStorage na inicialização
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('processosData')
    return savedData ? JSON.parse(savedData) : []
  })
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSetor, setSelectedSetor] = useState('')
  const [selectedModalidade, setSelectedModalidade] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedProcess, setSelectedProcess] = useState(null)

  // Salvar dados no localStorage sempre que data mudar
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('processosData', JSON.stringify(data))
    } else {
      localStorage.removeItem('processosData')
    }
  }, [data])

  // Dados de teste
  const testData = [
    {
      id: 1,
      nup: "24001.000423/2025-44",
      setor: "SEMAN",
      modalidade: "Pregão",
      objeto: "AQS DE MATERIAL ELETRICO",
      primeiraEntrada: "2025-01-23",
      ultimaEntrada: "2025-09-15",
      localizacaoAtual: "unif/Hias",
      permanencia: 1,
      observacoes: "Encaminhado para inclusão de dotação orçamentaria Detalhada",
      responsavel: "HUMBERTO"
    },
    {
      id: 2,
      nup: "24001.065751/2025-96",
      setor: "T.I",
      modalidade: "Adesão",
      objeto: "SERVIDOR (SERVIDOR 1B – BACKUP E CFTV)",
      primeiraEntrada: "2025-08-08",
      ultimaEntrada: "2025-08-20",
      localizacaoAtual: "UNIF/Hias",
      permanencia: 9,
      observacoes: "Criação de Código e Pesquisa de Preço",
      responsavel: "Ana Paula"
    },
    {
      id: 3,
      nup: "24001.061834/2025-14",
      setor: "SEMAN",
      modalidade: "Adesão",
      objeto: "Sistema Fotovoltáico ( Placas Solares)",
      primeiraEntrada: "2025-07-22",
      ultimaEntrada: "2025-08-04",
      localizacaoAtual: "GABSEC/SEAFI",
      permanencia: 25,
      observacoes: "Enviado a SEAFI com indeferimento da SEPLAG",
      responsavel: "Ana Paula"
    },
    {
      id: 4,
      nup: "24001.051122/2025-89",
      setor: "FARMÁCIA",
      modalidade: "Aditivo",
      objeto: "Material de Diálise Peritoneal",
      primeiraEntrada: "2025-08-25",
      ultimaEntrada: "2025-09-08",
      localizacaoAtual: "Contratos/Hias",
      permanencia: 1,
      observacoes: "Finalizada Pesquisa de preço",
      responsavel: "Ana Paula"
    },
    {
      id: 5,
      nup: "24001028501/2025-75",
      setor: "ODONTOLOGIA",
      modalidade: "Pregão",
      objeto: "SERV DOCUMENTAÇÃO ORTODONTICA",
      primeiraEntrada: "2025-04-09",
      ultimaEntrada: "2025-09-15",
      localizacaoAtual: "unif/Hias",
      permanencia: 18,
      observacoes: "Encaminhado para Inclusão de dotação orçamentária detalhada",
      responsavel: "HUMBERTO"
    },
    {
      id: 6,
      nup: "24001.062190/2025-73",
      setor: "DITEC",
      modalidade: "Aditivo",
      objeto: "EXAMES LABORATÓRIAIS - Fornecedor : Clínica Dra. Maria Helena",
      primeiraEntrada: "2025-07-23",
      ultimaEntrada: "2025-08-13",
      localizacaoAtual: "COGCO/Sesa",
      permanencia: 20,
      observacoes: "Finalizada pesquisa enviado á célula de contratos Hias",
      responsavel: "Ana Paula"
    }
  ]

  const loadTestData = () => {
    setData(testData)
    setFilteredData(testData)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        
        const processedData = jsonData.map((row, index) => ({
          id: index + 1,
          nup: row['Nup'] || '',
          setor: row['Setor'] || '',
          modalidade: row['Modalidade'] || '',
          objeto: row['Objeto'] || '',
          primeiraEntrada: row['1ª entrada no Compras'] || '',
          ultimaEntrada: row['última  entrada no Compras '] || '',
          localizacaoAtual: row['Localização Atual '] || '',
          permanencia: parseFloat(row['Permanencia (Dias)']) || 0,
          observacoes: row['Observações'] || '',
          responsavel: row['Responsável'] || ''
        }))
        
        setData(processedData)
        setFilteredData(processedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        setIsLoading(false)
        alert('Erro ao processar arquivo. Verifique se é um arquivo Excel válido.')
      }
    }
    
    reader.readAsBinaryString(file)
  }

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = [...data]
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.objeto.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedSetor) {
      filtered = filtered.filter(item => item.setor === selectedSetor)
    }
    
    if (selectedModalidade) {
      filtered = filtered.filter(item => item.modalidade === selectedModalidade)
    }
    
    if (selectedStatus) {
      if (selectedStatus === 'criticos') {
        filtered = filtered.filter(item => item.permanencia > 45)
      } else if (selectedStatus === 'atencao') {
        filtered = filtered.filter(item => item.permanencia >= 30 && item.permanencia <= 45)
      } else if (selectedStatus === 'normais') {
        filtered = filtered.filter(item => item.permanencia < 30)
      }
    }
    
    setFilteredData(filtered)
  }

  // Limpar filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSetor('')
    setSelectedModalidade('')
    setSelectedStatus('')
    setFilteredData(data)
  }

  // Calcular métricas
  const metrics = {
    total: data.length,
    criticos: data.filter(item => item.permanencia > 45).length,
    atencao: data.filter(item => item.permanencia >= 30 && item.permanencia <= 45).length,
    normais: data.filter(item => item.permanencia < 30).length
  }

  // Obter valores únicos para filtros
  const uniqueValues = {
    setores: [...new Set(data.map(item => item.setor))].filter(Boolean).sort(),
    modalidades: [...new Set(data.map(item => item.modalidade))].filter(Boolean).sort()
  }

  // Função para obter cor baseada na permanência
  const getPermanenciaColor = (dias) => {
    if (dias > 45) return '#ff4757'
    if (dias >= 30) return '#ffa502'
    return '#2ed573'
  }

  const getPermanenciaBg = (dias) => {
    if (dias > 45) return 'linear-gradient(135deg, #ff6b7a, #ff4757)'
    if (dias >= 30) return 'linear-gradient(135deg, #ffb347, #ffa502)'
    return 'linear-gradient(135deg, #7bed9f, #2ed573)'
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '20px 0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    logoIcon: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #5a67d8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      letterSpacing: '-0.5px',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    subtitle: {
      color: '#4a5568',
      fontSize: '16px',
      margin: '5px 0 0 0',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #718096, #4a5568)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '0.5px',
      textTransform: 'uppercase'
    },
    badge: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px'
    },
    uploadCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '50px',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '600px',
      margin: '50px auto'
    },
    uploadIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 30px',
      color: 'white',
      fontSize: '36px',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
    },
    uploadTitle: {
      fontSize: '32px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '15px'
    },
    uploadDesc: {
      color: '#666',
      fontSize: '16px',
      marginBottom: '40px'
    },
    uploadArea: {
      border: '3px dashed #667eea',
      borderRadius: '15px',
      padding: '40px',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
      marginBottom: '30px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    uploadAreaHover: {
      borderColor: '#764ba2',
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
      transform: 'translateY(-2px)'
    },
    fileInput: {
      display: 'none'
    },
    uploadText: {
      fontSize: '18px',
      color: '#667eea',
      fontWeight: '600',
      marginBottom: '10px'
    },
    uploadSubtext: {
      color: '#999',
      fontSize: '14px'
    },
    testButton: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      marginBottom: '40px'
    },
    metricCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease'
    },
    metricCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
    },
    metricHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px'
    },
    metricTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    metricIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px'
    },
    metricValue: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '5px'
    },
    metricSubtext: {
      fontSize: '12px',
      color: '#999'
    },
    filtersCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    filtersTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      alignItems: 'end'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#555'
    },
    filterInput: {
      padding: '12px 15px',
      border: '2px solid #e1e8ed',
      borderRadius: '10px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)'
    },
    filterInputFocus: {
      borderColor: '#667eea',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    },
    filterButton: {
      padding: '12px 20px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#667eea',
      border: '2px solid #667eea'
    },
    processesCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    processesTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    processCard: {
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    processCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
    },
    processHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px'
    },
    processNup: {
      fontSize: '12px',
      color: '#333',
      fontFamily: 'monospace',
      fontWeight: '700',
      marginBottom: '5px'
    },
    processTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      lineHeight: '1.4',
      marginBottom: '15px'
    },
    processBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },
    processInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px'
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    infoLabel: {
      fontSize: '11px',
      color: '#333',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '700'
    },
    infoValue: {
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    newPlanilhaButton: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      display: 'block',
      margin: '40px auto 0'
    },
    mainContent: {
      display: 'flex',
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px'
    },
    leftPanel: {
      flex: selectedProcess ? '1' : '1',
      transition: 'all 0.3s ease'
    },
    rightPanel: {
      width: selectedProcess ? '400px' : '0',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: selectedProcess ? '30px' : '0',
      boxShadow: selectedProcess ? '0 15px 35px rgba(0, 0, 0, 0.1)' : 'none',
      border: selectedProcess ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    rightPanelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '2px solid #f0f0f0'
    },
    rightPanelTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#333',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#999',
      padding: '5px',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    },
    processDetails: {
      marginBottom: '20px'
    },
    processDetailTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px'
    },
    processDetailNup: {
      fontSize: '12px',
      color: '#666',
      fontFamily: 'monospace',
      marginBottom: '5px'
    },
    observationsSection: {
      marginTop: '20px'
    },
    observationsTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    observationsText: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.6',
      padding: '15px',
      background: 'rgba(102, 126, 234, 0.05)',
      borderRadius: '10px',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      minHeight: '100px'
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}></div>
            <div>
              <h1 style={styles.title}>Controle de Processos</h1>
              <p style={styles.subtitle}>Setor de Compras</p>
            </div>
          </div>
          {data.length > 0 && (
            <div style={styles.badge}>
              {data.length} processos
            </div>
          )}
        </div>
      </header>

      <main style={selectedProcess ? styles.mainContent : styles.main}>
        {data.length === 0 ? (
          /* Área de Upload */
          <div style={styles.uploadCard}>
            <div style={styles.uploadIcon}>📁</div>
            <h2 style={styles.uploadTitle}>Importar Planilha</h2>
            <p style={styles.uploadDesc}>
              Faça upload da planilha Excel com os dados dos processos
            </p>
            
            <div 
              style={styles.uploadArea}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, styles.uploadAreaHover)
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, styles.uploadArea)
              }}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isLoading}
                style={styles.fileInput}
              />
              <div style={styles.uploadText}>
                {isLoading ? 'Processando arquivo...' : 'Clique para selecionar arquivo'}
              </div>
              <div style={styles.uploadSubtext}>
                Formatos aceitos: .xlsx, .xls
              </div>
            </div>
            
            <button 
              onClick={loadTestData}
              style={styles.testButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
              }}
            >
              🧪 Carregar Dados de Teste
            </button>
          </div>
        ) : (
          <>
            {/* Painel Esquerdo - Dashboard Principal */}
            <div style={styles.leftPanel}>
              {/* Métricas */}
            <div style={styles.metricsGrid}>
              <div 
                style={styles.metricCard}
              >
                <div style={styles.metricHeader}>
                  <span style={styles.metricTitle}>Total</span>
                  <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>📊</div>
                </div>
                <div style={styles.metricValue}>{metrics.total}</div>
                <div style={styles.metricSubtext}>processos</div>
              </div>

              <div 
                style={styles.metricCard}
              >
                <div style={styles.metricHeader}>
                  <span style={styles.metricTitle}>Críticos</span>
                  <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #ff6b7a, #ff4757)'}}>⚠️</div>
                </div>
                <div style={styles.metricValue}>{metrics.criticos}</div>
                <div style={styles.metricSubtext}>&gt; 45 dias</div>
              </div>

              <div 
                style={styles.metricCard}
              >
                <div style={styles.metricHeader}>
                  <span style={styles.metricTitle}>Atenção</span>
                  <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #ffb347, #ffa502)'}}>⏰</div>
                </div>
                <div style={styles.metricValue}>{metrics.atencao}</div>
                <div style={styles.metricSubtext}>30-45 dias</div>
              </div>

              <div 
                style={styles.metricCard}
              >
                <div style={styles.metricHeader}>
                  <span style={styles.metricTitle}>Normais</span>
                  <div style={{...styles.metricIcon, background: 'linear-gradient(135deg, #7bed9f, #2ed573)'}}>✅</div>
                </div>
                <div style={styles.metricValue}>{metrics.normais}</div>
                <div style={styles.metricSubtext}>&lt; 30 dias</div>
              </div>
            </div>

            {/* Filtros */}
            <div style={styles.filtersCard}>
              <h3 style={styles.filtersTitle}>
                🔍 Filtros
              </h3>
              <div style={styles.filtersGrid}>
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Buscar</label>
                  <input
                    type="text"
                    placeholder="NUP ou Objeto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.filterInput}
                    onFocus={(e) => Object.assign(e.target.style, styles.filterInputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.filterInput)}
                  />
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Setor</label>
                  <select
                    value={selectedSetor}
                    onChange={(e) => setSelectedSetor(e.target.value)}
                    style={styles.filterInput}
                  >
                    <option value="">Todos</option>
                    {uniqueValues.setores.map(setor => (
                      <option key={setor} value={setor}>{setor}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Modalidade</label>
                  <select
                    value={selectedModalidade}
                    onChange={(e) => setSelectedModalidade(e.target.value)}
                    style={styles.filterInput}
                  >
                    <option value="">Todas</option>
                    {uniqueValues.modalidades.map(modalidade => (
                      <option key={modalidade} value={modalidade}>{modalidade}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={styles.filterInput}
                  >
                    <option value="">Todos</option>
                    <option value="criticos">Críticos (&gt; 60 dias)</option>
                    <option value="atencao">Atenção (30-45 dias)</option>
                    <option value="normais">Normais (&lt; 30 dias)</option>
                  </select>
                </div>
                
                <div style={styles.filterGroup}>
                  <button 
                    onClick={applyFilters}
                    style={{...styles.filterButton, ...styles.primaryButton}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)'
                    }}
                  >
                    Aplicar
                  </button>
                  <button 
                    onClick={clearFilters}
                    style={{...styles.filterButton, ...styles.secondaryButton}}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.8)'
                    }}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Processos */}
            <div style={styles.processesCard}>
              <h3 style={styles.processesTitle}>
                📋 Processos ({filteredData.length})
              </h3>
              
              {filteredData.map((processo) => (
                <div 
                  key={processo.id} 
                  style={{...styles.processCard, cursor: 'pointer'}}
                  onClick={() => {
                    setSelectedProcess(processo)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <div style={styles.processHeader}>
                    <div>
                      <div style={styles.processNup}>{processo.nup}</div>
                      <div style={styles.processTitle}>{processo.objeto}</div>
                    </div>
                    <div 
                      style={{
                        ...styles.processBadge,
                        background: getPermanenciaColor(processo.permanencia)
                      }}
                    >
                      {processo.permanencia} dias
                    </div>
                  </div>
                  
                  <div style={styles.processInfo}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Setor</span>
                      <span style={styles.infoValue}>{processo.setor}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Modalidade</span>
                      <span style={styles.infoValue}>{processo.modalidade}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Localização</span>
                      <span style={styles.infoValue}>{processo.localizacaoAtual}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Responsável</span>
                      <span style={styles.infoValue}>{processo.responsavel}</span>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoLabel}>Permanência (Dias)</span>
                      <span style={styles.infoValue}>{processo.permanencia} dias</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Nova Planilha */}
            <button 
              onClick={() => {
                setData([])
                setSelectedProcess(null)
                localStorage.removeItem('processosData')
              }}
              style={styles.newPlanilhaButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
              }}
            >
              📁 Carregar Nova Planilha
            </button>
            </div>

            {/* Painel Direito - Detalhes do Processo */}
            {selectedProcess && (
              <div style={styles.rightPanel}>
                <div style={styles.rightPanelHeader}>
                  <h3 style={styles.rightPanelTitle}>Detalhes do Processo</h3>
                  <button 
                    style={styles.closeButton}
                    onClick={() => setSelectedProcess(null)}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f0f0f0'
                      e.target.style.color = '#333'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none'
                      e.target.style.color = '#999'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={styles.processDetails}>
                  <div style={styles.processDetailNup}>{selectedProcess.nup}</div>
                  <div style={styles.processDetailTitle}>{selectedProcess.objeto}</div>
                  
                  <div style={{marginTop: '15px', display: 'grid', gap: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span style={{color: '#666', fontSize: '14px'}}>Setor:</span>
                      <span style={{fontWeight: '600', fontSize: '14px'}}>{selectedProcess.setor}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span style={{color: '#666', fontSize: '14px'}}>Modalidade:</span>
                      <span style={{fontWeight: '600', fontSize: '14px'}}>{selectedProcess.modalidade}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span style={{color: '#666', fontSize: '14px'}}>Localização:</span>
                      <span style={{fontWeight: '600', fontSize: '14px'}}>{selectedProcess.localizacaoAtual}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span style={{color: '#666', fontSize: '14px'}}>Responsável:</span>
                      <span style={{fontWeight: '600', fontSize: '14px'}}>{selectedProcess.responsavel}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span style={{color: '#666', fontSize: '14px'}}>Permanência:</span>
                      <span style={{
                        fontWeight: '600', 
                        fontSize: '14px',
                        color: getPermanenciaColor(selectedProcess.permanencia)
                      }}>
                        {selectedProcess.permanencia} dias
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.observationsSection}>
                  <h4 style={styles.observationsTitle}>
                    📝 Observações
                  </h4>
                  <div style={styles.observationsText}>
                    {selectedProcess.observacoes || 'Nenhuma observação registrada.'}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App

