/**
 * Created by seal on 13/01/2017.
 */

exports.user = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    if (req.path == '/login') {
      return next();
    }
    console.log("没验证的访问 路径是： /api/%s", req.path);
    res.status(401).send('unauthorized');
  }
};
