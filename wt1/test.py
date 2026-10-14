from lxml import etree

def validate_xml(xml_path="sample.xml", dtd_path="condition.dtd"):
    try:
        tree = etree.parse(xml_path)
        docinfo = tree.docinfo
        if docinfo.internalDTD is not None and docinfo.system_url is None:
            dtd = docinfo.internalDTD
            if dtd.validate(tree):
                print("Valid XML!")
            else:
                print("Invalid XML!")
                for error in dtd.error_log.filter_from_errors():
                    print(f" - Line {error.line}: {error.message}")

        else:
            with open(dtd_path, "rb") as dtd_file:
                dtd = etree.DTD(dtd_file)
            if dtd.validate(tree):
                print("Valid XML!")
            else:
                print("Invalid XML!")
                for error in dtd.error_log.filter_from_errors():
                    print(f" - Line {error.line}: {error.message}")

    except Exception as e:
        print("Error during execution:", e)


if __name__ == "__main__":
    validate_xml()
