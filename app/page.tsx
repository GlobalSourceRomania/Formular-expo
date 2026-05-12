'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SpeedInsights } from "@vercel/speed-insights/next"

type FormData = {
  exhibition: string;
  company: string;
  country: string;
  county: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  type: string;
  equipmentInterest: string[];
  currentEquipment: string;
  additionalInfo: string;
  relevance: number;
  isExistingCompany?: boolean;
};

const DEFAULT_EXHIBITIONS = [
  'BSDA - Bucuresti 2026',
  'Robotics Expo - Brasov 2026',
  'Automotiv Expo Sibiu 2026',
];

const COUNTRIES = [
  { name: 'România', code: '+40' },
  { name: 'Afganistan', code: '+93' },
  { name: 'Albania', code: '+355' },
  { name: 'Algeria', code: '+213' },
  { name: 'Andorra', code: '+376' },
  { name: 'Angola', code: '+244' },
  { name: 'Antigua și Barbuda', code: '+1-268' },
  { name: 'Arabia Saudită', code: '+966' },
  { name: 'Argentin', code: '+54' },
  { name: 'Armenia', code: '+374' },
  { name: 'Australia', code: '+61' },
  { name: 'Austria', code: '+43' },
  { name: 'Azerbaidjan', code: '+994' },
  { name: 'Bahama', code: '+1-242' },
  { name: 'Bahrain', code: '+973' },
  { name: 'Bangladesh', code: '+880' },
  { name: 'Barbados', code: '+1-246' },
  { name: 'Belgia', code: '+32' },
  { name: 'Belize', code: '+501' },
  { name: 'Benin', code: '+229' },
  { name: 'Bhutan', code: '+975' },
  { name: 'Bielorusia', code: '+375' },
  { name: 'Birmania', code: '+95' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Bosnia și Herțegovina', code: '+387' },
  { name: 'Botswana', code: '+267' },
  { name: 'Brazilia', code: '+55' },
  { name: 'Brunei', code: '+673' },
  { name: 'Bulgaria', code: '+359' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Burundi', code: '+257' },
  { name: 'Cambodgia', code: '+855' },
  { name: 'Camerun', code: '+237' },
  { name: 'Canada', code: '+1' },
  { name: 'Canalele Cook', code: '+682' },
  { name: 'Cape Verde', code: '+238' },
  { name: 'Catar', code: '+974' },
  { name: 'Cehia', code: '+420' },
  { name: 'Ciad', code: '+235' },
  { name: 'Chile', code: '+56' },
  { name: 'China', code: '+86' },
  { name: 'Cipru', code: '+357' },
  { name: 'Coasta de Fildeş', code: '+225' },
  { name: 'Colombia', code: '+57' },
  { name: 'Comoreле', code: '+269' },
  { name: 'Congo', code: '+242' },
  { name: 'Congo Democratic', code: '+243' },
  { name: 'Coreea de Nord', code: '+850' },
  { name: 'Coreea de Sud', code: '+82' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Croația', code: '+385' },
  { name: 'Cuba', code: '+53' },
  { name: 'Danemarca', code: '+45' },
  { name: 'Djibouti', code: '+253' },
  { name: 'Dominica', code: '+1-767' },
  { name: 'Egipt', code: '+20' },
  { name: 'Emiratele Arabe Unite', code: '+971' },
  { name: 'Ecuado', code: '+593' },
  { name: 'Eritreea', code: '+291' },
  { name: 'Estonia', code: '+372' },
  { name: 'Etiopia', code: '+251' },
  { name: 'Fiji', code: '+679' },
  { name: 'Filipine', code: '+63' },
  { name: 'Finlanda', code: '+358' },
  { name: 'Franța', code: '+33' },
  { name: 'Gabon', code: '+241' },
  { name: 'Gambia', code: '+220' },
  { name: 'Gaza', code: '+970' },
  { name: 'Georgia', code: '+995' },
  { name: 'Germania', code: '+49' },
  { name: 'Ghana', code: '+233' },
  { name: 'Gibraltar', code: '+350' },
  { name: 'Grecia', code: '+30' },
  { name: 'Grenada', code: '+1-473' },
  { name: 'Groenlanda', code: '+299' },
  { name: 'Guam', code: '+1-671' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Guernsey', code: '+44-1481' },
  { name: 'Guinea', code: '+224' },
  { name: 'Guinea Ecuatorială', code: '+240' },
  { name: 'Guinea-Bissau', code: '+245' },
  { name: 'Guyana', code: '+592' },
  { name: 'Haiti', code: '+509' },
  { name: 'Honduras', code: '+504' },
  { name: 'Hong Kong', code: '+852' },
  { name: 'Ungaria', code: '+36' },
  { name: 'India', code: '+91' },
  { name: 'Indonezia', code: '+62' },
  { name: 'Irak', code: '+964' },
  { name: 'Iran', code: '+98' },
  { name: 'Irlanda', code: '+353' },
  { name: 'Islanda', code: '+354' },
  { name: 'Islanda Norfolk', code: '+672' },
  { name: 'Israel', code: '+972' },
  { name: 'Italia', code: '+39' },
  { name: 'Jamaica', code: '+1-876' },
  { name: 'Japonia', code: '+81' },
  { name: 'Jersey', code: '+44-1534' },
  { name: 'Iordania', code: '+962' },
  { name: 'Kazakhstan', code: '+7' },
  { name: 'Kenya', code: '+254' },
  { name: 'Kirgizstan', code: '+996' },
  { name: 'Kiribati', code: '+686' },
  { name: 'Kosovo', code: '+383' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Laos', code: '+856' },
  { name: 'Lesotho', code: '+266' },
  { name: 'Letonia', code: '+371' },
  { name: 'Liban', code: '+961' },
  { name: 'Liberia', code: '+231' },
  { name: 'Libia', code: '+218' },
  { name: 'Liechtenstein', code: '+423' },
  { name: 'Lituania', code: '+370' },
  { name: 'Luxemburg', code: '+352' },
  { name: 'Macao', code: '+853' },
  { name: 'Madagascar', code: '+261' },
  { name: 'Malawi', code: '+265' },
  { name: 'Malaiesie', code: '+60' },
  { name: 'Maldive', code: '+960' },
  { name: 'Mali', code: '+223' },
  { name: 'Malta', code: '+356' },
  { name: 'Marianele de Nord', code: '+1-670' },
  { name: 'Marocco', code: '+212' },
  { name: 'Martinique', code: '+596' },
  { name: 'Mauritania', code: '+222' },
  { name: 'Mauritius', code: '+230' },
  { name: 'Mayotte', code: '+262' },
  { name: 'Marea Britanie', code: '+44' },
  { name: 'Mexic', code: '+52' },
  { name: 'Micronesia', code: '+691' },
  { name: 'Midway', code: '+1-808' },
  { name: 'Moldova', code: '+373' },
  { name: 'Monaco', code: '+377' },
  { name: 'Mongolia', code: '+976' },
  { name: 'Muntenegru', code: '+382' },
  { name: 'Montserrat', code: '+1-664' },
  { name: 'Mozambic', code: '+258' },
  { name: 'Namibia', code: '+264' },
  { name: 'Nauru', code: '+674' },
  { name: 'Nepal', code: '+977' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'Niger', code: '+227' },
  { name: 'Nigeria', code: '+234' },
  { name: 'Niue', code: '+683' },
  { name: 'Olanda', code: '+31' },
  { name: 'Noile Hebrizi', code: '+678' },
  { name: 'Noua Zeelandă', code: '+64' },
  { name: 'Norvegia', code: '+47' },
  { name: 'Oman', code: '+968' },
  { name: 'Pakistan', code: '+92' },
  { name: 'Palau', code: '+680' },
  { name: 'Palestina', code: '+970' },
  { name: 'Panama', code: '+507' },
  { name: 'Papua Noua Guinee', code: '+675' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Peru', code: '+51' },
  { name: 'Polinezia Franceză', code: '+689' },
  { name: 'Polonia', code: '+48' },
  { name: 'Portugalia', code: '+351' },
  { name: 'Puerto Rico', code: '+1-787' },
  { name: 'Reunion', code: '+262' },
  { name: 'Rwanda', code: '+250' },
  { name: 'Saint Kitts și Nevis', code: '+1-869' },
  { name: 'Santa Lucia', code: '+1-758' },
  { name: 'Sankt Vincent și Grenadinele', code: '+1-784' },
  { name: 'San Marino', code: '+378' },
  { name: 'Sao Tome și Principe', code: '+239' },
  { name: 'Senegal', code: '+221' },
  { name: 'Serbia', code: '+381' },
  { name: 'Seychelle', code: '+248' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Singapore', code: '+65' },
  { name: 'Siria', code: '+963' },
  { name: 'Slovacia', code: '+421' },
  { name: 'Slovenia', code: '+386' },
  { name: 'Solomon', code: '+677' },
  { name: 'Somalia', code: '+252' },
  { name: 'Spania', code: '+34' },
  { name: 'Sri Lanka', code: '+94' },
  { name: 'Statele Unitaire ale Americii', code: '+1' },
  { name: 'Sudaful', code: '+249' },
  { name: 'Sudul Sudanului', code: '+211' },
  { name: 'Suedia', code: '+46' },
  { name: 'Elveția', code: '+41' },
  { name: 'Surinam', code: '+597' },
  { name: 'Swaziland', code: '+268' },
  { name: 'Tadjikistan', code: '+992' },
  { name: 'Tailanda', code: '+66' },
  { name: 'Taiwan', code: '+886' },
  { name: 'Tanzania', code: '+255' },
  { name: 'Teritoriile Britanice din Indian Ocean', code: '+246' },
  { name: 'Teritoriile Franceze din Southern Ocean', code: '+262' },
  { name: 'Timor de Est', code: '+670' },
  { name: 'Togo', code: '+228' },
  { name: 'Tonga', code: '+676' },
  { name: 'Trinidad și Tobago', code: '+1-868' },
  { name: 'Tunisia', code: '+216' },
  { name: 'Turkmenistan', code: '+993' },
  { name: 'Turcia', code: '+90' },
  { name: 'Turks și Caicos', code: '+1-649' },
  { name: 'Tuvalu', code: '+688' },
  { name: 'Ucraina', code: '+380' },
  { name: 'Uganda', code: '+256' },
  { name: 'Uzbekistan', code: '+998' },
  { name: 'Vanuatu', code: '+678' },
  { name: 'Vatican', code: '+379' },
  { name: 'Venezuela', code: '+58' },
  { name: 'Vietnam', code: '+84' },
  { name: 'Virg. Britanice', code: '+1-284' },
  { name: 'Virg. S.U.A.', code: '+1-340' },
  { name: 'Yemen', code: '+967' },
  { name: 'Zambia', code: '+260' },
  { name: 'Zimbabwe', code: '+263' },
];

const COUNTIES = [
  'Alba', 'Arad', 'Arges', 'Bacau', 'Bihor', 'Bistrita-Nasaud',
  'Botosani', 'Braila', 'Brasov', 'Bucuresti', 'Buzau', 'Calarasi',
  'Cluj', 'Constanta', 'Covasna', 'Dambovita', 'Dolj', 'Galati',
  'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara', 'Ialomita', 'Iasi',
  'Ilfov', 'Maramures', 'Mehedinti', 'Mures', 'Neamt', 'Olt',
  'Prahova', 'Salaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman',
  'Timis', 'Tulcea', 'Valcea', 'Vaslui', 'Vrancea',
];

const EQUIPMENT_OPTIONS = [
  'Microscop',
  'Prepararea probelor',
  'Masurare',
  'Testare si analiza',
  'Mobilier industrial si de laborator',
  'Unelte de productie si inspectie automata',
];

const EMPTY_FORM: FormData = {
  exhibition: '',
  company: '',
  country: 'România',
  county: '',
  firstName: '',
  lastName: '',
  position: '',
  email: '',
  phone: '',
  type: '',
  equipmentInterest: [],
  currentEquipment: '',
  additionalInfo: '',
  relevance: 0,
};

function formatPhone(value: string, countryCode: string = '+40'): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return countryCode;

  const codeNum = countryCode.slice(1); // ex: '40' din '+40'
  let normalized = digits;

  // Dacă e țara România și începe cu 0, înlocuiește cu 4
  if (countryCode === '+40' && normalized.startsWith('0')) {
    normalized = '4' + normalized.slice(1);
  }

  // Dacă nu începe cu country code, adaug-o
  if (!normalized.startsWith(codeNum)) {
    normalized = codeNum + normalized;
  }

  const rest = normalized.slice(codeNum.length);
  let formatted = countryCode;
  if (rest.length > 0) formatted += ' ' + rest.slice(0, 3);
  if (rest.length > 3) formatted += ' ' + rest.slice(3, 6);
  if (rest.length > 6) formatted += ' ' + rest.slice(6, 9);
  return formatted;
}

const inputClass =
  'w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00B4EF]/70 focus:bg-white/[0.09] transition-all text-sm';

const sectionClass =
  'bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.07] p-5 md:p-6';

const labelClass =
  'text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-3 block';

function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default function FormPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [exhibitions, setExhibitions] = useState<string[]>(DEFAULT_EXHIBITIONS);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);
  const [showCountries, setShowCountries] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sugRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/exhibitions')
      .then(r => r.json())
      .then((d: string[]) => { if (Array.isArray(d) && d.length) setExhibitions(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        sugRef.current && !sugRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setShowSug(false);
      if (
        countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node) &&
        countryInputRef.current && !countryInputRef.current.contains(e.target as Node)
      ) setShowCountries(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleCountrySearch = (val: string) => {
    setCountrySearch(val);
    const filtered = val.length === 0
      ? COUNTRIES
      : COUNTRIES.filter(c =>
          c.name.toLowerCase().includes(val.toLowerCase())
        );
    setFilteredCountries(filtered);
    setShowCountries(true);
  };

  const selectCountry = (countryName: string) => {
    setForm(f => ({ ...f, country: countryName, county: countryName !== 'România' ? '' : f.county }));
    setCountrySearch('');
    setShowCountries(false);
    setIsEditingCountry(false);
  };

  const updateRect = useCallback(() => {
    if (inputRef.current) setInputRect(inputRef.current.getBoundingClientRect());
  }, []);

  const handleCompany = useCallback((val: string) => {
    setForm(f => ({ ...f, company: val }));
    updateRect();
    clearTimeout(debounceRef.current);
    if (val.length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/companies/search?q=${encodeURIComponent(val)}`);
          const data: string[] = await res.json();
          setSuggestions(data);
          const isExisting = data.some(c => c.toLowerCase() === val.toLowerCase());
          setForm(f => ({ ...f, isExistingCompany: isExisting }));
          setShowSug(data.length > 0);
        } catch { /* ignore */ }
      }, 280);
    } else {
      setSuggestions([]);
      setShowSug(false);
      setForm(f => ({ ...f, isExistingCompany: false }));
    }
  }, [updateRect]);

  const toggleEquip = (item: string) =>
    setForm(f => ({
      ...f,
      equipmentInterest: f.equipmentInterest.includes(item)
        ? f.equipmentInterest.filter(e => e !== item)
        : [...f.equipmentInterest, item],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, equipmentInterest: form.equipmentInterest.join(', ') }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError('A aparut o eroare. Incearca din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-[#080D1A] flex items-center justify-center p-4"
        style={{ backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(141,198,63,0.07) 0%, transparent 60%)' }}
      >
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#8DC63F]/10 border border-[#8DC63F]/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9 text-[#8DC63F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Contact salvat!</h2>
          <p className="text-white/40 mb-8 text-sm">Datele au fost inregistrate cu succes.</p>
          <button
            onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }}
            className="px-8 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #00B4EF, #8DC63F)' }}
          >
            Contact nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#080D1A] pb-24"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(0,180,239,0.09) 0%, transparent 55%)' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#080D1A]/90 backdrop-blur-xl border-b border-white/[0.07] px-5 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-auto"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <a href="/admin" className="absolute right-5 text-white/25 hover:text-white/60 text-xs transition-colors tracking-wide uppercase">Admin</a>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 01 Expozitie */}
          <div className={sectionClass}>
            <span className={labelClass}>01 · Expozitie</span>
            <div className="space-y-2">
              {exhibitions.map(expo => (
                <button
                  key={expo}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, exhibition: expo }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    form.exhibition === expo
                      ? 'bg-[#00B4EF]/10 border-[#00B4EF]/50 text-[#00B4EF]'
                      : 'bg-white/[0.02] border-white/[0.07] text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all ${
                    form.exhibition === expo ? 'bg-[#00B4EF] border-[#00B4EF]' : 'border-white/20'
                  }`} />
                  {expo}
                </button>
              ))}
            </div>
          </div>

          {/* 02 Companie */}
          <div className={sectionClass}>
            <span className={labelClass}>02 · Companie</span>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={form.company}
                onChange={e => handleCompany(e.target.value)}
                onFocus={() => { updateRect(); suggestions.length > 0 && setShowSug(true); }}
                placeholder="Cauta sau scrie compania..."
                className={inputClass}
                autoComplete="off"
              />
              {mounted && showSug && suggestions.length > 0 && inputRect && createPortal(
                <div
                  ref={sugRef}
                  style={{
                    position: 'fixed',
                    top: inputRect.bottom + 6,
                    left: inputRect.left,
                    width: inputRect.width,
                    zIndex: 9999,
                  }}
                  className="bg-[#0D1525] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden"
                >
                  {suggestions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => { setForm(f => ({ ...f, company: s, isExistingCompany: true })); setShowSug(false); }}
                      className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/[0.06] text-sm border-b border-white/[0.05] last:border-0 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* 03 Tara + Judet + 04 Reprezentant */}
          <div className={sectionClass + ' space-y-5'}>
            {form.isExistingCompany && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-orange-400 text-xs">
                Compania există în bază. Județul se va completa automat.
              </div>
            )}
            <div>
              <span className={labelClass}>03 · Tara</span>
              <div className="relative">
                <input
                  ref={countryInputRef}
                  type="text"
                  value={isEditingCountry ? countrySearch : form.country}
                  onChange={e => {
                    setIsEditingCountry(true);
                    handleCountrySearch(e.target.value);
                  }}
                  onFocus={() => { setShowCountries(true); setIsEditingCountry(true); }}
                  placeholder="Cauta tara..."
                  className={inputClass}
                  autoComplete="off"
                />
                {mounted && showCountries && filteredCountries.length > 0 && (
                  <div
                    ref={countryDropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#0D1525] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                  >
                    {filteredCountries.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onMouseDown={() => selectCountry(c.name)}
                        className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/[0.06] text-sm border-b border-white/[0.05] last:border-0 transition-colors flex justify-between"
                      >
                        <span>{c.name}</span>
                        <span className="text-white/40 text-xs">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {form.country === 'România' && (
              <div className={form.isExistingCompany ? 'opacity-40 pointer-events-none' : ''}>
                <span className={labelClass}>03b · Judet</span>
                <div className="relative">
                  <select
                    value={form.county}
                    onChange={e => setForm(f => ({ ...f, county: e.target.value }))}
                    className={inputClass + ' appearance-none pr-10 cursor-pointer'}
                    style={{ colorScheme: 'dark' }}
                    disabled={form.isExistingCompany}
                  >
                    <option value="">Selecteaza judetul</option>
                    {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}

            <div>
              <span className={labelClass}>04 · Reprezentant</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  placeholder="Prenume"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  placeholder="Nume"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 05 06 07 Contact */}
          <div className={sectionClass + ' space-y-4'}>
            <div>
              <span className={labelClass}>05 · Functie</span>
              <input
                type="text"
                value={form.position}
                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                placeholder="Ex: Director tehnic"
                className={inputClass}
              />
            </div>
            <div>
              <span className={labelClass}>06 · Email</span>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value.trim().replace(/\s+/g, '') }))}
                  placeholder="email@companie.ro"
                  className={`${inputClass} ${
                    form.email && !isValidEmail(form.email)
                      ? 'border-orange-500/50 focus:border-orange-500/70'
                      : form.email && isValidEmail(form.email)
                      ? 'border-[#8DC63F]/50 focus:border-[#8DC63F]/70'
                      : ''
                  }`}
                />
                {form.email && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${
                    isValidEmail(form.email) ? 'text-[#8DC63F]' : 'text-orange-500'
                  }`}>
                    {isValidEmail(form.email) ? '✓' : '✗'}
                  </span>
                )}
              </div>
              {form.email && !isValidEmail(form.email) && (
                <p className="text-orange-400 text-xs mt-2">Format email invalid</p>
              )}
            </div>
            <div>
              <span className={labelClass}>07 · Telefon</span>
              <input
                type="tel"
                value={form.phone}
                onChange={e => {
                  const countryCode = COUNTRIES.find(c => c.name === form.country)?.code || '+40';
                  setForm(f => ({ ...f, phone: formatPhone(e.target.value, countryCode) }));
                }}
                placeholder={COUNTRIES.find(c => c.name === form.country)?.code + ' xxx xxx xxx'}
                className={inputClass + ' font-mono tracking-wide'}
              />
            </div>
          </div>

          {/* 08 Tip */}
          <div className={sectionClass}>
            <span className={labelClass}>08 · Tip contact</span>
            <div className="grid grid-cols-2 gap-3">
              {(['vendor', 'client'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`py-3.5 rounded-xl border font-semibold text-sm transition-all ${
                    form.type === t
                      ? t === 'vendor'
                        ? 'bg-[#8DC63F]/10 border-[#8DC63F]/50 text-[#8DC63F]'
                        : 'bg-[#00B4EF]/10 border-[#00B4EF]/50 text-[#00B4EF]'
                      : 'bg-white/[0.02] border-white/[0.07] text-white/40 hover:border-white/20'
                  }`}
                >
                  {t === 'vendor' ? 'Vendor' : 'Client'}
                </button>
              ))}
            </div>
          </div>

          {/* 09 Echipament */}
          <div className={sectionClass}>
            <span className={labelClass}>09 · Echipament de interes</span>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map(eq => {
                const sel = form.equipmentInterest.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEquip(eq)}
                    className={`px-3.5 py-2 rounded-full border text-xs font-medium transition-all ${
                      sel
                        ? 'bg-[#00B4EF]/10 border-[#00B4EF]/50 text-[#00B4EF]'
                        : 'bg-white/[0.02] border-white/[0.07] text-white/40 hover:border-white/20'
                    }`}
                  >
                    {sel && <span className="mr-1">✓</span>}{eq}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 10 11 Text */}
          <div className={sectionClass + ' space-y-4'}>
            <div>
              <span className={labelClass}>10 · Echipament folosit in prezent</span>
              <textarea
                value={form.currentEquipment}
                onChange={e => setForm(f => ({ ...f, currentEquipment: e.target.value }))}
                placeholder="Descriere echipamente actuale..."
                rows={3}
                className={inputClass + ' resize-none'}
              />
            </div>
            <div>
              <span className={labelClass}>11 · Informatie aditionala</span>
              <textarea
                value={form.additionalInfo}
                onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                placeholder="Orice alta informatie relevanta..."
                rows={3}
                className={inputClass + ' resize-none'}
              />
            </div>
          </div>

          {/* 12 Relevanta */}
          <div className={sectionClass}>
            <span className={labelClass}>12 · Relevanta lead</span>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, relevance: n }))}
                  className={`flex-1 h-14 rounded-2xl border text-xl font-bold transition-all ${
                    form.relevance === n
                      ? n >= 4
                        ? 'bg-[#8DC63F]/15 border-[#8DC63F]/60 text-[#8DC63F] scale-105'
                        : n === 3
                          ? 'bg-[#00B4EF]/15 border-[#00B4EF]/60 text-[#00B4EF] scale-105'
                          : 'bg-orange-500/12 border-orange-400/50 text-orange-400 scale-105'
                      : 'bg-white/[0.02] border-white/[0.07] text-white/25 hover:border-white/20'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-center text-white/20 text-[10px] mt-2 tracking-widest">1 = SCAZUT · 5 = INALT</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl font-bold text-sm tracking-wider text-white uppercase transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #00B4EF 0%, #5DC876 50%, #8DC63F 100%)',
              boxShadow: '0 8px 32px rgba(0,180,239,0.18)',
            }}
          >
            {submitting ? 'Se salveaza...' : 'Salveaza contact'}
          </button>

        </form>
      </main>
    </div>
  );
}
