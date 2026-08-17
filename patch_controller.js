const fs = require('fs');
let code = fs.readFileSync('src/modules/bhojanshala/bhojanshala.controller.ts', 'utf8');

const newCode = `  const passData = {
    mealType: req.body.mealType,
    date: new Date(req.body.date),
    numberOfPersons: Number(req.body.numberOfPersons),
    pricePaid: Number(req.body.pricePaid),
    paymentId: req.body.paymentId,
    status: memberIdentifier ? 'PENDING' : req.body.status,
  };
  
  const result = await bhojanshalaService.createPass(organizationId as string, memberId, passData);`;

const oldCode = `  const passData = { ...req.body };
  if (memberIdentifier) {
    passData.status = 'PENDING';
  }
  
  const result = await bhojanshalaService.createPass(organizationId as string, memberId, passData);`;

code = code.replace(newCode, oldCode);
fs.writeFileSync('src/modules/bhojanshala/bhojanshala.controller.ts', code);
