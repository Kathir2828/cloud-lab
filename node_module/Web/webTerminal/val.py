
from lxml import etree

# Read XML file
xml = etree.parse("courses.xml")

# Validate using XSD
xsd_doc = etree.parse("courses.xsd")
xsd = etree.XMLSchema(xsd_doc)

if xsd.validate(xml):
    print("XSD Validation: XML is valid")
else:
    print("XSD Validation: XML is invalid")
    print(xsd.error_log)

# Validate using DTD
dtd = etree.DTD("courses.dtd")

if dtd.validate(xml):
    print("DTD Validation: XML is valid")
else:
    print("DTD Validation: XML is invalid")
    print(dtd.error_log)