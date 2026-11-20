import React, { useEffect } from 'react';
import { useSession, signInUrl } from '../gq/auth';
import { Page } from '../gq/ui';
import { Spinner } from './ui';
import './keys.css';

/** Key pages need a sign-in: send visitors to the login page and back to this exact docs page. */
const Protected = ({ children }) => {
  const { loading, user } = useSession();
  useEffect(() => { if (!loading && !user) window.location.href = signInUrl(window.location.href); }, [loading, user]);
  if (loading || !user) return <Page><div className="gq-keys"><Spinner text={loading ? 'Checking your sign-in…' : 'Taking you to sign in…'} /></div></Page>;
  return <Page><div className="gq-keys">{children}</div></Page>;
};
export default Protected;
