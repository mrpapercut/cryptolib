import Base64 from './Encoders/Base64';
import Hex    from './Encoders/Hex';
import Latin1 from './Encoders/Latin1';
import UTF8   from './Encoders/UTF8';
import UTF16  from './Encoders/UTF16';

const Encoder = {
	Base64:  Base64,
	Hex:     Hex,
	Latin1:  Latin1,
	Utf8:    UTF8,
	Utf16:   UTF16.UTF16BE,
	Utf16BE: UTF16.UTF16BE,
	Utf16LE: UTF16.UTF16LE
}

export default Encoder;
