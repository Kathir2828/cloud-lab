<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">

        <html>
        <head>
            <title>Course Details</title>
        </head>

        <body>
            <h2>Available Courses</h2>

            <table border="1" cellpadding="20">
                <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Duration</th>
                    <th>Fees</th>
                    <th>Description</th>
                </tr>

                <xsl:for-each select="courses/course">
                    <tr>
                        <td>
                            <xsl:value-of select="@id"/>
                        </td>

                        <td>
                            <xsl:value-of select="@category"/>
                        </td>

                        <td>
                            <xsl:value-of select="name"/>
                        </td>

                        <td>
                            <xsl:value-of select="duration"/>
                        </td>

                        <td>
                            <xsl:value-of select="fees"/>
                        </td>

                        <td>
                            <xsl:value-of select="description"/>
                        </td>
                    </tr>
                </xsl:for-each>

            </table>
        </body>
        </html>

    </xsl:template>

</xsl:stylesheet>
