import { useEffect, useState } from 'react';

const getHash = () => document.location.hash.replace('#', '');

const useHash = () => {
  const [hash, setHash] = useState(getHash());
  useEffect(() => {
    function handleHashChange() {
      const hash = getHash() || 'basic';
      setHash(hash);
      window.scrollTo({ top: 0 });
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setHash]);
  return hash;
};

export default useHash;
