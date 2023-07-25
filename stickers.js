import { computed, ref, reactive } from 'vue';
import Note from './note.js';


export default {
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
}
