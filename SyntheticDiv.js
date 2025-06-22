// Global variables. Since there is a state machine, easier to use global variables than passing parameters around.
var Column = 0;
var Row1 = 0;
var Count = 0;
var Step = 0;
const coeffs = [];	// coefficient of each term, including the constant in the numerator
const terms = []; // array to store individual terms in the equation
var maxPower = 0;
var denom = 0;
var divisor = "";
var divident = "";
var row0;
var row1;
var row2;
var x0;
var x1;
var x2;

var currentCol=1;	// current column we are updating. Start with column 1	
var doneSolving = false;

  
// Maximum power of x in the equation
function getMaxPower() {
  if (dividend == ""){
	alert("Dividend cannot be blank");
	return false;
  }
  let xIdx=0;	// start with first character
  let text="0";	 
  let plusIdx = 0;
  let minusIdx = 0;
  let idx= 0;	// Temporary location to store index
  
  // Find the first "x" and get the coefficient
  xIdx = dividend.indexOf("x");
  plusIdx = dividend.indexOf("+", xIdx);	// // Get the next location of "+"
  
  if (plusIdx == -1)
	  plusIdx = 0xFFFF;

  minusIdx = dividend.indexOf("-", xIdx);	// // Get the next location of "-"

  if (minusIdx == -1)
	  minusIdx = 0xFFFF;

  idx = plusIdx;

  if ((minusIdx != 0xFFFF) && (minusIdx < plusIdx)) { // if we found a "-" before the next plus, then coeffient is negative
    idx = minusIdx;
  }
	
  if (idx != 0xFFFF) {
    text = dividend.substring(xIdx+1,idx);	// get the "power" of the first term
  }

  return Number(text);
}

function createTextArea() {
  var txtArea = document.createElement("TEXTAREA");
  txtArea.setAttribute("id", "messageArea");
  document.body.appendChild(txtArea);
  txtArea.setAttribute("rows",15);
  txtArea.setAttribute("cols","100");
  txtArea.setAttribute("readonly", true);
}

function createTbl(numCols) {
  let tbl = document.createElement("TABLE");
  tbl.setAttribute("id", "myTable");
  document.body.appendChild(tbl);
  tbl.style.border = "1px solid black";

  row0 = document.createElement("TR");
  row0.setAttribute("id", "row0");
  document.getElementById("myTable").appendChild(row0);

  row1 = document.createElement("TR");
  row1.setAttribute("id", "row1");
  document.getElementById("myTable").appendChild(row1);

  row2 = document.createElement("TR");
  row2.setAttribute("id", "row2");
  document.getElementById("myTable").appendChild(row2);


  for (let i = 0; i < numCols; i++) {
    row0.insertCell(i);
    row1.insertCell(i);
    row2.insertCell(i);
	row0.cells[i].innerHTML = "";
	row1.cells[i].innerHTML = "";
	row2.cells[i].innerHTML = "";
	}
	x0=row0.cells;
	x1=row1.cells;
	x2=row2.cells;
}

function removeHighlight() 
{
	for (let i=0; i <= coeffs.length; i++) {
	x0[i].style.backgroundColor = "blue";
	x0[i].style.color = "white";
	x1[i].style.backgroundColor = "blue";
	x1[i].style.color = "white";
	x2[i].style.backgroundColor = "blue";
	x2[i].style.color = "white";
	}
}

function parseDenominator(divisor)
{
	idx = divisor.indexOf("+");
	sign = "-";	
	if (idx <= 0) {
		idx = divisor.indexOf("-");
		sign = "+";
	}
	if (idx <= 0) {
		alert("Divisor should be of the form ax+b or ax-b");
	}
	else {
		text = divisor.substring(idx+1,denom.length)
	}
	denom = sign + text;
}

