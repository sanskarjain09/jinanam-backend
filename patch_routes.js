const fs = require('fs');
const file = 'src/modules/bhojanshala/bhojanshala.routes.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("memberIdentifier: z.string().optional()")) {
  code = code.replace(
    "memberId: z.string().optional(),",
    "memberId: z.string().optional(),\n    memberIdentifier: z.string().optional(),"
  );
  fs.writeFileSync(file, code);
  console.log("Patched bhojanshala.routes.ts");
} else {
  console.log("Already patched");
}
