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

//# sourceMappingURL=data:application/json;base64,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QSxZQUFZLENBQUMsWUFBYixDQUEwQixTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7QUFDeEIsTUFBQSxJQUFrQixHQUFsQjtBQUFBLGVBQU8sRUFBQSxDQUFHLEdBQUgsQ0FBUCxDQUFBO09BQUE7YUFDQSxFQUFBLENBQUcsSUFBSCxFQUFTLFFBQVQsRUFBbUIsTUFBbkIsRUFBMkIsUUFBM0IsRUFGd0I7SUFBQSxDQUExQixFQTFCUztFQUFBLENBTlgsQ0FBQTs7QUFBQSx3QkFxQ0EsZUFBQSxHQUFpQixTQUFDLFFBQUQsR0FBQTtBQUNmLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsT0FBWCxFQUFvQixRQUFwQixDQUFkLENBQVgsQ0FBQTtBQUNPLElBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBSDthQUFnQyxTQUFoQztLQUFBLE1BQUE7YUFBOEMsTUFBOUM7S0FGUTtFQUFBLENBckNqQixDQUFBOztxQkFBQTs7R0FGd0IsWUFUMUIsQ0FBQTs7QUFBQSxNQXFETSxDQUFDLE9BQVAsR0FBaUIsV0FyRGpCLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJlY3QgICAgICAgICAgID0gcmVxdWlyZSgnZWN0JylcbnBhdGggICAgICAgICAgPSByZXF1aXJlKCdwYXRoJylcbmZzICAgICAgICAgICAgPSByZXF1aXJlKCdmcycpXG5fICAgICAgICAgICAgID0gcmVxdWlyZSgnbG9kYXNoJylcbk1haWxBZGFwdGVyICAgPSByZXF1aXJlKCdtYWlsd29ya2VyJykuTWFpbEFkYXB0ZXJcbk1haWxDb21wb3NlciAgPSByZXF1aXJlKCdtYWlsY29tcG9zZXInKS5NYWlsQ29tcG9zZXJcblxuXG5cbmNsYXNzIE1haWxCdWlsZGVyIGV4dGVuZHMgTWFpbEFkYXB0ZXJcblxuICBjb25zdHJ1Y3RvcjogKEB0cGxQYXRoKSAtPlxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgZ2l2ZSB0ZW1wbGF0ZSBwYXRoIHRvIHVzZSBNYWlsQnVpbGRlcicpIHVubGVzcyBAdHBsUGF0aFxuICAgIEBtYWlsUmVuZGVyZXIgPSBlY3RcbiAgICAgIHJvb3Q6IHBhdGgucmVzb2x2ZSBAdHBsUGF0aFxuICAgICAgZXh0OiAnLmVjdCdcblxuICBidWlsZE1haWw6IChvcHRpb25zLCBjYikgLT5cbiAgICB7bWFpbEZyb20sIG1haWxUbywgbWFpbFN1YmplY3QsIG1haWxUcGwsIG1haWxEYXRhfSA9IG9wdGlvbnNcblxuICAgIGh0bWxUZW1wbGF0ZVBhdGggICAgPSBAZ2V0RmlsZUlmRXhpc3RzIFwiI3ttYWlsVHBsfS5odG1sLmVjdFwiXG4gICAgdHh0VGVtcGxhdGVQYXRoICAgICA9IEBnZXRGaWxlSWZFeGlzdHMgXCIje21haWxUcGx9LnR4dC5lY3RcIlxuICAgIGdlbmVyYWxUZW1wbGF0ZVBhdGggPSBAZ2V0RmlsZUlmRXhpc3RzIFwiI3ttYWlsVHBsfS5lY3RcIlxuXG4gICAgdW5sZXNzIG1haWxGcm9tPyBhbmQgbWFpbFRvPyBhbmQgbWFpbFN1YmplY3Q/IGFuZCBtYWlsVHBsP1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBydW4gTWFpbEJ1aWxkZXIjYnVpbGRNYWlsIHdpdGggcGFyYW1zOiBmcm9tLCB0bywgc3ViamVjdCwgdGVtcGxhdGUnKVxuXG4gICAgbWFpbE9wdGlvbnMgPVxuICAgICAgZnJvbTogbWFpbEZyb21cbiAgICAgIHRvOiBtYWlsVG9cbiAgICAgIHN1YmplY3Q6IG1haWxTdWJqZWN0XG5cbiAgICBpZiBodG1sVGVtcGxhdGVQYXRoIGFuZCB0eHRUZW1wbGF0ZVBhdGhcbiAgICAgIG1haWxPcHRpb25zLmh0bWwgPSBAbWFpbFJlbmRlcmVyLnJlbmRlciBodG1sVGVtcGxhdGVQYXRoLCBtYWlsRGF0YVxuICAgICAgbWFpbE9wdGlvbnMuYm9keSA9IEBtYWlsUmVuZGVyZXIucmVuZGVyIHR4dFRlbXBsYXRlUGF0aCwgbWFpbERhdGFcbiAgICBlbHNlIGlmIGdlbmVyYWxUZW1wbGF0ZVBhdGhcbiAgICAgIG1haWxPcHRpb25zLmJvZHkgPSBAbWFpbFJlbmRlcmVyLnJlbmRlciBnZW5lcmFsVGVtcGxhdGVQYXRoLCBtYWlsRGF0YVxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcignRGlkIG5vdCBmaW5kIGFuIGVtYWlsIHRwbCBhdDpcXG4gLSAje21haWxUcGx9LmVjdCcpXG5cbiAgICBtYWlsY29tcG9zZXIgID0gbmV3IE1haWxDb21wb3NlcigpXG4gICAgbWFpbGNvbXBvc2VyLnNldE1lc3NhZ2VPcHRpb24gbWFpbE9wdGlvbnNcblxuICAgIG1haWxjb21wb3Nlci5idWlsZE1lc3NhZ2UgKGVyciwgbWltZUJvZHkpIC0+XG4gICAgICByZXR1cm4gY2IoZXJyKSBpZiBlcnJcbiAgICAgIGNiKG51bGwsIG1haWxGcm9tLCBtYWlsVG8sIG1pbWVCb2R5KVxuXG5cbiAgZ2V0RmlsZUlmRXhpc3RzOiAoZmlsZW5hbWUpIC0+XG4gICAgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUgKHBhdGguam9pbiBAdHBsUGF0aCwgZmlsZW5hbWUpXG4gICAgcmV0dXJuIGlmIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpIHRoZW4gZmlsZVBhdGggZWxzZSBmYWxzZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFpbEJ1aWxkZXJcbiAgIl19