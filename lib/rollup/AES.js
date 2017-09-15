import BlockCipher from '../Helpers/BlockCipher';
import aes         from '../Ciphers/aes';
const AES         = new BlockCipher()._createHelper(new aes().algo());

export default AES;
