/**
 * Created by seal on 01/01/2017.
 */


exports.calculateSize = size => {
  let sizes = size.split(';');
  if (isNaN(sizes[sizes.length - 1])) {
    return 1;
  } else {
    return Number(sizes[sizes.length - 1]);
  }
};
