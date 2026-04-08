import React, { useEffect } from 'react';
import { usePavyonStore } from '../store/usePavyonStore';
import { socket } from '../hooks/useSocket';

export const AdminPanel = () => {
  const { vipTables, eventHistory, balances, serviceStatus, setServiceStatus } = usePavyonStore();

  useEffect(() => {
    // Sayfa açıldığında ilk verileri çek
    socket.emit('get_all_balances');
    socket.emit('get_service_status');

    const interval = setInterval(() => {
      socket.emit('get_all_balances');
    }, 3000);

    // Servis durumu değiştiğinde state'i güncelle
    socket.on('service_status_update', (data) => {
      setServiceStatus(data.status);
    });

    return () => {
      clearInterval(interval);
      socket.off('service_status_update');
    };
  }, [setServiceStatus]);

  const panelStyle = {
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div style={panelStyle}>
      <h1 style={{ borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '2rem' }}>🎛️ Pavyon Yönetim Paneli</h1>
      
      {/* YENİ: SERVİS KONTROL KARTI */}
      <div style={{ ...cardStyle, marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#f8fafc', marginTop: 0, marginBottom: '0.5rem' }}>🔌 Backend Servis Kontrolü</h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>Kick dinleme servisi. Başlatıldıktan 1 saat sonra sunucuyu yormamak için otomatik kapanır.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            backgroundColor: serviceStatus ? '#166534' : '#7f1d1d',
            color: serviceStatus ? '#4ade80' : '#f87171',
            fontWeight: 'bold'
          }}>
            Durum: {serviceStatus ? '🟢 AKTİF' : '🔴 PASİF'}
          </span>
          {!serviceStatus ? (
            <button 
              onClick={() => socket.emit('start_kick_service')} 
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Başlat
            </button>
          ) : (
            <button 
              onClick={() => socket.emit('stop_kick_service')} 
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Durdur
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
        
        {/* VIP MASALAR */}
        <div style={cardStyle}>
          <h2 style={{ color: '#fbbf24', marginTop: 0 }}>🛋️ VIP Masalar</h2>
          <div>
            <h3>Loca 1 ({vipTables.table1.length}/2)</h3>
            <ul>{vipTables.table1.map((u, i) => <li key={i}>{u}</li>)}</ul>
            {vipTables.table1.length === 0 && <span style={{color: '#64748b'}}>Boş</span>}
          </div>
          <div>
            <h3>Loca 2 ({vipTables.table2.length}/2)</h3>
            <ul>{vipTables.table2.map((u, i) => <li key={i}>{u}</li>)}</ul>
            {vipTables.table2.length === 0 && <span style={{color: '#64748b'}}>Boş</span>}
          </div>
        </div>

        {/* CANLI OLAY AKIŞI */}
        <div style={cardStyle}>
          <h2 style={{ color: '#38bdf8', marginTop: 0 }}>⚡ Son Olaylar</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto', fontSize: '0.9rem' }}>
            {eventHistory.length === 0 ? <span style={{color: '#64748b'}}>Henüz bir etkinlik yok.</span> : null}
            {eventHistory.map((item, index) => (
              <div key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
                <span style={{ color: '#94a3b8', marginRight: '10px' }}>[{item.time}]</span>
                {item.msg}
              </div>
            ))}
          </div>
        </div>

        {/* BAKİYELER */}
        <div style={cardStyle}>
          <h2 style={{ color: '#4ade80', marginTop: 0 }}>💰 Kullanıcı Bakiyeleri</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '0.5rem 0' }}>Kullanıcı</th>
                  <th style={{ padding: '0.5rem 0' }}>Bakiye</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((user, index) => (
                  <tr key={index}>
                    <td style={{ padding: '0.5rem 0', fontWeight: 'bold' }}>{user.username}</td>
                    <td style={{ padding: '0.5rem 0', color: '#4ade80' }}>{user.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};