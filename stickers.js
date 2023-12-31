import { computed, ref, reactive } from 'vue';
import Note from './note.js';
import StaffSvg from './staffsvg.js';


export default {
	components: {
		StaffSvg,
	},
	setup(props, context) {
		const frequency_precision = ref(4);
		const clefs_visible = ref(true);
		const min_note_code = ref(36);
		const max_note_code = ref(84);
		const dimensions = reactive({
			// Akai Mini Play
			width_white: 12,
			width_black: 10.5,
			height_white: 30,
			height_black: 5,
			// Casio LK-247  (approximate sizes to be tested)
			// width_white: 13.2,
			// width_black: 14.3,
			// height_white: 70,
			// height_black: 5,
		});
		const temp_note = new Note(60);  // Just to fetch the default values for the options.
		const note_opts = reactive({
			...temp_note.opts
		});

		const all_notes_and_stats = computed(() => {
			let white_notes_count = 0;
			let black_notes_count = 0;
			let all_notes = [];

			let note = new Note(min_note_code.value, note_opts);
			while (note.code <= max_note_code.value) {
				if (note.is_major) {
					white_notes_count++;
				} else {
					black_notes_count++;
				}
				all_notes.push(note);
				note = note.next_semitone();
			}

			return {
				white_notes_count,
				black_notes_count,
				all_notes,
			};
		});

		return {
			frequency_precision,
			clefs_visible,
			min_note_code,
			max_note_code,
			dimensions,
			note_opts,
			inline_styles: computed(() => ({
				'--white-width': `${ dimensions.width_white }mm`,
				'--black-width': `${ dimensions.width_black }mm`,
				'--white-height': `${ dimensions.height_white }mm`,
				'--black-height': `${ dimensions.height_black }mm`,
			})),
			black_notes_count: computed(() => all_notes_and_stats.value.black_notes_count),
			white_notes_count: computed(() => all_notes_and_stats.value.white_notes_count),
			notes_count: computed(() => all_notes_and_stats.value.all_notes.length),
			all_notes: computed(() => all_notes_and_stats.value.all_notes),
			Note: Note,
		}
	}
}
