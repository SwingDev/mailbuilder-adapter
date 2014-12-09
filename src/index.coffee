ect           = require('ect')
path          = require('path')
fs            = require('fs')
_             = require('lodash')
MailAdapter   = require('mailworker').MailAdapter
MailComposer  = require('mailcomposer').MailComposer



class MailBuilder extends MailAdapter

  constructor: (@tplPath) ->
    throw new Error('You must give template path to use MailBuilder') unless @tplPath
    @mailRenderer = ect
      root: path.resolve @tplPath
      ext: '.ect'

  buildMail: (options, cb) ->
    {mailFrom, mailTo, mailSubject, mailTpl, mailData} = options

    htmlTemplatePath    = @getFileIfExists "#{mailTpl}.html.ect"
    txtTemplatePath     = @getFileIfExists "#{mailTpl}.txt.ect"
    generalTemplatePath = @getFileIfExists "#{mailTpl}.ect"

    unless mailFrom? and mailTo? and mailSubject? and mailTpl?
      throw new Error('You must run MailBuilder#buildMail with params: from, to, subject, template')

    mailOptions =
      from: mailFrom
      to: mailTo
      subject: mailSubject

    if htmlTemplatePath and txtTemplatePath
      mailOptions.html = @mailRenderer.render htmlTemplatePath, mailData
      mailOptions.body = @mailRenderer.render txtTemplatePath, mailData
    else if generalTemplatePath
      mailOptions.body = @mailRenderer.render generalTemplatePath, mailData
    else
      throw new Error('Did not find an email tpl at:\n - #{mailTpl}.ect')

    mailcomposer  = new MailComposer()
    mailcomposer.setMessageOption mailOptions

    mailcomposer.buildMessage (err, mimeBody) ->
      cb(err, mailFrom, mailTo, mimeBody)


  getFileIfExists: (filename) ->
    filePath = path.resolve (path.join @tplPath, filename)
    return if fs.existsSync(filePath) then filePath else false


module.exports = MailBuilder
  