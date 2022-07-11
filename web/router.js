const fs = require("fs");
const path = require("path");

function getLanguages() {
  const languagesFolderPath = path.join(__dirname, "/data/translations");
  return fs
    .readdirSync(languagesFolderPath)
    .map((fileName) => fileName.split(".")[0]);
}

function getFaviconsFiles() {
  const faviconsFolderPath = path.join(__dirname, "/src/favicons");
  return fs.readdirSync(faviconsFolderPath);
}

module.exports = {
  auto: false,
  custom: (data) => {
    const languages = getLanguages();
    const defaultLanguage = data.settings.defaultLanguage;

    const result = {};

    getFaviconsFiles().forEach((file) => {
      result[file] = { target: `favicons/${file}` };
    });

    result["main.js"] = { target: "scripts/main.js" };
    result["style.css"] = { target: "style/main.scss" };

    languages.forEach((lang) => {
      const p = `${defaultLanguage === lang ? "" : `${lang}/`}index.html`;
      result[p] = {
        target: "views/index.ejs",
        params: {
          _t: data.translations[lang],
          activeLanguage: lang,
        },
      };
    });

    return result;
  },
};
