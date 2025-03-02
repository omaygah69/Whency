/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
	extend: {
	    colors: {
		bgColor: "#598da5",
		btnLight: "#c4d5dd",
		textLight: "#fbfff5",
		darkinBlue: "#143844",
		pinkisha: "#e8c6bc",
		blueish: "#164356",
	    },
	},
    },
    plugins: [],
}
