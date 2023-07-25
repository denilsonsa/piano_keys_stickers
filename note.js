class Note {
	// Inspired by these tables:
	// https://computermusicresource.com/midikeys.html
	// https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
	// https://studiocode.dev/resources/midi-middle-c/
	// https://studiocode.dev/kb/MIDI/middle-c/
	// https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C
	// https://en.wikipedia.org/wiki/Octave#Octave_of_a_pitch
	// https://en.wikipedia.org/wiki/Piano_key_frequencies
	//
	// And with help of this debugging tool:
	// https://hardwaretester.com/midi
	//
	// “The MIDI standard only says that the note number 60 is a C,
	// it does not say of which octave.”

	//////////////////////////////////////////////////
	// Getters fort the configuration values (opts)
	get middle_c_clef() {
		return this.opts.middle_c_clef;
	}
	get middle_c_octave() {
		return this.opts.middle_c_octave;
	}
	get solfege_names() {
		const s = this.opts.solfege;
		return [
			s.do, '', s.re, '', s.mi,
			s.fa, '', s.sol, '', s.la, '', s.si,
		]
	};

	//////////////////////////////////////////////////
	// Read-only constants
	get letter_names() {
		return [
			'C', '', 'D', '', 'E',
			'F', '', 'G', '', 'A', '', 'B',
		];
	}
	get piano_colors() {
		return [
			'white', 'black', 'white', 'black', 'white',
			'white', 'black', 'white', 'black', 'white', 'black', 'white',
		];
	}
	get middle_c_code() {
		return 60;  // MIDI value for the middle C
	}
	get a4_code() {
		return 69;  // MIDI value for A4, used as the reference note for tuning.
	}

	// Constants for calculating the vertical note position.
	get clef_offset() {
		return {
			'F8': 19,
			'F': 12,
			'C': 6,
			'G': 0,
			'G8': -7,
		}
	}
	get note_position_in_g_clef() {
		//         -O- A la  12
		//             G sol 11
		// .---------- F fa  10
		// |           E mi   9
		// |---------- D re   8
		// |           C do   7
		// |---------- B si   6
		// |           A la   5
		// |-G clef--- G sol  4
		// |           F fa   3
		// '---------- E mi   2
		//             D re   1
		//         -O- C do   0
		return {
			 0: -35,
			 2: -34,  // 12 lines below
			 4: -33,

			 5: -32,  // 11 lines below
			 7: -31,
			 9: -30,  // 10 lines below
			11: -29,

			12: -28,  // 9 lines below
			14: -27,
			16: -26,  // 8 lines below

			17: -25,
			19: -24,  // 7 lines below
			21: -23,
			23: -22,  // 6 lines below

			24: -21,
			26: -20,  // 5 lines below
			28: -19,

			29: -18,  // 4 lines below
			31: -17,
			33: -16,  // 3 lines below
			35: -15,

			36: -14,  // 2 lines below
			38: -13,
			40: -12,  // 1 line below

			41: -11,
			43: -10,  // 1st line
			45:  -9,
			47:  -8,  // 2nd line
                 
			48:  -7,
			50:  -6,  // 3rd line
			52:  -5,
                 
			53:  -4,  // 4th line
			55:  -3,
			57:  -2,  // 5th line
			59:  -1,  // Bass clef ends

			60:   0,  // Middle C4
			62:   1,  // Treble clef begins
			64:   2,  // 1st line

			65:   3,
			67:   4,  // 2nd line
			69:   5,
			71:   6,  // 3rd line

			72:   7,
			74:   8,  // 4th line
			76:   9,

			77:  10,  // 5th line
			79:  11,
			81:  12,  // 1 line above
			83:  13,

			84:  14,  // 2 lines above
			86:  15,
			88:  16,  // 3 lines above

			89:  17,
			91:  18,  // 4 lines above
			93:  19,
			95:  20,  // 5 lines above

			96:  21,
			98:  22,  // 6 lines above
			100: 23,

			101: 24,  // 7 lines above
			103: 25,
			105: 26,  // 8 lines above
			107: 27,

			108: 28,  // 9 lines above
			110: 29,
			112: 30,  // 10 lines above

			113: 31,
			115: 32,  // 11 lines above
			117: 33,
			119: 34,  // 12 lines above

			120: 35,
			122: 36,  // 13 lines above
			124: 37,

			125: 38,  // 14 lines above
			127: 39,
		};
	}

	//////////////////////////////////////////////////
	// Constructor

	// The Note object is immutable.
	// Usage:
	//   let doh = new Note(60);
	//   let custom_la = new Note(69, {frequency_a4: 444});
	// Parameters:
	//   code: Integer, the equivalent MIDI code for this note.
	//   opts: Object, options to fine tune how the notes are displayed.
	//   _opts_ref: DO NOT USE. (Internal use only.)
	constructor(code, opts, _opts_ref) {
		if (!Number.isInteger(code)) {
			throw new Error(`The first argument to Note() must be an integer, but we got: ${code}`);
		}

		this.code = code;

		// Minor optimization: store a reference to an existing opts object.
		// This is meant to be shared between all notes with the same opts.
		// This should not be used by external users of this class.
		if (_opts_ref) {
			this.opts = _opts_ref;
		} else {
			// Extracting sane values from user-supplied opts.
			// Also setting some default values in case they are not passed.
			const {
				middle_c_clef = 'G',  // Can be either 'G' (treble), 'F' (bass), or 'C' (alto).
				middle_c_octave = 4,  // Can be either 3 or 4.
				frequency_a4 = 440,  // Reference frequency in Hz.
				solfege = {
					do: 'Do',
					re: 'Re',
					mi: 'Mi',
					fa: 'Fa',
					sol: 'Sol',
					la: 'La',
					si: 'Si',
				},
			} = opts || {};

			this.opts = {
				middle_c_clef,
				middle_c_octave,
				frequency_a4,
				solfege,
			};
		}
		Object.freeze(this);
	}

	//////////////////////////////////////////////////
	// Instance methods (and getters)

	// Returns the current octave number.
	get octave() {
		return Math.floor(this.code / 12) - 5 + this.middle_c_octave;
	}
	// Returns the semitone offset inside the current octave.
	// Only used to index some arrays, not exposed to the end-user.
	get offset() {
		return this.code % 12;
		// This version should handle negative codes:
		//return ((this.code % 12) + 12) % 12;
	}

	// Returns the note name in Solfège notation.
	get solfege() {
		return this.solfege_names[this.offset];
	}
	// Returns the note name as a letter (English notation).
	get letter() {
		return this.letter_names[this.offset];
	}
	// Which clef best represents this note?
	get staff_clef() {
		if (this.is_middle_c) {
			// Middle C4 can be on either clef.
			return this.middle_c_clef || 'G';
		} else if (this.code >= 98) {
			// So high that it's out of bounds.
			return '';
		} else if (this.code > 84) {
			// https://www.dacapoalcoda.com/octaves-clefs
			return 'G8';
		} else if (this.code > this.middle_c_code) {
			return 'G';
		} else if (this.code < 24) {
			// So low that it's out of bounds.
			return '';
		} else if (this.code < 36) {
			return 'F8';
		} else if (this.code < this.middle_c_code) {
			return 'F';
		}
	}
	// Vertical note position, used for drawing the note in the staff.
	// Depends on the clef.
	note_position_in_clef(clef) {
		if (!clef) {
			return undefined;
		}
		const pos = this.note_position_in_g_clef[this.code];
		if (pos === undefined) {
			return undefined;
		}
		return pos + this.clef_offset[clef];
	}
	get note_position() {
		return this.note_position_in_clef(this.staff_clef);
	}

	// White or black piano key color?
	// White keys are part of the Major scale.
	// Black keys are accidentals in the Major scale.
	get piano_color() {
		return this.piano_colors[this.offset];
	}
	// Is this note part of the C Major scale?
	get is_major() {
		return this.piano_color === 'white';
	}
	// Do we have a flat note next to this one?
	get left_is_flat() {
		return this.prev_semitone().piano_color === 'black';
	}
	// Do we have a sharp note next to this one?
	get right_is_sharp() {
		return this.next_semitone().piano_color === 'black';
	}

	// Is this note the middle C?
	get is_middle_c() {
		return this.code === this.middle_c_code;
	}

	//////////////////////////////////////////////////
	// Methods that return a new Note object
	add_semitones(qty) {
		return new Note(this.code + qty, this.opts);
	}
	prev_semitone() {
		return this.add_semitones(-1);
	}
	next_semitone() {
		return this.add_semitones(1);
	}
	prev_major() {
		let note = this.prev_semitone();
		if (!note.is_major()) {
			note = note.prev_semitone();
		}
		return note;
	}
	next_major() {
		let note = this.next_semitone();
		if (!note.is_major()) {
			note = note.next_semitone();
		}
		return note;
	}
}

export default Note;
