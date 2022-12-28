/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                'admin-login-hotel': "url('/src/assets/images/bg.svg')",
            },
        },
        colors: {
            design: {
                charcoalblack: '#001529',
                greenLight: '#00b96b',
                lightGray: '#fafafa',
            },
            default: {
                1: '#F3F3F3',
                2: '#e1faeb',
                3: '#1890FF',
            },
            status: {
                1: '#00b96b',
                1.5: '#95DE64',
                2: '#FF5A5F',
                2.5: '#FF7875',
                3: '#FA8C16',
                3.5: '#FFC069',
                4: '#4D206D',
                4.5: '#ff7a45',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
