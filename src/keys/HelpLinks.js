import React from 'react'
import { Link } from 'react-router-dom'

/** Three ways onward from the key page: reference, help, basics */
const HelpLinks = () => (
  <div className="k-help">
    <Link className="k-link" to="/api/reference"><span className="ic">{'{ }'}</span><div><b>API reference</b><span>See every endpoint and press Run</span></div></Link>
    <Link className="k-link" to="/contact?subject=API%20Support"><span className="ic">?</span><div><b>Need help?</b><span>Ask us. A person answers.</span></div></Link>
    <Link className="k-link" to="/how-it-works"><span className="ic">i</span><div><b>How it works</b><span>Ayah numbers, text ids, URLs</span></div></Link>
  </div>
)
export default HelpLinks
