const xdgBasedir  = jest.genMockFromModule('xdg-basedir');
xdgBasedir.config = false;
module.exports    = xdgBasedir;
