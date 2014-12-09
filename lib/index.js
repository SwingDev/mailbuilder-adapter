var MailAdapter, MailBuilder, MailComposer, ect, fs, path, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ect = require('ect');

path = require('path');

fs = require('fs');

_ = require('lodash');

MailAdapter = require('mailworker').MailAdapter;

MailComposer = require('mailcomposer').MailComposer;

MailBuilder = (function(_super) {
  __extends(MailBuilder, _super);

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
    var generalTemplatePath, htmlTemplatePath, mailData, mailFrom, mailOptions, mailSubject, mailTo, mailTpl, mailcomposer, txtTemplatePath;
    mailFrom = options.mailFrom, mailTo = options.mailTo, mailSubject = options.mailSubject, mailTpl = options.mailTpl, mailData = options.mailData;
    htmlTemplatePath = this.getFileIfExists("" + mailTpl + ".html.ect");
    txtTemplatePath = this.getFileIfExists("" + mailTpl + ".txt.ect");
    generalTemplatePath = this.getFileIfExists("" + mailTpl + ".ect");
    if (!((mailFrom != null) && (mailTo != null) && (mailSubject != null) && (mailTpl != null))) {
      throw new Error('You must run MailBuilder#buildMail with params: from, to, subject, template');
    }
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
    mailcomposer.setMessageOption(mailOptions);
    return mailcomposer.buildMessage(function(err, mimeBody) {
      return cb(err, mailFrom, mailTo, mimeBody);
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

//# sourceMappingURL=data:application/json;base64,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QSxZQUFZLENBQUMsWUFBYixDQUEwQixTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7YUFDeEIsRUFBQSxDQUFHLEdBQUgsRUFBUSxRQUFSLEVBQWtCLE1BQWxCLEVBQTBCLFFBQTFCLEVBRHdCO0lBQUEsQ0FBMUIsRUExQlM7RUFBQSxDQU5YLENBQUE7O0FBQUEsd0JBb0NBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixRQUFBLFFBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLE9BQVgsRUFBb0IsUUFBcEIsQ0FBZCxDQUFYLENBQUE7QUFDTyxJQUFBLElBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQUg7YUFBZ0MsU0FBaEM7S0FBQSxNQUFBO2FBQThDLE1BQTlDO0tBRlE7RUFBQSxDQXBDakIsQ0FBQTs7cUJBQUE7O0dBRndCLFlBVDFCLENBQUE7O0FBQUEsTUFvRE0sQ0FBQyxPQUFQLEdBQWlCLFdBcERqQixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJ2VjdCcpXG5wYXRoICAgICAgICAgID0gcmVxdWlyZSgncGF0aCcpXG5mcyAgICAgICAgICAgID0gcmVxdWlyZSgnZnMnKVxuXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5NYWlsQWRhcHRlciAgID0gcmVxdWlyZSgnbWFpbHdvcmtlcicpLk1haWxBZGFwdGVyXG5NYWlsQ29tcG9zZXIgID0gcmVxdWlyZSgnbWFpbGNvbXBvc2VyJykuTWFpbENvbXBvc2VyXG5cblxuXG5jbGFzcyBNYWlsQnVpbGRlciBleHRlbmRzIE1haWxBZGFwdGVyXG5cbiAgY29uc3RydWN0b3I6IChAdHBsUGF0aCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGdpdmUgdGVtcGxhdGUgcGF0aCB0byB1c2UgTWFpbEJ1aWxkZXInKSB1bmxlc3MgQHRwbFBhdGhcbiAgICBAbWFpbFJlbmRlcmVyID0gZWN0XG4gICAgICByb290OiBwYXRoLnJlc29sdmUgQHRwbFBhdGhcbiAgICAgIGV4dDogJy5lY3QnXG5cbiAgYnVpbGRNYWlsOiAob3B0aW9ucywgY2IpIC0+XG4gICAge21haWxGcm9tLCBtYWlsVG8sIG1haWxTdWJqZWN0LCBtYWlsVHBsLCBtYWlsRGF0YX0gPSBvcHRpb25zXG5cbiAgICBodG1sVGVtcGxhdGVQYXRoICAgID0gQGdldEZpbGVJZkV4aXN0cyBcIiN7bWFpbFRwbH0uaHRtbC5lY3RcIlxuICAgIHR4dFRlbXBsYXRlUGF0aCAgICAgPSBAZ2V0RmlsZUlmRXhpc3RzIFwiI3ttYWlsVHBsfS50eHQuZWN0XCJcbiAgICBnZW5lcmFsVGVtcGxhdGVQYXRoID0gQGdldEZpbGVJZkV4aXN0cyBcIiN7bWFpbFRwbH0uZWN0XCJcblxuICAgIHVubGVzcyBtYWlsRnJvbT8gYW5kIG1haWxUbz8gYW5kIG1haWxTdWJqZWN0PyBhbmQgbWFpbFRwbD9cbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgcnVuIE1haWxCdWlsZGVyI2J1aWxkTWFpbCB3aXRoIHBhcmFtczogZnJvbSwgdG8sIHN1YmplY3QsIHRlbXBsYXRlJylcblxuICAgIG1haWxPcHRpb25zID1cbiAgICAgIGZyb206IG1haWxGcm9tXG4gICAgICB0bzogbWFpbFRvXG4gICAgICBzdWJqZWN0OiBtYWlsU3ViamVjdFxuXG4gICAgaWYgaHRtbFRlbXBsYXRlUGF0aCBhbmQgdHh0VGVtcGxhdGVQYXRoXG4gICAgICBtYWlsT3B0aW9ucy5odG1sID0gQG1haWxSZW5kZXJlci5yZW5kZXIgaHRtbFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICAgIG1haWxPcHRpb25zLmJvZHkgPSBAbWFpbFJlbmRlcmVyLnJlbmRlciB0eHRUZW1wbGF0ZVBhdGgsIG1haWxEYXRhXG4gICAgZWxzZSBpZiBnZW5lcmFsVGVtcGxhdGVQYXRoXG4gICAgICBtYWlsT3B0aW9ucy5ib2R5ID0gQG1haWxSZW5kZXJlci5yZW5kZXIgZ2VuZXJhbFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpZCBub3QgZmluZCBhbiBlbWFpbCB0cGwgYXQ6XFxuIC0gI3ttYWlsVHBsfS5lY3QnKVxuXG4gICAgbWFpbGNvbXBvc2VyICA9IG5ldyBNYWlsQ29tcG9zZXIoKVxuICAgIG1haWxjb21wb3Nlci5zZXRNZXNzYWdlT3B0aW9uIG1haWxPcHRpb25zXG5cbiAgICBtYWlsY29tcG9zZXIuYnVpbGRNZXNzYWdlIChlcnIsIG1pbWVCb2R5KSAtPlxuICAgICAgY2IoZXJyLCBtYWlsRnJvbSwgbWFpbFRvLCBtaW1lQm9keSlcblxuXG4gIGdldEZpbGVJZkV4aXN0czogKGZpbGVuYW1lKSAtPlxuICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlIChwYXRoLmpvaW4gQHRwbFBhdGgsIGZpbGVuYW1lKVxuICAgIHJldHVybiBpZiBmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSB0aGVuIGZpbGVQYXRoIGVsc2UgZmFsc2VcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1haWxCdWlsZGVyXG4gICJdfQ==