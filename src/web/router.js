const fs = require('fs');
const path = require('path');

const languages = ['eu', 'es', 'en'];
const defaultLanguage = 'eu';

function getFaviconsFiles() {
    const faviconsFolderPath = path.join(__dirname, '/src/favicons');
    return fs.readdirSync(faviconsFolderPath);
}

module.exports = {
    auto: {
        exclude: '_src'
    },
    custom: (data) => {
        const result = {};

        getFaviconsFiles().forEach((file) => {
            result[file] = { target: `favicons/${file}` };
        });

        result['main.js'] = { target: 'scripts/main.js' };
        result['style.css'] = { target: 'style/main.scss' };

        languages.forEach(lang => {
            const p = `${defaultLanguage === lang ? '' : `${lang}/`}index.html`
            result[p] = { target: 'views/index.ejs', params: {
                _t: data.translations[lang],
                activeLanguage: lang
            }};
        });

        return result;
    }
}
