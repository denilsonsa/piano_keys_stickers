'use strict';

const { computed, ref, reactive } = Vue

class Note {
	// Inspired by these tables:
	// https://computermusicresource.com/midikeys.html
	// https://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
	// https://studiocode.dev/resources/midi-middle-c/
	// https://studiocode.dev/kb/MIDI/middle-c/
	// https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C
	// https://en.wikipedia.org/wiki/Octave#Octave_of_a_pitch
	//
	// And with help of this debugging tool:
	// https://hardwaretester.com/midi
	//
	// “The MIDI standard only says that the note number 60 is a C,
	// it does not say of which octave.”

	//////////////////////////////////////////////////
	// Static (class) methods and attributes below.

	// Reactive values.
	static reactive = reactive({
		middle_c_code: 60,  // MIDI value for the middle C.
		middle_c_clef: 'G',  // Can be either 'G' (treble), 'F' (bass), or 'C' (alto).
		middle_c_octave: 4,  // Can be either 3 or 4.
		solfege: {
			do: 'Do',
			re: 'Re',
			mi: 'Mi',
			fa: 'Fa',
			sol: 'Sol',
			la: 'La',
			si: 'Si',
		},
	});

	// Boilerplate getters.
	static get middle_c_code() {
		return Note.reactive.middle_c_code;
	}
	static get middle_c_clef() {
		return Note.reactive.middle_c_clef;
	}
	static get middle_c_octave() {
		return Note.reactive.middle_c_octave;
	}

	static get solfege_names() {
		const s = Note.reactive.solfege;
		return [
			s.do, '', s.re, '', s.mi,
			s.fa, '', s.sol, '', s.la, '', s.si,
		]
	};
	static letter_names = [
		'C', '', 'D', '', 'E',
		'F', '', 'G', '', 'A', '', 'B',
	];
	static piano_colors = [
		'white', 'black', 'white', 'black', 'white',
		'white', 'black', 'white', 'black', 'white', 'black', 'white',
	];

	// These images come from:
	// https://commons.wikimedia.org/wiki/Category:Musical_score_components_(2)
	// Their license is Public Domain
	static note_images = {
		35: 'Music_4g0.svg',

		36: 'Music_4a0.svg',  // 2 lines below
		38: 'Music_4b0.svg',
		40: 'Music_4c1.svg',  // 1 line below

		41: 'Music_4d1.svg',
		43: 'Music_4e1.svg',  // 1st line
		45: 'Music_4f1.svg',
		47: 'Music_4g1.svg',  // 2nd line

		48: 'Music_4a1.svg',
		50: 'Music_4b1.svg',  // 3rd line
		52: 'Music_4c2.svg',

		53: 'Music_4d2.svg',  // 4th line
		55: 'Music_4e2.svg',
		57: 'Music_4f2.svg',  // 5th line
		59: 'Music_4g2.svg',  // Bass clef ends

		60: {
			'F': 'Music_4a2.svg',
			'C': 'Music_4b1.svg',
			'G': 'Music_4c1.svg',
		},  // Middle C4
		62: 'Music_4d1.svg',  // Treble clef begins
		64: 'Music_4e1.svg',  // 1st line

		65: 'Music_4f1.svg',
		67: 'Music_4g1.svg',  // 2nd line
		69: 'Music_4a1.svg',
		71: 'Music_4b1.svg',  // 3rd line

		72: 'Music_4c2.svg',
		74: 'Music_4d2.svg',  // 4th line
		76: 'Music_4e2.svg',

		77: 'Music_4f2.svg',  // 5th line
		79: 'Music_4g2.svg',
		81: 'Music_4a2.svg',  // 1 line above
		83: 'Music_4b2.svg',

		84: 'Music_4c3.svg',  // 2 lines above
		86: 'Music_4d3.svg',
	};

	//////////////////////////////////////////////////
	// Instance methods below.

	// This Note object is immutable.
	constructor(code) {
		this.code = code;
		Object.freeze(this);
	}

	// Returns the current octave number.
	get octave() {
		return Math.floor(this.code / 12) - 5 + Note.middle_c_octave;
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
		return Note.solfege_names[this.offset];
	}
	// Returns the note name as a letter (English notation).
	get letter() {
		return Note.letter_names[this.offset];
	}
	// Which clef best represents this note?
	get staff_clef() {
		// Comparing to C4
		if (this.code > Note.middle_c_code) {
			return 'G';
		} else if (this.code < Note.middle_c_code) {
			return 'F';
		} else {
			// Middle C4 can be on either clef.
			return Note.middle_c_clef;
		}
	}
	// SVG image for the clef corresponding to this note.
	get staff_clef_img() {
		return `Music_Clef${this.staff_clef}.svg`;
	}
	// SVG image for this note.
	get staff_note_img() {
		if (this.code === Note.middle_c_code) {
			return Note.note_images[this.code][this.staff_clef];
		} else {
			return Note.note_images[this.code] || '';
		}
	}

	// White or black piano key color?
	// White keys are part of the Major scale.
	// Black keys are accidentals in the Major scale.
	get piano_color() {
		return Note.piano_colors[this.offset];
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

	// The following methods return a new Note object:
	add_semitones(qty) {
		return new Note(this.code + qty);
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

Vue.createApp({
	setup() {
		const black_notes_count = ref(0);
		const white_notes_count = ref(0);
		const min_note_code = ref(36);
		const max_note_code = ref(84);
		const dimensions = reactive({
			width_white: 12,
			width_black: 10.5,
			height_white: 30,
			height_black: 5,
		});

		return {
			clefs_style: ref('visible'),
			dimensions,
			inline_styles: computed(() => ({
				'--white-width': `${ dimensions.width_white }mm`,
				'--black-width': `${ dimensions.width_black }mm`,
				'--white-height': `${ dimensions.height_white }mm`,
				'--black-height': `${ dimensions.height_black }mm`,
			})),
			black_notes_count,
			white_notes_count,
			min_note_code,
			max_note_code,
			note_conf: Note.reactive,
			note_iterator: function*() {
				black_notes_count.value = 0;
				white_notes_count.value = 0;

				let note = new Note(min_note_code.value);
				while (note.code <= max_note_code.value) {
					if (note.is_major) {
						white_notes_count.value++;
					} else {
						black_notes_count.value++;
					}
					yield note;
					note = note.next_semitone();
					// note = note.next_major();
				}
			},
			Note: Note,
		}
	}
}).mount('#app')
