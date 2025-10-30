// Simple MetaMask helper — stores wallet address in localStorage as odrop_web3
async function connectMetaMask() {
  if(!window.ethereum) throw new Error('MetaMask not installed');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const addr = accounts[0];
  localStorage.setItem('odrop_web3', addr);
  return addr;
}
window.connectMetaMask = connectMetaMask;

// verify ownership by asking user to sign a nonce
async function signInWithMetaMask() {
  if(!window.ethereum) throw new Error('MetaMask not installed');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const addr = accounts[0];
  const nonce = 'odrop-sign-' + Math.floor(Math.random()*1e9);
  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [nonce, addr]
    });
    // record session: store address + signature + nonce
    odrop.storage.saveJSON('odrop_web3_session', { address: addr, signature, nonce, ts: Date.now() });
    localStorage.setItem('odrop_user_v1', addr); // optionally treat address as username
    return { addr, signature };
  } catch (err) {
    throw err;
  }
}
window.signInWithMetaMask = signInWithMetaMask;
