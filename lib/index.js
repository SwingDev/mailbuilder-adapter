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
    var generalTemplatePath, headerField, headerVal, htmlTemplatePath, mailAttachments, mailBCC, mailCC, mailData, mailFrom, mailHeaders, mailOptions, mailSubject, mailTo, mailTpl, mailcomposer, txtTemplatePath;
    mailFrom = options.mailFrom, mailTo = options.mailTo, mailSubject = options.mailSubject, mailTpl = options.mailTpl, mailData = options.mailData, mailHeaders = options.mailHeaders, mailCC = options.mailCC, mailBCC = options.mailBCC, mailAttachments = options.mailAttachments;
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
    if (!mailAttachments) {
      mailAttachments = [];
    }
    if (htmlTemplatePath && txtTemplatePath) {
      mailOptions.html = this.mailRenderer.render(htmlTemplatePath, mailData);
      mailOptions.body = this.mailRenderer.render(txtTemplatePath, mailData);
    } else if (generalTemplatePath) {
      mailOptions.body = this.mailRenderer.render(generalTemplatePath, mailData);
    } else {
      throw new Error("Did not find an email tpl at:\n - " + mailTpl + ".ect");
    }
    mailcomposer = new MailComposer();
    if (mailHeaders) {
      for (headerField in mailHeaders) {
        headerVal = mailHeaders[headerField];
        mailcomposer.addHeader(headerField, headerVal);
      }
    }
    mailcomposer.setMessageOption(mailOptions);
    mailAttachments.forEach(function(attachment) {
      return mailcomposer.addAttachment(attachment);
    });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLHdEQUFBO0VBQUE7OztBQUFBLEdBQUEsR0FBZ0IsT0FBQSxDQUFRLEtBQVI7O0FBQ2hCLElBQUEsR0FBZ0IsT0FBQSxDQUFRLE1BQVI7O0FBQ2hCLEVBQUEsR0FBZ0IsT0FBQSxDQUFRLElBQVI7O0FBQ2hCLENBQUEsR0FBZ0IsT0FBQSxDQUFRLFFBQVI7O0FBQ2hCLFdBQUEsR0FBZ0IsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQzs7QUFDdkMsWUFBQSxHQUFnQixPQUFBLENBQVEsY0FBUixDQUF1QixDQUFDOztBQUdsQzs7O0VBRVMscUJBQUMsT0FBRDtJQUFDLElBQUMsQ0FBQSxVQUFEO0lBQ1osSUFBQSxDQUF5RSxJQUFDLENBQUEsT0FBMUU7QUFBQSxZQUFNLElBQUksS0FBSixDQUFVLGdEQUFWLEVBQU47O0lBQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsR0FBQSxDQUNkO01BQUEsSUFBQSxFQUFNLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBQyxDQUFBLE9BQWQsQ0FBTjtNQUNBLEdBQUEsRUFBSyxNQURMO0tBRGM7RUFGTDs7d0JBTWIsU0FBQSxHQUFXLFNBQUMsT0FBRCxFQUFVLEVBQVY7QUFDVCxRQUFBO0lBQUMsMkJBQUQsRUFBVyx1QkFBWCxFQUFtQixpQ0FBbkIsRUFBZ0MseUJBQWhDLEVBQXlDLDJCQUF6QyxFQUFtRCxpQ0FBbkQsRUFBZ0UsdUJBQWhFLEVBQXdFLHlCQUF4RSxFQUFpRjtJQUVqRixJQUFBLENBQUEsQ0FBTyxRQUFBLElBQVksTUFBWixJQUFzQixXQUF0QixJQUFxQyxPQUE1QyxDQUFBO0FBQ0UsWUFBTSxJQUFJLEtBQUosQ0FBVSw2RUFBVixFQURSOztJQUdBLGdCQUFBLEdBQXNCLElBQUMsQ0FBQSxlQUFELENBQW9CLE9BQUQsR0FBUyxXQUE1QjtJQUN0QixlQUFBLEdBQXNCLElBQUMsQ0FBQSxlQUFELENBQW9CLE9BQUQsR0FBUyxVQUE1QjtJQUN0QixtQkFBQSxHQUFzQixJQUFDLENBQUEsZUFBRCxDQUFvQixPQUFELEdBQVMsTUFBNUI7SUFFdEIsV0FBQSxHQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxFQUFBLEVBQUksTUFESjtNQUVBLE9BQUEsRUFBUyxXQUZUOztJQUlGLElBQTRCLGNBQTVCO01BQUEsV0FBVyxDQUFDLEVBQVosR0FBa0IsT0FBbEI7O0lBQ0EsSUFBNkIsZUFBN0I7TUFBQSxXQUFXLENBQUMsR0FBWixHQUFrQixRQUFsQjs7SUFFQSxJQUFBLENBQTRCLGVBQTVCO01BQUEsZUFBQSxHQUFrQixHQUFsQjs7SUFFQSxJQUFHLGdCQUFBLElBQXFCLGVBQXhCO01BQ0UsV0FBVyxDQUFDLElBQVosR0FBbUIsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLENBQXFCLGdCQUFyQixFQUF1QyxRQUF2QztNQUNuQixXQUFXLENBQUMsSUFBWixHQUFtQixJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsZUFBckIsRUFBc0MsUUFBdEMsRUFGckI7S0FBQSxNQUdLLElBQUcsbUJBQUg7TUFDSCxXQUFXLENBQUMsSUFBWixHQUFtQixJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsbUJBQXJCLEVBQTBDLFFBQTFDLEVBRGhCO0tBQUEsTUFBQTtBQUdILFlBQU0sSUFBSSxLQUFKLENBQVUsb0NBQUEsR0FBcUMsT0FBckMsR0FBNkMsTUFBdkQsRUFISDs7SUFLTCxZQUFBLEdBQWdCLElBQUksWUFBSixDQUFBO0lBQ2hCLElBQTJGLFdBQTNGO0FBQUEsV0FBQSwwQkFBQTs7UUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixXQUF2QixFQUFvQyxTQUFwQztBQUFBLE9BQUE7O0lBQ0EsWUFBWSxDQUFDLGdCQUFiLENBQThCLFdBQTlCO0lBRUEsZUFBZSxDQUFDLE9BQWhCLENBQXdCLFNBQUMsVUFBRDthQUN0QixZQUFZLENBQUMsYUFBYixDQUEyQixVQUEzQjtJQURzQixDQUF4QjtXQUdBLFlBQVksQ0FBQyxZQUFiLENBQTBCLFNBQUMsR0FBRCxFQUFNLFFBQU47TUFDeEIsSUFBa0IsR0FBbEI7QUFBQSxlQUFPLEVBQUEsQ0FBRyxHQUFILEVBQVA7O2FBQ0EsRUFBQSxDQUFHLElBQUgsRUFBUyxRQUFULEVBQW1CLE1BQW5CLEVBQTJCLFFBQTNCO0lBRndCLENBQTFCO0VBbkNTOzt3QkF1Q1gsZUFBQSxHQUFpQixTQUFDLFFBQUQ7QUFDZixRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsT0FBWCxFQUFvQixRQUFwQixDQUFkO0lBQ0osSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBSDthQUFnQyxTQUFoQztLQUFBLE1BQUE7YUFBOEMsTUFBOUM7O0VBRlE7Ozs7R0EvQ087O0FBb0QxQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImVjdCAgICAgICAgICAgPSByZXF1aXJlKCdlY3QnKVxucGF0aCAgICAgICAgICA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgICAgICAgICAgICA9IHJlcXVpcmUoJ2ZzJylcbl8gICAgICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKVxuTWFpbEFkYXB0ZXIgICA9IHJlcXVpcmUoJ21haWwtd29ya2VyJykuTWFpbEFkYXB0ZXJcbk1haWxDb21wb3NlciAgPSByZXF1aXJlKCdtYWlsY29tcG9zZXInKS5NYWlsQ29tcG9zZXJcblxuXG5jbGFzcyBNYWlsQnVpbGRlciBleHRlbmRzIE1haWxBZGFwdGVyXG5cbiAgY29uc3RydWN0b3I6IChAdHBsUGF0aCkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IGdpdmUgdGVtcGxhdGUgcGF0aCB0byB1c2UgTWFpbEJ1aWxkZXInKSB1bmxlc3MgQHRwbFBhdGhcbiAgICBAbWFpbFJlbmRlcmVyID0gZWN0XG4gICAgICByb290OiBwYXRoLnJlc29sdmUgQHRwbFBhdGhcbiAgICAgIGV4dDogJy5lY3QnXG5cbiAgYnVpbGRNYWlsOiAob3B0aW9ucywgY2IpIC0+XG4gICAge21haWxGcm9tLCBtYWlsVG8sIG1haWxTdWJqZWN0LCBtYWlsVHBsLCBtYWlsRGF0YSwgbWFpbEhlYWRlcnMsIG1haWxDQywgbWFpbEJDQywgbWFpbEF0dGFjaG1lbnRzfSA9IG9wdGlvbnNcblxuICAgIHVubGVzcyBtYWlsRnJvbSBvciBtYWlsVG8gb3IgbWFpbFN1YmplY3Qgb3IgbWFpbFRwbFxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBydW4gTWFpbEJ1aWxkZXIjYnVpbGRNYWlsIHdpdGggcGFyYW1zOiBmcm9tLCB0bywgc3ViamVjdCwgdGVtcGxhdGUnKVxuXG4gICAgaHRtbFRlbXBsYXRlUGF0aCAgICA9IEBnZXRGaWxlSWZFeGlzdHMgXCIje21haWxUcGx9Lmh0bWwuZWN0XCJcbiAgICB0eHRUZW1wbGF0ZVBhdGggICAgID0gQGdldEZpbGVJZkV4aXN0cyBcIiN7bWFpbFRwbH0udHh0LmVjdFwiXG4gICAgZ2VuZXJhbFRlbXBsYXRlUGF0aCA9IEBnZXRGaWxlSWZFeGlzdHMgXCIje21haWxUcGx9LmVjdFwiXG5cbiAgICBtYWlsT3B0aW9ucyA9XG4gICAgICBmcm9tOiBtYWlsRnJvbVxuICAgICAgdG86IG1haWxUb1xuICAgICAgc3ViamVjdDogbWFpbFN1YmplY3RcblxuICAgIG1haWxPcHRpb25zLmNjICA9IG1haWxDQyBpZiBtYWlsQ0M/XG4gICAgbWFpbE9wdGlvbnMuYmNjID0gbWFpbEJDQyBpZiBtYWlsQkNDP1xuXG4gICAgbWFpbEF0dGFjaG1lbnRzID0gW10gdW5sZXNzIG1haWxBdHRhY2htZW50c1xuXG4gICAgaWYgaHRtbFRlbXBsYXRlUGF0aCBhbmQgdHh0VGVtcGxhdGVQYXRoXG4gICAgICBtYWlsT3B0aW9ucy5odG1sID0gQG1haWxSZW5kZXJlci5yZW5kZXIgaHRtbFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICAgIG1haWxPcHRpb25zLmJvZHkgPSBAbWFpbFJlbmRlcmVyLnJlbmRlciB0eHRUZW1wbGF0ZVBhdGgsIG1haWxEYXRhXG4gICAgZWxzZSBpZiBnZW5lcmFsVGVtcGxhdGVQYXRoXG4gICAgICBtYWlsT3B0aW9ucy5ib2R5ID0gQG1haWxSZW5kZXJlci5yZW5kZXIgZ2VuZXJhbFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWQgbm90IGZpbmQgYW4gZW1haWwgdHBsIGF0OlxcbiAtICN7bWFpbFRwbH0uZWN0XCIpXG5cbiAgICBtYWlsY29tcG9zZXIgID0gbmV3IE1haWxDb21wb3NlcigpXG4gICAgbWFpbGNvbXBvc2VyLmFkZEhlYWRlciBoZWFkZXJGaWVsZCwgaGVhZGVyVmFsIGZvciBoZWFkZXJGaWVsZCwgaGVhZGVyVmFsIG9mIG1haWxIZWFkZXJzIGlmIG1haWxIZWFkZXJzXG4gICAgbWFpbGNvbXBvc2VyLnNldE1lc3NhZ2VPcHRpb24gbWFpbE9wdGlvbnNcblxuICAgIG1haWxBdHRhY2htZW50cy5mb3JFYWNoIChhdHRhY2htZW50KSAtPlxuICAgICAgbWFpbGNvbXBvc2VyLmFkZEF0dGFjaG1lbnQgYXR0YWNobWVudFxuXG4gICAgbWFpbGNvbXBvc2VyLmJ1aWxkTWVzc2FnZSAoZXJyLCBtaW1lQm9keSkgLT5cbiAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgY2IobnVsbCwgbWFpbEZyb20sIG1haWxUbywgbWltZUJvZHkpXG5cbiAgZ2V0RmlsZUlmRXhpc3RzOiAoZmlsZW5hbWUpIC0+XG4gICAgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUgKHBhdGguam9pbiBAdHBsUGF0aCwgZmlsZW5hbWUpXG4gICAgcmV0dXJuIGlmIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpIHRoZW4gZmlsZVBhdGggZWxzZSBmYWxzZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbEJ1aWxkZXJcbiJdfQ==
