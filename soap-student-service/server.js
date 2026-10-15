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
        console.log("Received POST Request in SOAP Service");
        console.log("Requested Register Number:", args.registerNumber);
        console.log("Current Student Database:", students);

        const registerNumber = Number(args.registerNumber);
        const student = students[registerNumber];

        if (!student) {
          console.log("Result: Student not found");
          return {
            getStudentMarkResult: "Student not found"
          };
        }

        const resultText = `Name: ${student.name}, Mark: ${student.mark}`;
        console.log("Found Student:", student);
        console.log("Sending Response:", resultText);

        return {
          getStudentMarkResult: resultText
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
