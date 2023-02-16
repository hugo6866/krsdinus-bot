const parseHTML = (html, selector) => {
  const $ = cheerio.load(html);
  const results = [];
  $(selector).each((i, el) => {
    results.push($(el).text());
  });
  console.log(results);
  if (results.length === 1) {
    return results[0];
  } else {
    return results;
  }
};
module.exports = {
  parseHTML
};