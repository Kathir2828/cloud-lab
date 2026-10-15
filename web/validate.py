# install lxml using -> pip install lxml
from lxml import etree
try:
    parser = etree.XMLParser(dtd_validation=True)
    etree.parse("courses.xml", parser)
    print("XML is valid")
except etree.XMLSyntaxError as e:
    print("XML is invalid:", e)