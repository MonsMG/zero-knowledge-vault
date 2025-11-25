import { useState } from 'react';
import { generateKey, encryptMessage } from '../utils/crypto';

export default function CreateSecret() {
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;

    setLoading(true);

    try {
      // 1. สร้างกุญแจลับขึ้นมาเอง (Client-side)
      const key = generateKey();
      
      // 2. เข้ารหัสข้อความด้วยกุญแจนั้น
      const cipherText = encryptMessage(message, key);

      // 3. ส่ง "ข้อความที่เข้ารหัสแล้ว" ไปฝาก Server
      // (Server จะไม่มีวันรู้อ่านข้อความออก เพราะไม่มี key)
      const response = await fetch('http://localhost:3001/api/secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cipherText, ttl: 3600 }), // default 1 ชม.
      });

      const data = await response.json();

      // 4. สร้าง Link โดยเอา Key แปะไว้หลัง # (Server จะมองไม่เห็นส่วนหลัง #)
      const link = `${window.location.origin}/secret/${data.id}#${key}`;
      setGeneratedLink(link);

    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ Server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-green-400 mb-6 text-center font-mono">
          🔐 Zero-Knowledge Vault
        </h1>

        {!generatedLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2 font-mono">Your Secret Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 bg-slate-900 text-green-300 p-4 rounded-lg border border-slate-600 focus:border-green-500 focus:outline-none font-mono"
                placeholder="Write something confidential..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !message}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all font-mono"
            >
              {loading ? 'Encrypting & Sending...' : '🔒 Encrypt & Create Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h2 className="text-xl text-white font-bold">Secret Secured!</h2>
            <p className="text-slate-400 text-sm">Send this link to anyone. It will self-destruct after viewing.</p>
            
            <div className="bg-slate-900 p-4 rounded border border-slate-700 break-all text-green-300 font-mono text-sm">
              {generatedLink}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedLink);
                alert('Copied!');
              }}
              className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
            >
              Copy Link
            </button>
            
            <button
              onClick={() => { setMessage(''); setGeneratedLink(''); }}
              className="block w-full mt-2 text-slate-500 hover:text-slate-300 text-sm"
            >
              Create New Secret
            </button>
          </div>
        )}
      </div>
    </div>
  );
}