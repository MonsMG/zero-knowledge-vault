import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { decryptMessage } from '../utils/crypto';

export default function ReadSecret() {
  const { id } = useParams(); // เอา ID มาจาก URL
  const [decryptedMessage, setDecryptedMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = async () => {
    setLoading(true);
    try {
      // 1. ดึง Key จาก URL (ตัวที่อยู่หลังเครื่องหมาย #)
      const hash = window.location.hash;
      if (!hash) {
        setError('Missing decryption key! (Link might be broken)');
        setLoading(false);
        return;
      }
      const key = hash.substring(1); // ตัดเครื่องหมาย # ออก

      // 2. เรียก API ไปขอ Ciphertext จาก Server
      const API_URL = 'https://secret-vault-api-d2r5.onrender.com';
      const response = await fetch(`${API_URL}/api/secret/${id}`);
      
      if (!response.ok) {
        throw new Error('Message not found or already destroyed.');
      }

      const data = await response.json();

      // 3. ถอดรหัสที่ฝั่ง Client
      const originalText = decryptMessage(data.cipherText, key);

      if (!originalText) {
        setError('Failed to decrypt. Invalid Key.');
      } else {
        setDecryptedMessage(originalText);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRevealed(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 text-center">
        
        {/* State 1: ยังไม่กดอ่าน */}
        {!isRevealed && !loading && (
          <div className="animate-pulse">
            <div className="text-6xl mb-6">📩</div>
            <h1 className="text-2xl text-white font-bold mb-2">You have a secure message</h1>
            <p className="text-slate-400 mb-8 text-sm">
              Warning: This message will self-destruct immediately after viewing.
            </p>
            <button
              onClick={handleReveal}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-red-500/50"
            >
              View Secret Message
            </button>
          </div>
        )}

        {/* State 2: กำลังโหลด */}
        {loading && (
          <div className="text-green-400">
            Fetching & Decrypting...
          </div>
        )}

        {/* State 3: อ่านสำเร็จ */}
        {decryptedMessage && (
          <div className="space-y-6">
            <div className="text-red-500 text-sm uppercase tracking-widest border-b border-red-900 pb-2 mb-4">
              Burned on Read
            </div>
            
            <div className="bg-black p-6 rounded-lg border border-green-900 shadow-inner text-left">
              <pre className="text-green-400 whitespace-pre-wrap break-words font-mono text-lg">
                {decryptedMessage}
              </pre>
            </div>

            <p className="text-slate-500 text-xs italic mt-4">
              This message no longer exists on the server.
            </p>

            <a href="/" className="inline-block text-slate-400 hover:text-white mt-4 underline">
              Create your own secret
            </a>
          </div>
        )}

        {/* State 4: Error (หาไม่เจอ/ลบไปแล้ว) */}
        {error && (
          <div>
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-xl text-red-500 font-bold mb-2">Message Destroyed</h2>
            <p className="text-slate-400">{error}</p>
            <a href="/" className="inline-block mt-6 px-6 py-2 bg-slate-700 text-white rounded hover:bg-slate-600">
              Create New Secret
            </a>
          </div>
        )}
        
      </div>
    </div>
  );
}