function parseNumerator(numerator) {
  
  let xIdx = 0;	// start with first character
  let tmpIdx = 0;
  let text="";

  // Find the first "x" and get the coefficient
  xIdx = numerator.indexOf("x");
  
  if (xIdx == 0) {
	text="1";
  } else {
	text = numerator.substring(0,xIdx);
  }
 
  coeffs.push(text);	// add it to array	

  for (let i = 0; i < maxPower; i++) {
  // Now get the remaining co-efficients  
    let idx= 0;	// Temporary location to store index
    let plusIdx = numerator.indexOf("+", xIdx);	// // Get the next location of "+"
    if (plusIdx == -1)
	  plusIdx = 0xFFFF;

    let minusIdx = numerator.indexOf("-", xIdx);	// // Get the next location of "-"
    if (minusIdx == -1)
	  minusIdx = 0xFFFF;

	// Determine the sign of the coeffcient
	let sign ="";
	idx = plusIdx;
	  
	if ((minusIdx != 0xFFFF) && (minusIdx < plusIdx)) { // if we found a "-" before the next plus, then coeffient is negative
	  idx = minusIdx;
	  sign = "-";
	}

	if (idx != 0xFFFF) {
	  terms.push(numerator.substring(tmpIdx,idx));
	  tmpIdx = idx+1;
	  xIdx = numerator.indexOf("x", idx+1);	// Get the next location of "x"

	  if (xIdx > 1) {	// if it is not the "constant" term 
		text = numerator.substring(idx+1,xIdx);	// get the co-efficient
	  }
	  else {	// it is the "constant" term
	    text = numerator.substring(idx+1,numerator.length);	// get the co-efficient
		}
	  if (text == "") {	// if no co-efficient specified, display a 0 
	    text = "1";
	  }
      coeffs.push(sign+text);	// add it to array	
	}	
   }
}
function showAnswer(row)
{
	let solution= "Quotient = ";
	let para = document.createElement("p");
    var solutionMsg = document.createTextNode(solution);
    para.appendChild(solutionMsg);
    document.body.appendChild(para);

	for (let k=1; k <= maxPower; k++)  {
		if (Number(row[k].innerHTML != 0)) {  // If coefficient is 0, don't display the entire term
			if (Number(row[k].innerHTML == 1) || Number(row[k].innerHTML == -1)) {	// Don't display if it is "1"
				solution = solutionMsg.data;
			}
			else
				solution = solutionMsg.data + row[k].innerHTML;
			
			if (k < maxPower)
				solution = solution + "x";
				
					
			if ((maxPower-k) > 1) {	// if power is 1, don't display power
				solution = solution + (maxPower-k);
			}	
			if ((k < maxPower) &&  (Number(row[k+1].innerHTML) >= 0))
				solution = solution + "+";
		}
			solutionMsg.data = solution;
	}	
			solutionMsg.data = solutionMsg.data + ".    Reminder = " + (row[maxPower+1].innerHTML) + " / (" + divisor + ")";
}

function updateTextArea()
{
	var msgArea = document.getElementById("messageArea");	
	let text = "";
	
	switch (Step) {
	  case 0:
	    text = "There are " + (maxPower+1) + " terms in the numerator. Let us create a table with " + (maxPower + 2) + " columns and 3 rows.\n"; 
		text = text + "Row 1 is for storing the terms in the denominator and numerator \n"; 
		text = text + "First column in first row is to store the term in denominator. Rest of the columns are to store the terms of the numerator \n";
	    text = text + "Row 2 is used to store values while solving the problem \n";
		text = text + "Row 3 is used to store the results whiile solving the problem \n";
		text = text + "We will not use column 1 of row 2 and row 3. So it is always left blank.\n"
		text = text + "Let us start solving...\n";
        msgArea.setAttribute("readonly", false);
	    msgArea.value += text;		
        msgArea.setAttribute("readonly", true);
		break;
		
	  case 1:
		text = text + "First store the inverse of the constant term of denominator in column 1 of row 1. \n"
	    sign = denom[0];
	    if (sign == "-") {
		  sign = "+";
	    }
	    else
		  sign = "-";
	  
	    text = text + "The constant is " + sign + denom.substring(1,denom.length) + " so inverse is " + denom + ".\n";
        msgArea.setAttribute("readonly", false);
	    msgArea.value += text;		
        msgArea.setAttribute("readonly", true);
		break;
		
	  case 2:	// Now for displaying the numerator coefficients
    	text = "Now copy coefficients of the numerator to the table. The coefficients of the numerator are "; 
		
		for (let i=0; i < maxPower+1; i++) {
			text += coeffs[i] + " ";
        }
		text += "\n";
    	text += "Let us copy them to the columns 2 to " + (maxPower+2) + " of row 1 \n"; 
        msgArea.setAttribute("readonly", false);
	    msgArea.value += text;		
        msgArea.setAttribute("readonly", true);
        break;

      case 3:
        text = "Now just copy the first coefficient of numerator, which is " + coeffs[0] + " to row 3, column 2 \n"; 
	    msgArea.setAttribute("readonly", false);
	    msgArea.value += text;		
        msgArea.setAttribute("readonly", true);
        break;
		
	  case 4:
        text = "Multiple row 1 column 1 (denominator term) with row 3 column " + (currentCol+1) + " (which is " + x2[currentCol].innerHTML + ")\n";
		text = text + "Copy the multipled value to row 2 column " + (currentCol+1) + "\n";
	    msgArea.setAttribute("readonly", false);
	    msgArea.value += text;		
        msgArea.setAttribute("readonly", true);
		break;	  
	
	  case 5:
		text = "Add row 1 column " + (currentCol+1) + " and row 2 column " + (currentCol+1) + ". Copy to row 3 column " +  (currentCol+1) + "\n" 
	    msgArea.setAttribute("readonly", false);
	    msgArea.value += text;		
        msgArea.setAttribute("readonly", true);
	}
}

