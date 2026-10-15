const express = require("express");
const soap = require("soap");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Sample student data
const students = {
  105: { name: "Arun", mark: 92 },
  106: { name: "Priya", mark: 88 },
  107: { name: "Kumar", mark: 95 }
};

// SOAP operation implementation
const service = {
  StudentService: {
    StudentServicePort: {
      getStudentMark(args) {
        const registerNumber = Number(args.registerNumber);
        const student = students[registerNumber];

        if (!student) {
          return {
            getStudentMarkResult: "Student not found"
          };
        }

        return {
          getStudentMarkResult:
            `Name: ${student.name}, Mark: ${student.mark}`
        };
      }
    }
  }
};

// Read the WSDL file
const wsdl = fs.readFileSync(
  path.join(__dirname, "student.wsdl"),
  "utf8"
);

// Start Express and attach the SOAP endpoint
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WSDL: http://localhost:${PORT}/student?wsdl`);
});

soap.listen(server, "/student", service, wsdl);
