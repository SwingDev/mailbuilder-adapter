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
    var generalTemplatePath, headerField, headerVal, htmlTemplatePath, mailData, mailFrom, mailHeaders, mailOptions, mailSubject, mailTo, mailTpl, mailcomposer, txtTemplatePath;
    mailFrom = options.mailFrom, mailTo = options.mailTo, mailSubject = options.mailSubject, mailTpl = options.mailTpl, mailData = options.mailData, mailHeaders = options.mailHeaders;
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

//# sourceMappingURL=data:application/json;base64,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Q0FBdUIsV0FBdkIsRUFBb0MsU0FBcEMsQ0FBQSxDQUFBO0FBQUEsT0FBQTtLQXZCQTtBQUFBLElBd0JBLFlBQVksQ0FBQyxnQkFBYixDQUE4QixXQUE5QixDQXhCQSxDQUFBO1dBMEJBLFlBQVksQ0FBQyxZQUFiLENBQTBCLFNBQUMsR0FBRCxFQUFNLFFBQU4sR0FBQTtBQUN4QixNQUFBLElBQWtCLEdBQWxCO0FBQUEsZUFBTyxFQUFBLENBQUcsR0FBSCxDQUFQLENBQUE7T0FBQTthQUNBLEVBQUEsQ0FBRyxJQUFILEVBQVMsUUFBVCxFQUFtQixNQUFuQixFQUEyQixRQUEzQixFQUZ3QjtJQUFBLENBQTFCLEVBM0JTO0VBQUEsQ0FOWCxDQUFBOztBQUFBLHdCQXFDQSxlQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO0FBQ2YsUUFBQSxRQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxPQUFYLEVBQW9CLFFBQXBCLENBQWQsQ0FBWCxDQUFBO0FBQ08sSUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUFIO2FBQWdDLFNBQWhDO0tBQUEsTUFBQTthQUE4QyxNQUE5QztLQUZRO0VBQUEsQ0FyQ2pCLENBQUE7O3FCQUFBOztHQUZ3QixZQVIxQixDQUFBOztBQUFBLE1Bb0RNLENBQUMsT0FBUCxHQUFpQixXQXBEakIsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImVjdCAgICAgICAgICAgPSByZXF1aXJlKCdlY3QnKVxucGF0aCAgICAgICAgICA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgICAgICAgICAgICA9IHJlcXVpcmUoJ2ZzJylcbl8gICAgICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKVxuTWFpbEFkYXB0ZXIgICA9IHJlcXVpcmUoJ21haWwtd29ya2VyJykuTWFpbEFkYXB0ZXJcbk1haWxDb21wb3NlciAgPSByZXF1aXJlKCdtYWlsY29tcG9zZXInKS5NYWlsQ29tcG9zZXJcblxuXG5jbGFzcyBNYWlsQnVpbGRlciBleHRlbmRzIE1haWxBZGFwdGVyXG5cbiAgY29uc3RydWN0b3I6IChAdHBsUGF0aCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGdpdmUgdGVtcGxhdGUgcGF0aCB0byB1c2UgTWFpbEJ1aWxkZXInKSB1bmxlc3MgQHRwbFBhdGhcbiAgICBAbWFpbFJlbmRlcmVyID0gZWN0XG4gICAgICByb290OiBwYXRoLnJlc29sdmUgQHRwbFBhdGhcbiAgICAgIGV4dDogJy5lY3QnXG5cbiAgYnVpbGRNYWlsOiAob3B0aW9ucywgY2IpIC0+XG4gICAge21haWxGcm9tLCBtYWlsVG8sIG1haWxTdWJqZWN0LCBtYWlsVHBsLCBtYWlsRGF0YSwgbWFpbEhlYWRlcnN9ID0gb3B0aW9uc1xuXG4gICAgdW5sZXNzIG1haWxGcm9tIG9yIG1haWxUbyBvciBtYWlsU3ViamVjdCBvciBtYWlsVHBsXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHJ1biBNYWlsQnVpbGRlciNidWlsZE1haWwgd2l0aCBwYXJhbXM6IGZyb20sIHRvLCBzdWJqZWN0LCB0ZW1wbGF0ZScpXG5cbiAgICBodG1sVGVtcGxhdGVQYXRoICAgID0gQGdldEZpbGVJZkV4aXN0cyBcIiN7bWFpbFRwbH0uaHRtbC5lY3RcIlxuICAgIHR4dFRlbXBsYXRlUGF0aCAgICAgPSBAZ2V0RmlsZUlmRXhpc3RzIFwiI3ttYWlsVHBsfS50eHQuZWN0XCJcbiAgICBnZW5lcmFsVGVtcGxhdGVQYXRoID0gQGdldEZpbGVJZkV4aXN0cyBcIiN7bWFpbFRwbH0uZWN0XCJcblxuICAgIG1haWxPcHRpb25zID1cbiAgICAgIGZyb206IG1haWxGcm9tXG4gICAgICB0bzogbWFpbFRvXG4gICAgICBzdWJqZWN0OiBtYWlsU3ViamVjdFxuXG4gICAgaWYgaHRtbFRlbXBsYXRlUGF0aCBhbmQgdHh0VGVtcGxhdGVQYXRoXG4gICAgICBtYWlsT3B0aW9ucy5odG1sID0gQG1haWxSZW5kZXJlci5yZW5kZXIgaHRtbFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICAgIG1haWxPcHRpb25zLmJvZHkgPSBAbWFpbFJlbmRlcmVyLnJlbmRlciB0eHRUZW1wbGF0ZVBhdGgsIG1haWxEYXRhXG4gICAgZWxzZSBpZiBnZW5lcmFsVGVtcGxhdGVQYXRoXG4gICAgICBtYWlsT3B0aW9ucy5ib2R5ID0gQG1haWxSZW5kZXJlci5yZW5kZXIgZ2VuZXJhbFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpZCBub3QgZmluZCBhbiBlbWFpbCB0cGwgYXQ6XFxuIC0gI3ttYWlsVHBsfS5lY3QnKVxuXG4gICAgbWFpbGNvbXBvc2VyICA9IG5ldyBNYWlsQ29tcG9zZXIoKVxuICAgIG1haWxjb21wb3Nlci5hZGRIZWFkZXIgaGVhZGVyRmllbGQsIGhlYWRlclZhbCBmb3IgaGVhZGVyRmllbGQsIGhlYWRlclZhbCBvZiBtYWlsSGVhZGVycyBpZiBtYWlsSGVhZGVyc1xuICAgIG1haWxjb21wb3Nlci5zZXRNZXNzYWdlT3B0aW9uIG1haWxPcHRpb25zXG5cbiAgICBtYWlsY29tcG9zZXIuYnVpbGRNZXNzYWdlIChlcnIsIG1pbWVCb2R5KSAtPlxuICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICBjYihudWxsLCBtYWlsRnJvbSwgbWFpbFRvLCBtaW1lQm9keSlcblxuICBnZXRGaWxlSWZFeGlzdHM6IChmaWxlbmFtZSkgLT5cbiAgICBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZSAocGF0aC5qb2luIEB0cGxQYXRoLCBmaWxlbmFtZSlcbiAgICByZXR1cm4gaWYgZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkgdGhlbiBmaWxlUGF0aCBlbHNlIGZhbHNlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBNYWlsQnVpbGRlclxuICAiXX0=