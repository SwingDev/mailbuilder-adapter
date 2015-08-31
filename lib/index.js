var MailAdapter, MailBuilder, MailComposer, _, ect, fs, path,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ect = require('ect');

path = require('path');

fs = require('fs');

_ = require('lodash');

MailAdapter = require('mail-worker').MailAdapter;

MailComposer = require('mailcomposer').MailComposer;

MailBuilder = (function(superClass) {
  extend(MailBuilder, superClass);

  function MailBuilder(tplPath) {
    this.tplPath = tplPath;
    if (!this.tplPath) {
      throw new Error('You must give template path to use MailBuilder');
    }
    this.mailRenderer = ect({
      root: path.resolve(this.tplPath),
      ext: '.ect'
    });
  }

  MailBuilder.prototype.buildMail = function(options, cb) {
    var generalTemplatePath, headerField, headerVal, htmlTemplatePath, mailBCC, mailCC, mailData, mailFrom, mailHeaders, mailOptions, mailSubject, mailTo, mailTpl, mailcomposer, txtTemplatePath;
    mailFrom = options.mailFrom, mailTo = options.mailTo, mailSubject = options.mailSubject, mailTpl = options.mailTpl, mailData = options.mailData, mailHeaders = options.mailHeaders, mailCC = options.mailCC, mailBCC = options.mailBCC;
    if (!(mailFrom || mailTo || mailSubject || mailTpl)) {
      throw new Error('You must run MailBuilder#buildMail with params: from, to, subject, template');
    }
    htmlTemplatePath = this.getFileIfExists(mailTpl + ".html.ect");
    txtTemplatePath = this.getFileIfExists(mailTpl + ".txt.ect");
    generalTemplatePath = this.getFileIfExists(mailTpl + ".ect");
    mailOptions = {
      from: mailFrom,
      to: mailTo,
      subject: mailSubject
    };
    if (mailCC != null) {
      mailOptions.cc = mailCC;
    }
    if (mailBCC != null) {
      mailOptions.bcc = mailBCC;
    }
    if (htmlTemplatePath && txtTemplatePath) {
      mailOptions.html = this.mailRenderer.render(htmlTemplatePath, mailData);
      mailOptions.body = this.mailRenderer.render(txtTemplatePath, mailData);
    } else if (generalTemplatePath) {
      mailOptions.body = this.mailRenderer.render(generalTemplatePath, mailData);
    } else {
      throw new Error('Did not find an email tpl at:\n - #{mailTpl}.ect');
    }
    mailcomposer = new MailComposer();
    if (mailHeaders) {
      for (headerField in mailHeaders) {
        headerVal = mailHeaders[headerField];
        mailcomposer.addHeader(headerField, headerVal);
      }
    }
    mailcomposer.setMessageOption(mailOptions);
    return mailcomposer.buildMessage(function(err, mimeBody) {
      if (err) {
        return cb(err);
      }
      return cb(null, mailFrom, mailTo, mimeBody);
    });
  };

  MailBuilder.prototype.getFileIfExists = function(filename) {
    var filePath;
    filePath = path.resolve(path.join(this.tplPath, filename));
    if (fs.existsSync(filePath)) {
      return filePath;
    } else {
      return false;
    }
  };

  return MailBuilder;

})(MailAdapter);

module.exports = MailBuilder;

