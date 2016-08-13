import CAS from './cas';
import url from 'url';

module.exports = (options) => {
  const opts = options || {};

  // service is the url of our app
  if (!opts.service) {
    throw new Error('no service defined');
  }

  const prefix = opts.prefix || '';

  // path to log out of CAS service
  const logoutURL = opts.logoutURL || '/logout';

  // instantiate CAS object
  const cas = new CAS({
    base_url: 'https://login.dartmouth.edu/cas',
    service: opts.service,
    version: 2.0,
  });

  return (req, res, next) => {
    // logout path
    if (req.url === logoutURL) {
      req.session.destroy(err => {
        if (err) return next(err);

        // cas.logout(req, res);
        return next();
      });
    // user is already authenticated
    } else if (req.session.auth) {
      return next();
    // otherwise, authenticate
    } else {
      cas.authenticate(req, res, (err, status, username, extended) => {
        if (err) return next(err);

        // create session for user:
        req.session.regenerate(err => {
          if (err) return next(err);

          // the auth object contains {name, username, netid} fields
          req.session.auth = extended.attributes;

          // remove the ticket query arg from url
          res.redirect(url.parse(prefix + req.url).pathname);
        });
      }, 'http://localhost:9090/api/login');
    }
  };
};
