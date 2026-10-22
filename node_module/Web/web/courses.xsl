<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
            <head>
                <title>Academic Course Schedule</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; background-color: #f9f9f9; }
                    h2 { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #fff; }
                    th, td { border: 1px solid #dddddd; text-align: left; padding: 12px; }
                    th { background-color: #0076d6; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    .badge { background-color: #e1f5fe; color: #0288d1; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85em; }
                </style>
            </head>
            <body>
                <h2>Available IT Department Courses</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>System ID</th>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>Credits</th>
                            <th>Enrolled Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="courses/course">
                            <tr>
                                <td><span class="badge"><xsl:value-of select="@id"/></span></td>
                                
                                <td><xsl:value-of select="courseID"/></td>
                                <td><strong><xsl:value-of select="name"/></strong></td>
                                
                                <td><xsl:value-of select="@dept"/></td>
                                <td><xsl:value-of select="@semester"/></td>
                                
                                <td><xsl:value-of select="credits"/></td>
                                <td><xsl:value-of select="enrolled"/></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