//# sourceMappingURL=data:application/json;base64,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O0lBRndCLENBQTFCO0VBOUJTOzt3QkFrQ1gsZUFBQSxHQUFpQixTQUFDLFFBQUQ7QUFDZixRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsT0FBWCxFQUFvQixRQUFwQixDQUFkO0lBQ0osSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBSDthQUFnQyxTQUFoQztLQUFBLE1BQUE7YUFBOEMsTUFBOUM7O0VBRlE7Ozs7R0ExQ087O0FBK0MxQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImVjdCAgICAgICAgICAgPSByZXF1aXJlKCdlY3QnKVxucGF0aCAgICAgICAgICA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgICAgICAgICAgICA9IHJlcXVpcmUoJ2ZzJylcbl8gICAgICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKVxuTWFpbEFkYXB0ZXIgICA9IHJlcXVpcmUoJ21haWwtd29ya2VyJykuTWFpbEFkYXB0ZXJcbk1haWxDb21wb3NlciAgPSByZXF1aXJlKCdtYWlsY29tcG9zZXInKS5NYWlsQ29tcG9zZXJcblxuXG5jbGFzcyBNYWlsQnVpbGRlciBleHRlbmRzIE1haWxBZGFwdGVyXG5cbiAgY29uc3RydWN0b3I6IChAdHBsUGF0aCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGdpdmUgdGVtcGxhdGUgcGF0aCB0byB1c2UgTWFpbEJ1aWxkZXInKSB1bmxlc3MgQHRwbFBhdGhcbiAgICBAbWFpbFJlbmRlcmVyID0gZWN0XG4gICAgICByb290OiBwYXRoLnJlc29sdmUgQHRwbFBhdGhcbiAgICAgIGV4dDogJy5lY3QnXG5cbiAgYnVpbGRNYWlsOiAob3B0aW9ucywgY2IpIC0+XG4gICAge21haWxGcm9tLCBtYWlsVG8sIG1haWxTdWJqZWN0LCBtYWlsVHBsLCBtYWlsRGF0YSwgbWFpbEhlYWRlcnMsIG1haWxDQywgbWFpbEJDQ30gPSBvcHRpb25zXG5cbiAgICB1bmxlc3MgbWFpbEZyb20gb3IgbWFpbFRvIG9yIG1haWxTdWJqZWN0IG9yIG1haWxUcGxcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgcnVuIE1haWxCdWlsZGVyI2J1aWxkTWFpbCB3aXRoIHBhcmFtczogZnJvbSwgdG8sIHN1YmplY3QsIHRlbXBsYXRlJylcblxuICAgIGh0bWxUZW1wbGF0ZVBhdGggICAgPSBAZ2V0RmlsZUlmRXhpc3RzIFwiI3ttYWlsVHBsfS5odG1sLmVjdFwiXG4gICAgdHh0VGVtcGxhdGVQYXRoICAgICA9IEBnZXRGaWxlSWZFeGlzdHMgXCIje21haWxUcGx9LnR4dC5lY3RcIlxuICAgIGdlbmVyYWxUZW1wbGF0ZVBhdGggPSBAZ2V0RmlsZUlmRXhpc3RzIFwiI3ttYWlsVHBsfS5lY3RcIlxuXG4gICAgbWFpbE9wdGlvbnMgPVxuICAgICAgZnJvbTogbWFpbEZyb21cbiAgICAgIHRvOiBtYWlsVG9cbiAgICAgIHN1YmplY3Q6IG1haWxTdWJqZWN0XG5cbiAgICBtYWlsT3B0aW9ucy5jYyAgPSBtYWlsQ0MgaWYgbWFpbENDP1xuICAgIG1haWxPcHRpb25zLmJjYyA9IG1haWxCQ0MgaWYgbWFpbEJDQz9cblxuICAgIGlmIGh0bWxUZW1wbGF0ZVBhdGggYW5kIHR4dFRlbXBsYXRlUGF0aFxuICAgICAgbWFpbE9wdGlvbnMuaHRtbCA9IEBtYWlsUmVuZGVyZXIucmVuZGVyIGh0bWxUZW1wbGF0ZVBhdGgsIG1haWxEYXRhXG4gICAgICBtYWlsT3B0aW9ucy5ib2R5ID0gQG1haWxSZW5kZXJlci5yZW5kZXIgdHh0VGVtcGxhdGVQYXRoLCBtYWlsRGF0YVxuICAgIGVsc2UgaWYgZ2VuZXJhbFRlbXBsYXRlUGF0aFxuICAgICAgbWFpbE9wdGlvbnMuYm9keSA9IEBtYWlsUmVuZGVyZXIucmVuZGVyIGdlbmVyYWxUZW1wbGF0ZVBhdGgsIG1haWxEYXRhXG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdEaWQgbm90IGZpbmQgYW4gZW1haWwgdHBsIGF0OlxcbiAtICN7bWFpbFRwbH0uZWN0JylcblxuICAgIG1haWxjb21wb3NlciAgPSBuZXcgTWFpbENvbXBvc2VyKClcbiAgICBtYWlsY29tcG9zZXIuYWRkSGVhZGVyIGhlYWRlckZpZWxkLCBoZWFkZXJWYWwgZm9yIGhlYWRlckZpZWxkLCBoZWFkZXJWYWwgb2YgbWFpbEhlYWRlcnMgaWYgbWFpbEhlYWRlcnNcbiAgICBtYWlsY29tcG9zZXIuc2V0TWVzc2FnZU9wdGlvbiBtYWlsT3B0aW9uc1xuXG4gICAgbWFpbGNvbXBvc2VyLmJ1aWxkTWVzc2FnZSAoZXJyLCBtaW1lQm9keSkgLT5cbiAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgY2IobnVsbCwgbWFpbEZyb20sIG1haWxUbywgbWltZUJvZHkpXG5cbiAgZ2V0RmlsZUlmRXhpc3RzOiAoZmlsZW5hbWUpIC0+XG4gICAgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUgKHBhdGguam9pbiBAdHBsUGF0aCwgZmlsZW5hbWUpXG4gICAgcmV0dXJuIGlmIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpIHRoZW4gZmlsZVBhdGggZWxzZSBmYWxzZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbEJ1aWxkZXJcbiJdfQ==