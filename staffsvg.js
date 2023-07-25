import { computed, ref, reactive } from 'vue';

export default {
	name: 'StaffSvg',
	props: {
		clef: {
			type: String,
			required: false,
		},
		notes: {
			type: Array,  // Of integers.
			required: false,
			default: [],
		},
	},
	setup(props, context) {
		const has_clef = computed(() => !!props.clef);
		const base_width = ref(20);
		const base_height = ref(3);
		const total_width = computed(() =>
			base_width.value * (props.notes.length + (has_clef.value ? 1 : 0))
		);

		return {
			has_clef,
			base_width,
			total_width,

			line_y(note) {
				const topmost_note = 15;
				return (topmost_note - note) * base_height.value;
			},
			index_x(index) {
				return (has_clef.value ? base_width.value : 0) + index * base_width.value;
			},
			auxiliary_lines: function*(note) {
				for (let i = 12; i <= note; i += 2) {
					yield i;
				}
				for (let i = 0; i >= note; i -= 2) {
					yield i;
				}
			},
		};
	},
	template: '#staffsvgtemplate',
}