function updateArray() {
  switch (Step) {
	  case 0:
		break;
		
	  case 1:
	    x0[0].innerHTML=denom;
		x0[0].style.backgroundColor = "red";
		x0[0].style.color = "white";
		break;
		
	  case 2:
		removeHighlight();
	    for (let i=1; i <= coeffs.length; i++) {
			x0[i].innerHTML= coeffs[i-1];	// Copy coeffients of numerator to row 0
			x0[i].style.backgroundColor = "red";
			x0[i].style.color = "white";
		}	
		break;

	  case 3:
		removeHighlight();
		x2[1].innerHTML=x0[1].innerHTML;	// Copy row0, col1 (first coefficient of numerator) to row2, col1
		x2[1].style.backgroundColor = "red";
		x2[1].style.color = "white";
		break;

	  case 4:
		removeHighlight();
		value = Number(x0[0].innerHTML) * Number(x2[currentCol].innerHTML); 	// Multiply row2, col1 & row0, col0 (denominator).
		x1[currentCol+1].style.backgroundColor = "red";
		x1[currentCol+1].style.color = "white";
		x1[currentCol+1].innerHTML= value.toString();	//  Copy to row1 col2 
		break;
		
	  case 5:
		removeHighlight();
		value = Number(x0[currentCol+1].innerHTML) + Number(x1[currentCol+1].innerHTML);		// Add row0 col2 & row 1 col2. Copy to row2 col2
		x2[currentCol+1].style.backgroundColor = "red";
		x2[currentCol+1].style.color = "white";
		x2[currentCol+1].innerHTML= value.toString();	//  Copy to row1 col2 
		currentCol = currentCol + 1;
		
		if (currentCol >= (maxPower+1)) {		// We are done calculating
			doneSolving = true;
			document.getElementById("btnNextStep").disabled = true;
			let msgArea = document.getElementById("messageArea");	
			let text = "We have now processed all columns and the problem is solved. See answer below.";
			msgArea.setAttribute("readonly", false);
			msgArea.value += text;		
			msgArea.setAttribute("readonly", true);

			showAnswer(x2);	
        } else {
			Step = 3;	// Kind of like looping thru the steps
		}
		
        break;	  
	}
}
	
function nextStep() {
	if (Step == 0) {
      if (!validateInput()) {
		  return false;
	  }

	  if (maxPower > 0) {
	    let numCols = maxPower + 2; // x terms + constant + denominator + label
        createTextArea();
        createTbl(numCols);
	    parseDenominator(divisor);
	    parseNumerator(dividend);
	  }
      
	  document.getElementById("btnSolve").disabled = true;
	  document.getElementById("btnExercise").disabled = true;
	  document.getElementById("btnVerify").disabled = true;
    }  
	
   	updateTextArea();
    updateArray();
	Step = Step + 1;
	return true;
}

function exercise() {
  if (!validateInput()) {
	return;
  }
  
  document.getElementById("btnExercise").disabled = true;
  document.getElementById("btnVerify").disabled = false;
  document.getElementById("btnSolve").disabled = true;
  document.getElementById("btnNextStep").disabled = true;
  
  let tbl = document.createElement("TABLE");
  tbl.setAttribute("id", "editableTbl");
  document.body.appendChild(tbl);
  tbl.setAttribute("contenteditable","true");
  
  tbl.style.height = "100px";
  tbl.style.width = "150px";

  r0 = document.createElement("TR");
  r0.setAttribute("id", "r0");
  document.getElementById("editableTbl").appendChild(r0);

  r1 = document.createElement("TR");
  r1.setAttribute("id", "r1");
  document.getElementById("editableTbl").appendChild(r1);

  r2 = document.createElement("TR");
  r2.setAttribute("id", "r2");
  document.getElementById("editableTbl").appendChild(r2);


  for (let i = 0; i < maxPower+2; i++) {
    r0.insertCell(i);
	r0.cells[i].innerHTML = " ";
    r1.insertCell(i);
	r1.cells[i].innerHTML = " ";
	r2.insertCell(i);
	r2.cells[i].innerHTML = " ";
	}
}

function verify() {
  solve();
}

function validateInput() {
  dividend = document.forms["myForm"]["numerator"].value;
  divisor = document.forms["myForm"]["denominator"].value;

  if (dividend == ""){
    alert("Dividend cannot be blank");
	return false;
  }
  
  if (divisor == ""){
	alert("Divisor cannot be blank");
	return false;
  }

  maxPower = getMaxPower();
  
  return true;
}

function solve() {
	if (!nextStep()) {
		return;
	}

	while (!doneSolving) {
		nextStep();
    }
}


  
function validateForm() {
}

// To do:
// Change the background/foreground of cells involved in an operation.
// After operation show in different color, the recently modified cell(s). 
// Set the background for Col1, rows 2 & 3 to "greyed out/opaque" to indicate they are not valid 
// make text bold, bigger????
// Make text in message box also more appealing. Add autoscroll.
