import React from 'react';
import { Link } from 'react-router-dom';
import { Page, Code } from '../gq/ui';

const URL = 'https://mcp.globalquran.com';

const TOOLS = [
  ['list_editions', 'Find edition ids: Arabic text, translations in 41 languages, tafsir, transliteration. Filter by language, type or name.'],
  ['list_surahs', 'The 114 surahs with names, ayah counts, juz and Meccan or Medinan.'],
  ['get_ayah', 'One ayah (2:255 or a number 1 to 6236) in up to 5 editions side by side.'],
  ['get_surah', 'A whole surah, or part of it with from_ayah and to_ayah.'],
  ['get_page', 'One page (1 to 604) of the Madinah mushaf.'],
  ['get_juz', 'One juz (1 to 30). Ask for one or two editions, a juz is long.'],
  ['list_reciters', 'Reciters with verse-by-verse or whole-surah recordings.'],
  ['get_audio_url', 'The audio file address for an ayah or a surah, in mp3 or ogg.'],
];

const CLIENTS = [
  ['Claude (web and desktop)', 'Settings, Connectors, Add custom connector. Paste the address below. (Or find Global Quran in the Connectors directory once it is listed.)', URL],
  ['Claude Code', 'Run this in your terminal:', `claude mcp add --transport http globalquran ${URL}`],
  ['ChatGPT', 'Settings, Apps, turn on developer mode, then add a custom connector with the address below. (Or find Global Quran in the directory once it is listed.)', URL],
  ['Cursor, VS Code and other clients', 'Any client that supports remote MCP (Streamable HTTP). Add this to its MCP settings:', `{\n  "mcpServers": {\n    "globalquran": { "url": "${URL}" }\n  }\n}`],
];

const EXAMPLES = [
  'Show Ayat al-Kursi in Arabic with the Sahih International translation.',
  'Compare 1:1 to 1:7 in English, Urdu and French.',
  'Which Turkish translations do you have?',
  'Give me the audio link for Al-Fatihah by Abdul Basit.',
  'Which surahs were revealed in Madinah and have fewer than 20 ayahs?',
];

const McpPage = () => (
  <Page>
    <div className="hero">
      <div className="in" style={{ paddingTop: 40, paddingBottom: 40, display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 460px' }}>
          <div className="eyebrow">MCP · for AI assistants</div>
          <h1 className="h1" style={{ fontSize: 38, margin: '12px 0 10px' }}>Give your AI assistant the Quran.</h1>
          <p className="lead">Connect Claude, ChatGPT or any MCP client to Global Quran. It reads the real text in Arabic and about 95 translations, and links recitation audio, instead of quoting from memory. Free, read-only, no key and no sign-in.</p>
        </div>
        <div style={{ flex: '1 1 360px' }}>
          <div className="card" style={{ background: '#263032', borderColor: '#465052', color: '#efe9d6' }}>
            <div className="h3">Server address</div>
            <div style={{ marginTop: 10 }}><Code text={URL} caption="Streamable HTTP, no sign-in" /></div>
          </div>
        </div>
      </div>
    </div>

    <div className="in twocol" style={{ paddingTop: 28 }}>
      <div>
        <h2 className="h2" style={{ margin: '0 0 12px', fontSize: 22 }}>Connect it</h2>
        <div className="grid" style={{ gap: 14 }}>
          {CLIENTS.map(([name, how, code]) => (
            <div className="card" key={name}>
              <div className="h3">{name}</div>
              <div className="small mute" style={{ margin: '6px 0 10px' }}>{how}</div>
              <Code text={code} caption="" />
            </div>
          ))}
        </div>

        <h2 className="h2" style={{ margin: '30px 0 12px', fontSize: 22 }}>Then ask</h2>
        <div className="card">
          {EXAMPLES.map((e) => <div className="step" style={{ marginTop: 8 }} key={e}><i>›</i><div className="small">{e}</div></div>)}
        </div>

        <h2 className="h2" style={{ margin: '30px 0 12px', fontSize: 22 }}>Tools</h2>
        <div className="card" style={{ padding: 0 }}>
          <table>
            <thead><tr><th>Tool</th><th>What it does</th></tr></thead>
            <tbody>{TOOLS.map(([n, d]) => <tr key={n}><td className="mono">{n}</td><td className="small">{d}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="small mute" style={{ marginTop: 8 }}>Every tool only reads public data and changes nothing. Edition ids such as <span className="mono">quran-simple</span> or <span className="mono">en.sahih</span> come from <span className="mono">list_editions</span>; see <Link to="/how-it-works">how ids work</Link>.</div>
      </div>

      <div className="aside">
        <div className="card"><div className="h3">Limits</div>
          <div className="small mute" style={{ marginTop: 6 }}>Up to 5 editions per request, and very long requests are refused with a hint to ask for less. A fair-use limit applies per address. There is no keyword search yet, and only two tafsir editions.</div></div>
        <div className="card"><div className="h3">Building your own app?</div>
          <div className="small mute" style={{ margin: '6px 0 10px' }}>MCP is for AI assistants. For code, use the REST API.</div>
          <Link className="btn s" to="/api">Quran API</Link></div>
        <div className="card"><div className="h3">Privacy</div>
          <div className="small mute" style={{ margin: '6px 0 10px' }}>No account, and your conversation never reaches us. Only the request and standard logs.</div>
          <Link className="btn s" to="/mcp/privacy">MCP privacy</Link></div>
        <div className="frame" style={{ padding: 18 }}><div className="h3">Keeping this online costs money</div>
          <div className="small mute" style={{ margin: '6px 0 12px' }}>It is free and has no ads, paid by donors.</div>
          <a className="btn g s" href="/donate">Support Global Quran</a></div>
      </div>
    </div>
  </Page>
);

export const McpPrivacyPage = () => (
  <Page>
    <div className="in" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 760 }}>
      <div className="eyebrow">MCP · privacy</div>
      <h1 className="h1" style={{ fontSize: 34, margin: '12px 0 16px' }}>Privacy: Global Quran MCP server</h1>
      <p className="lead">The MCP server at mcp.globalquran.com lets AI assistants read Quran text, translations and recitation links. It needs no account.</p>
      <div className="card" style={{ marginTop: 18 }}>
        <p><b>What we receive.</b> The requests your assistant sends (for example "ayah 2:255 in en.sahih"), your network address and the time. We do not receive your conversation, your name or any account.</p>
        <p><b>How we use it.</b> To answer the request, to keep the service running and to limit abuse. A short-lived per-address request counter is kept in memory only.</p>
        <p><b>What we store.</b> Standard service logs (time, request, status, address) for troubleshooting and capacity planning. We do not sell this, share it for advertising or build profiles.</p>
        <p><b>Third parties.</b> The server calls our own Global Quran API, and Cloudflare handles traffic for globalquran.com. Your AI assistant's provider (Anthropic, OpenAI or another) handles your conversation under its own policy.</p>
        <p><b>Retention.</b> Logs are kept only as long as needed for the purposes above.</p>
        <p style={{ marginBottom: 0 }}><b>Contact.</b> <a href="mailto:info@globalquran.com">info@globalquran.com</a>. Our website's general <a href="https://globalquran.com/privacy">privacy page</a> and <a href="https://globalquran.com/terms">terms</a> also apply.</p>
      </div>
      <div style={{ marginTop: 18 }}><Link className="btn s" to="/mcp">Back to MCP</Link></div>
    </div>
  </Page>
);

export default McpPage;
