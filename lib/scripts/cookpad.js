// Description
//   A Hubot script that search cookpad
//
// Configuration:
//   None
//
// Commands:
//   hubot cookpad <keyword> - search cookpad
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var cheerio, request;
  request = require('request-b');
  cheerio = require('cheerio');
  return robot.respond(/cookpad (.+)$/i, function(res) {
    var keyword;
    keyword = res.match[1];
    return request({
      url: "http://cookpad.com/search/" + (encodeURIComponent(keyword))
    }).then(function(r) {
      var $, messages, recipes;
      $ = cheerio.load(r.body);
      recipes = [];
      $('.recipe-preview').each(function() {
        var e, img, title, url;
        e = $(this);
        img = e.find('.recipe-image img').attr('src');
        title = e.find('.recipe-text .recipe-title').text();
        url = e.find('.recipe-text .recipe-title').attr('href');
        return recipes.push({
          img: img,
          title: title,
          url: url
        });
      });
      messages = recipes.filter(function(_, i) {
        return i < 3;
      }).map(function(recipe) {
        return "" + recipe.img + "\#.jpg\n" + recipe.title + "\n" + recipe.url;
      }).join('\n');
      return res.send(messages);
    });
  });
};
