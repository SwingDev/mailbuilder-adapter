ect           = require('ect')
path          = require('path')
fs            = require('fs')
_             = require('lodash')
MailAdapter   = require('mail-worker').MailAdapter
MailComposer  = require('mailcomposer').MailComposer


class MailBuilder extends MailAdapter

  constructor: (@tplPath) ->
    throw new Error('You must give template path to use MailBuilder') unless @tplPath
    @mailRenderer = ect
      root: path.resolve @tplPath
      ext: '.ect'

  buildMail: (options, cb) ->
    {mailFrom, mailTo, mailSubject, mailTpl, mailData, mailHeaders, mailCC, mailBCC} = options

    unless mailFrom or mailTo or mailSubject or mailTpl
      throw new Error('You must run MailBuilder#buildMail with params: from, to, subject, template')

    htmlTemplatePath    = @getFileIfExists "#{mailTpl}.html.ect"
    txtTemplatePath     = @getFileIfExists "#{mailTpl}.txt.ect"
    generalTemplatePath = @getFileIfExists "#{mailTpl}.ect"

    mailOptions =
      from: mailFrom
      to: mailTo
      subject: mailSubject

    mailOptions.cc  = mailCC if mailCC?
    mailOptions.bcc = mailBCC if mailBCC?

    if htmlTemplatePath and txtTemplatePath
      mailOptions.html = @mailRenderer.render htmlTemplatePath, mailData
      mailOptions.body = @mailRenderer.render txtTemplatePath, mailData
    else if generalTemplatePath
      mailOptions.body = @mailRenderer.render generalTemplatePath, mailData
    else
      throw new Error('Did not find an email tpl at:\n - #{mailTpl}.ect')

    mailcomposer  = new MailComposer()
    mailcomposer.addHeader headerField, headerVal for headerField, headerVal of mailHeaders if mailHeaders
    mailcomposer.setMessageOption mailOptions

    mailcomposer.buildMessage (err, mimeBody) ->
      return cb(err) if err
      cb(null, mailFrom, mailTo, mimeBody)

  getFileIfExists: (filename) ->
    filePath = path.resolve (path.join @tplPath, filename)
    return if fs.existsSync(filePath) then filePath else false


module.exports = MailBuilder
