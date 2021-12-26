import os
import sys

try:
    lib = __import__(sys.argv[1])
except:
    print('The library <' + sys.argv[1] + '> is not found.')
path = os.path.dirname(lib.__file__)
version = lib.__version__

msg = 'Path: ' + path + '\nVersion: ' + version
print(msg)
