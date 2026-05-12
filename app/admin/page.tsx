'use client';

import { useState, useEffect } from 'react';

type Submission = {
  id: number;
  created_at: string;
  exhibition: string;
  company: string;
  country: string;
  county: string;
  first_name: string;
  last_name: string;
  position: string;
  email: string;
  phone: string;
  contact_type: string;
  equipment_interest: string;
  current_equipment: string;
  additional_info: string;
  relevance: number;
};

const cardClass = 'bg-white/[0.03] rounded-2xl border border-white/[0.07] p-5 md:p-6';
const btnBlue = 'px-4 py-2.5 bg-[#00B4EF]/10 border border-[#00B4EF]/40 text-[#00B4EF] rounded-xl text-sm font-medium hover:bg-[#00B4EF]/20 transition-colors';
const btnGreen = 'px-4 py-2.5 bg-[#8DC63F]/10 border border-[#8DC63F]/40 text-[#8DC63F] rounded-xl text-sm font-medium hover:bg-[#8DC63F]/20 transition-colors';
const inputEditClass = 'bg-white/[0.06] border border-white/[0.1] rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-[#00B4EF]/70 text-sm';

function EditForm({ submission, onSave, onCancel }: { submission: Submission; onSave: (s: Submission) => void; onCancel: () => void }) {
  const [edited, setEdited] = useState(submission);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={edited.first_name} onChange={e => setEdited({...edited, first_name: e.target.value})} placeholder="Prenume" className={inputEditClass} />
        <input type="text" value={edited.last_name} onChange={e => setEdited({...edited, last_name: e.target.value})} placeholder="Nume" className={inputEditClass} />
        <input type="email" value={edited.email} onChange={e => setEdited({...edited, email: e.target.value})} placeholder="Email" className={inputEditClass} />
        <input type="tel" value={edited.phone} onChange={e => setEdited({...edited, phone: e.target.value})} placeholder="Telefon" className={inputEditClass} />
        <input type="text" value={edited.position} onChange={e => setEdited({...edited, position: e.target.value})} placeholder="Functie" className={`${inputEditClass} col-span-2`} />
        <input type="text" value={edited.company} onChange={e => setEdited({...edited, company: e.target.value})} placeholder="Companie" className={`${inputEditClass} col-span-2`} />
        <input type="text" value={edited.county} onChange={e => setEdited({...edited, county: e.target.value})} placeholder="Judet" className={inputEditClass} />
        <select value={edited.contact_type} onChange={e => setEdited({...edited, contact_type: e.target.value})} className={`${inputEditClass} cursor-pointer`} style={{ colorScheme: 'dark' }}>
          <option value="">Tip</option>
          <option value="vendor">Vendor</option>
          <option value="client">Client</option>
        </select>
        <input type="number" value={edited.relevance} onChange={e => setEdited({...edited, relevance: parseInt(e.target.value)})} placeholder="Relevanta (1-5)" min="1" max="5" className={inputEditClass} />
      </div>
      <textarea value={edited.equipment_interest} onChange={e => setEdited({...edited, equipment_interest: e.target.value})} placeholder="Echipament interes" className={`${inputEditClass} w-full resize-none`} rows={2} />
      <div className="flex gap-2">
        <button onClick={() => onSave(edited)} className={btnGreen}>Salveaza</button>
        <button onClick={onCancel} className="px-4 py-2.5 bg-white/[0.05] border border-white/[0.1] text-white/70 rounded-xl text-sm font-medium hover:bg-white/[0.08] transition-colors">Anuleaza</button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [exhibitions, setExhibitions] = useState<string[]>([]);
  const [newExpo, setNewExpo] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'ok' | 'err'>('ok');
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const notify = (text: string, type: 'ok' | 'err' = 'ok') => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const load = async () => {
    try {
      const [sr, er] = await Promise.all([fetch('/api/submissions'), fetch('/api/exhibitions')]);
      const subs = await sr.json();
      const expos = await er.json();
      setSubmissions(Array.isArray(subs) ? subs : []);
      setExhibitions(Array.isArray(expos) ? expos : []);
    } catch { notify('Eroare la incarcare.', 'err'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSetup = async () => {
    const res = await fetch('/api/setup', { method: 'POST' });
    const d = await res.json();
    if (d.ok) { notify('Baza de date initializata!'); load(); }
    else notify('Eroare: ' + d.error, 'err');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/companies/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (d.ok) notify(`${d.count} companii importate cu succes.`);
      else notify('Eroare: ' + d.error, 'err');
    } catch { notify('Eroare la upload.', 'err'); }
    setUploading(false);
    e.target.value = '';
  };

  const handleAddExpo = async () => {
    if (!newExpo.trim()) return;
    await fetch('/api/exhibitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newExpo.trim() }),
    });
    setNewExpo('');
    load();
  };

  const handleDeleteExpo = async (name: string) => {
    if (!confirm(`Stergi "${name}"?`)) return;
    await fetch('/api/exhibitions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    load();
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm('Stergi acest contact?')) return;
    try {
      const res = await fetch('/api/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const d = await res.json();
      if (d.ok) { notify('Contact sters.'); load(); }
      else notify('Eroare: ' + d.error, 'err');
    } catch { notify('Eroare la stergere.', 'err'); }
  };

  const handleUpdateSubmission = async (submission: Submission) => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      const d = await res.json();
      if (d.ok) { notify('Contact actualizat.'); setEditingId(null); load(); }
      else notify('Eroare: ' + d.error, 'err');
    } catch { notify('Eroare la update.', 'err'); }
  };

  const byExhibition = submissions.reduce<Record<string, number>>((acc, s) => {
    if (s.exhibition) acc[s.exhibition] = (acc[s.exhibition] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen bg-[#080D1A] text-white pb-16"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(0,180,239,0.07) 0%, transparent 50%)' }}
    >
      {/* Header */}
      <header className="bg-[#080D1A]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-white font-bold text-base">Admin Panel</span>
            <span className="text-white/30 text-xs ml-2">Expo 2026</span>
          </div>
          <a href="/" className="text-[#00B4EF] text-xs hover:underline">← Formular</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-4">

        {msg && (
          <div className={`rounded-xl px-4 py-3 text-sm border ${
            msgType === 'ok'
              ? 'bg-[#8DC63F]/10 border-[#8DC63F]/30 text-[#8DC63F]'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {msg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={cardClass + ' col-span-2 md:col-span-1'}>
            <div className="text-3xl font-bold text-white">{submissions.length}</div>
            <div className="text-white/40 text-xs mt-1 uppercase tracking-wider">Total contacte</div>
          </div>
          {Object.entries(byExhibition).slice(0, 3).map(([expo, cnt]) => (
            <div key={expo} className={cardClass}>
              <div className="text-2xl font-bold text-[#00B4EF]">{cnt}</div>
              <div className="text-white/40 text-xs mt-1 leading-tight">{expo.split(' - ')[0]}</div>
            </div>
          ))}
        </div>

        {/* Setup */}
        <div className={cardClass}>
          <h2 className="font-semibold text-sm mb-1">Initializare baza de date</h2>
          <p className="text-white/30 text-xs mb-4">Prima rulare sau dupa modificari de schema.</p>
          <button onClick={handleSetup} className={btnBlue}>Initializeaza DB</button>
        </div>

        {/* Upload companies */}
        <div className={cardClass}>
          <h2 className="font-semibold text-sm mb-1">Import companii (CSV)</h2>
          <p className="text-white/30 text-xs mb-4">
            Inlocuieste lista de companii. Fisierul trebuie sa fie in formatul original (prima coloana = nume companie).
          </p>
          <label className={`inline-flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''} ${btnGreen}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploading ? 'Se incarca...' : 'Alege fisier CSV'}
            <input type="file" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {/* Exhibitions */}
        <div className={cardClass}>
          <h2 className="font-semibold text-sm mb-4">Expozitii</h2>
          <div className="space-y-2 mb-4">
            {exhibitions.map(e => (
              <div key={e} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                <span className="text-sm text-white/80">{e}</span>
                <button
                  onClick={() => handleDeleteExpo(e)}
                  className="text-red-400/40 hover:text-red-400 text-xs transition-colors ml-4"
                >
                  Sterge
                </button>
              </div>
            ))}
            {exhibitions.length === 0 && <p className="text-white/30 text-sm">Nicio expozitie. Initializeaza DB intai.</p>}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExpo}
              onChange={e => setNewExpo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExpo()}
              placeholder="Nume expozitie noua..."
              className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00B4EF]/70 text-sm"
            />
            <button onClick={handleAddExpo} className={btnBlue}>Adauga</button>
          </div>
        </div>

        {/* Submissions */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm">Contacte ({submissions.length})</h2>
            <button
              onClick={() => window.open('/api/export', '_blank')}
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #00B4EF, #8DC63F)' }}
            >
              Export CSV
            </button>
          </div>

          {loading ? (
            <p className="text-white/30 text-sm">Se incarca...</p>
          ) : submissions.length === 0 ? (
            <p className="text-white/30 text-sm">Nu exista contacte inca.</p>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-white/30 text-xs border-b border-white/[0.07]">
                    {['Data', 'Expozitie', 'Companie', 'Reprezentant', 'Judet', 'Email', 'Tip', 'R', 'Actiuni'].map(h => (
                      <th key={h} className="pb-3 text-left px-2 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => (
                    <>
                      <tr
                        key={s.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-2 text-white/30 text-xs cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>{new Date(s.created_at).toLocaleDateString('ro-RO')}</td>
                        <td className="py-3 px-2 text-white/70 text-xs cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>{s.exhibition?.split(' - ')[0]}</td>
                        <td className="py-3 px-2 text-white font-medium cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>{s.company}</td>
                        <td className="py-3 px-2 text-white/70 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>{s.first_name} {s.last_name}</td>
                        <td className="py-3 px-2 text-white/50 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>{s.county}</td>
                        <td className="py-3 px-2 text-[#00B4EF] text-xs cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>{s.email}</td>
                        <td className="py-3 px-2 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                          {s.contact_type && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              s.contact_type === 'vendor' ? 'bg-[#8DC63F]/15 text-[#8DC63F]' : 'bg-[#00B4EF]/15 text-[#00B4EF]'
                            }`}>
                              {s.contact_type}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                          <span className={`font-bold text-sm ${
                            s.relevance >= 4 ? 'text-[#8DC63F]' : s.relevance >= 3 ? 'text-[#00B4EF]' : 'text-orange-400'
                          }`}>{s.relevance || '-'}</span>
                        </td>
                        <td className="py-3 px-2 flex gap-2">
                          <button
                            onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                            className="text-[#00B4EF]/60 hover:text-[#00B4EF] text-xs transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(s.id)}
                            className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                          >
                            Sterge
                          </button>
                        </td>
                      </tr>
                      {expanded === s.id && (
                        <tr key={`exp-${s.id}`} className="bg-white/[0.02]">
                          <td colSpan={9} className="px-4 py-4">
                            {editingId === s.id ? (
                              <EditForm submission={s} onSave={handleUpdateSubmission} onCancel={() => setEditingId(null)} />
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                <div><span className="text-white/30 block mb-1">Telefon</span><span className="text-white font-mono">{s.phone || '—'}</span></div>
                                <div><span className="text-white/30 block mb-1">Functie</span><span className="text-white">{s.position || '—'}</span></div>
                                <div><span className="text-white/30 block mb-1">Echipament interes</span><span className="text-white">{s.equipment_interest || '—'}</span></div>
                                <div><span className="text-white/30 block mb-1">Echipament prezent</span><span className="text-white">{s.current_equipment || '—'}</span></div>
                                <div className="md:col-span-2"><span className="text-white/30 block mb-1">Info aditionala</span><span className="text-white">{s.additional_info || '—'}</span></div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
