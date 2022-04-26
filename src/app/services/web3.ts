import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
 
let web3:any;
/**
 * Creates a new instance of Web3
 */
const init = async () => {

    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // We are in the browser and metamask is running.
      window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      
    } else {
        const providerOptions = {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId: 'ef7e07ecb9a94f5d9de70961f16b77d6',
              },
            },
          };
        const web3Modal = new Web3Modal({
            network: 'rinkeby',
            cacheProvider: true,
            providerOptions: providerOptions,
            theme: {
              background: 'rgb(39, 49, 56)',
              main: 'rgb(199, 199, 199)',
              secondary: 'rgb(136, 136, 136)',
              border: 'rgba(195, 195, 195, 0.14)',
              hover: 'rgb(16, 26, 32)',
            },
          });
      // We are on the server *OR* the user is not running metamask
      const provider = await web3Modal.connect();
      web3 = new Web3(provider);
    }
}
init();
 
export default web3;