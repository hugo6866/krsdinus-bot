function parseSessionFromJSON(jsonData) {
  const data = JSON.parse(jsonData);
  const session = data.session;
  const csrf = data.csrf;

    return {
        csrf,
        session
    };
}

module.exports = { parseSessionFromJSON };
