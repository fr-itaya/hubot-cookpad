# Description
#   A Hubot script that search cookpad
#
# Configuration:
#   None
#
# Commands:
#   hubot cookpad <keyword> - search cookpad
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  request = require 'request-b'
  cheerio = require 'cheerio'

  robot.respond /cookpad (.+)$/i, (res) ->
    keyword = res.match[1]
    request
      url: "http://cookpad.com/search/#{encodeURIComponent(keyword)}"
    .then (r) ->
      $ = cheerio.load r.body
      recipes = []
      $('.recipe-preview').each ->
        e = $ @
        img = e.find('.recipe-image img').attr('src')
        title = e.find('.recipe-text .recipe-title').text()
        url = e.find('.recipe-text .recipe-title').attr('href')
        recipes.push { img, title, url }
      messages = recipes
        .filter (_, i) ->
          i < 3
        .map (recipe) ->
          """
          #{recipe.img}\#.jpg
          #{recipe.title}
          #{recipe.url}
          """
        .join '\n'
      res.send messages
