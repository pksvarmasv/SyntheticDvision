//=======================================================
// Copyright (C) 2022, 2024, JANBAV.
// Author : Sudhir Varma
//=======================================================

// Global variables. 
var tblBkGround = "black";
var tblForeGround = "white";
var tblRowLabelBkGround = "green";
var tblRowLabelForeGround = "white";
var tblHiliteBkGround = "red";
var tblHiliteForeGround = "white";
var tblTempBkGround = "blue";
var myArray= [[], [], []]; 

// Since there is a state machine, easier to use global variables than passing parameters around.
var Step = 0;
var numCols;
var numRows = 3;	// Divisor & Dividend, calculation, result
var divider = "";
var dividee = "";
var remainder;
var quotient;
var num = 0; 

var currentCol=0;	// current column we are updating. Start with column 1	
var doneSolving = false;
var hideSteps = false;
var exerciseMode = false;
var lsdigit = true;

var coeffArr = [];
var exponentArr = [];
var denom = 0;

var tbl = document.getElementById("Tbl");

function OnPageLoad()
{
}

// Allow only number keys. Prevent keys from A..Z etc., 
function LimitKeys(event)
{
	if (((event.keyCode >= 65) && (event.keyCode <= 90)))  {	// Prevent a-z.
		event.stopPropagation();
		event.preventDefault();
	}

	if ((event.shiftKey) && ((event.keyCode >= 48) && (event.keyCode <= 57)))  {	// Prevent !, @, #, ....
		event.stopPropagation();
		event.preventDefault();
	}
	
	// Prevent other characters like Space, Enter, ....
	if ((event.code == "Enter") || 		(event.code == "Space") || (event.code == "Minus") || (event.code == "Equal") ||
		(event.code == "Semicolon") || (event.code == "Quote") || (event.code == "Comma") || (event.code == "Period") ||
		(event.code == "Slash") ||  (event.code == "BracketLeft") || (event.code == "BracketRight") ||
		(event.code == "Backslash") || (event.code == "Backquote"))	{	 
		event.stopPropagation();
		event.preventDefault(); 
	}
}


// Handle keystrokes pertaining to table
function tblKeyDown(event)
{
	if (tbl.style.visibility == "visible") {
		if (!exerciseMode) { // if not in exercise mode
			if (event.ctrlKey && event.altKey && (event.keyCode == 84)) {	// Ctl-alt-T shortcut for "step-by-step"
				if (doneSolving) {
					alert("We are done solving. " + document.getElementById("Answer").innerHTML);	// Notify the user
					document.getElementById("Answer").focus();
				} else {
					nextStep();	// ctrl-alt-t takes you to "next step"
					}
				}
			} else {	// In Exercise mode
				LimitKeys(event);	// allow only number keys

				if (event.ctrlKey && event.altKey && (event.keyCode == 86)) {	// Ctl-alt-V shortcut for "Verify"
					verify();
				}	
			}
	}
}

function showSteps() {
  document.getElementById("StepsHeading").style.backgroundColor = "#FFEA00";
  document.getElementById("StepsHeading").style.visibility = "visible";
  document.getElementById("Steps").style.visibility = "visible";
  updateSteps(0);
}

function createTbl(numCols)
{
  tbl.style.visibility = "visible";
	  
  // Create columns based on the number of terms	
  for (let i=0; i < 3; i++) {
	tbl.getElementsByTagName("tr")[i].cells[1].innerHTML = "";

	if (exerciseMode)
		tbl.getElementsByTagName("tr")[i].cells[1].setAttribute("contenteditable","true");
	else		
		tbl.getElementsByTagName("tr")[i].cells[1].setAttribute("contenteditable","false");
	
	for (let j=0; j < numCols-2; j++) {	// We already created 2 columns in html. So -2.
		let cell = tbl.getElementsByTagName("tr")[i].insertCell(1);
		cell.innerHTML = "";
		if (exerciseMode)
			cell.setAttribute("contenteditable","true");
		else		
			cell.setAttribute("contenteditable","false"); // true
	}
  }
}


function showAnswer()
{
	document.getElementById("AnswerHeading").style.visibility = "visible";
	document.getElementById("AnswerHeading").style.backgroundColor = "#FFEA00";
	solution = "Quotient : ";

	for (let i=1; i < numCols-1; i++) {	// last column is remainder, last but 1 is the constant term of quotient
		if ((i > 1) && (tbl.getElementsByTagName("tr")[2].cells[i].innerHTML  >= 0)) {
			solution += "+" ; // Add a "+" sign
		}
		if (i < (numCols-2)) {	// if not constant, add "x"
			solution += (tbl.getElementsByTagName("tr")[2].cells[i].innerHTML+ "x");
		
			if ((exponentArr[0]-i) > 1)
				solution += ("^"+ (exponentArr[0]-i));
		}
		else
			solution += (tbl.getElementsByTagName("tr")[2].cells[i].innerHTML);	// constant term (of the result)
	}

	solution += ", Reminder: " + tbl.getElementsByTagName("tr")[2].cells[numCols-1].innerHTML;
	if (tbl.getElementsByTagName("tr")[2].cells[numCols-1].innerHTML != 0)
		solution += ("/" + divider); 
	
	let answer = document.getElementById("Answer");
	answer.style.visibility = "visible";
	answer. style.fontWeight = 'bold';
	answer.innerHTML = solution;
}

function removeHighlight(r) 
{
  let tbl = document.getElementById("Tbl");	

  for (let i=0; i < r; i++){	
	row = tbl.getElementsByTagName("tr")[i];
	
	for (let j=0; j < numCols; j++) {
  	  cell = row.cells[j];
	  cell.style.backgroundColor = tblBkGround;
	  cell.style.color = tblForeGround;
	}
  }
}

function updateSteps(step)
{
	let text = "";
    let steps = document.getElementById("Steps");
	
	switch (step) {
	  case 0:
	    text = "- The table has 2 lines.\n"; 
		text = text + "- First item in Line 1 is for storing 'Quotient'."; 
		text = text + " First column of line 2 is for storing Divisor. The remaining columns in line 2 are for Divident.<br>";
		text += "- Copy Divisor (" + divider + ") over to line 2, column 1. Copy Divident (" + dividee + ") over to the rest of the columnns, one digit at a time into line 2.<br>";
		steps.innerHTML = "<b>" + text + "</b>";
		break;
		
	  case 1:
	    text += "- Find the biggest possible number in the divident that is greater than or equal to the divisor. In our case it is " 
		+ num + ". Let us call this intermediate divident.<br>"; 
		  steps.innerHTML += "<b>" + text + "</b>";
		break;
		
	  case 2:	
	    text += "- Divide this intermediate divident (" + num + ") by Divisor (" + divider + "). Store the quotient (" + quotient + ") in line 1. Store the result of multiplying Divisor (" + divider + ") and quotient (" +  quotient + "), i.e, " + (divider * quotient) + " in line 3. <br>"; 
		steps.innerHTML += "<b>" + text + "</b>";
        break;
	  
	  case 3:	
	  case 5:
        if ((num < divider)) //////  && (currCol >= (numCols-1)))
		  text += "- Since intermediate divident (" + num + ") is less than divisor add a zero to quotient. <br>"; 
		else 
	     text += "- Subtract Line " + (numRows-1) + " (" +  (divider * quotient) + ") from intermediate divident (" + num + "). Store the value (" + (num - (divider * quotient))+  ") in line " + numRows + ". <br>"; 
		
		steps.innerHTML += "<b>" + text + "</b>";
		break;

	  case 4:	
	    text += "- Copy the next digit from the Divident, i.e., " + myArray[1][currCol] + ", to line " + numRows + ". This is now the intermediate divident, which is " + remainder + ", and we use this for the next steps.<br>"; 
		steps.innerHTML += "<b>" + text + "</b>";
		break;

	  case 6:	
        text += "- Since remainder (" + remainder + ") is less than divisor (" + divider + ") and no more digits left in the divident (" + dividee + "), we are done. <br>"; 

		steps.innerHTML += "<b>" + text + "</b>";
		break;
		
	}
}

function updateArray(col, qtnt, rmndr) 
{
  let qStr = qtnt.toString(); // quotient);
  let rStr = rmndr.toString(); // remainder);
  
  myArray.push([-1]);
  myArray.push([-1]);

  for (let j=0; j < (numCols-1); j++) {
	myArray[numRows].push(-1);
	myArray[numRows+1].push(-1);
  }
 
  for (i=0; i < qStr.length; i++)		// Store "quotient"
	myArray[0][col] = Number(qStr[i]);
	
  let num1 = divider * qtnt;
  str = num1.toString();
	
  for (i=0; i < str.length; i++)	// Store temporary result/step
	myArray[numRows][currCol-i] = Number(str[str.length - i -1]);


  for (i=0; i < rStr.length; i++)		// Store Remainder
	myArray[numRows+1][currCol-i] = Number(rStr[rStr.length - i -1]);

  numRows+=2;

}

function initArray()
{
	for (let i = 0; i < 3; i++) {
		for (let j=0; j < (coeffArr.length+1); j++) {	// +1 for the divident
			myArray[i].push(""); 
		}
	}
	myArray[0][0] = (-1 * denom);
	
	for (let i=0; i < coeffArr.length; i++) {
		myArray[0][i+1]= coeffArr[i];
	}
}

// Compute the solution
function compute()
{
	initArray();
	
	myArray[2][1] = coeffArr[0]; // Copy first coefficient as is to result
	
	for (let i = 1; i < coeffArr.length; i++) {
		myArray[1][i+1] = myArray[0][0] * myArray[2][i]; // Intermediate result (denom * next coeff)
		myArray[2][i+1] = myArray[0][i+1] + myArray[1][i+1];
	}
}

function UpdateCell(Row, Cell, Val, BkColor, FgColor) {
  tbl.getElementsByTagName("tr")[Row].cells[Cell].style.backgroundColor = BkColor;
  tbl.getElementsByTagName("tr")[Row].cells[Cell].style.color = FgColor;
  tbl.getElementsByTagName("tr")[Row].cells[Cell].innerHTML = Val;
}


function nextStep() {
  var idx;
  var row;
  var cell;
 
  switch (Step) {
    case 0:
	  if (!validateInput())
	    return false;
	
	  compute(Step);	// Do the calculation
	  
 	  createTbl(numCols);
	  // Display divisor
	  row = tbl.getElementsByTagName("tr")[0];
	  cell = row.cells[0];
  	  // Highlight the just modified cells
	  cell.style.backgroundColor = tblHiliteBkGround;
	  cell.style.color = tblHiliteForeGround;
	  cell.style.borderWidth = "5px";
	  cell.style.borderColor = "white";
	  cell.style.borderStyle = "double";
      cell.innerHTML= myArray[0][0];
	  
	  showSteps();
      document.getElementById("btnSolve").disabled = true;
      document.getElementById("btnExercise").disabled = true;
      document.getElementById("btnVerify").disabled = true;
	  document.getElementById("btnNextStep").disabled = true;
	  setTblCursor(1, 0);	// set cursor
	  tbl.focus(); 
	break;
		
    case 1:	// Display dividend
	  removeHighlight(numRows);
	  row = tbl.getElementsByTagName("tr")[0];

	  for (let i=1; i < numCols; i++) {
	    cell = row.cells[i];
	    // Highlight the just modified cells
	    cell.style.backgroundColor = tblHiliteBkGround;
		cell.style.color = tblHiliteForeGround;
		cell.innerHTML= myArray[0][i];
	  }

	  updateSteps(1);
      break;

	case 2:
	  removeHighlight(numRows);	
   	  UpdateCell(0,1, myArray[0][1], tblTempBkGround, tblHiliteForeGround);	// highlite first term of divident
   	  UpdateCell(2,1, myArray[2][1], tblHiliteBkGround, tblHiliteForeGround);	// COpy firstterm over to result
	  currCol = 1;
	  updateSteps(2);
	  break;
	  
	case 3:	// subtract
	  removeHighlight(numRows);	
	  // Multiply divisor and the copied over term (in result)
	  // Copy the value to second line
   	  UpdateCell(2,currCol, myArray[2][currCol], tblTempBkGround, tblHiliteForeGround);	// result (term)
   	  UpdateCell(0,0, myArray[0][0], tblTempBkGround, tblHiliteForeGround);	// divisor
	  currCol += 1;
   	  UpdateCell(1,currCol, myArray[1][currCol], tblHiliteBkGround, tblHiliteForeGround);	// copy to Line 1
	  updateSteps(3);
		  
	  break;
	  
	case 4:  
  	  removeHighlight(numRows);
	  // Term and intermediate value. Copy to result
   	  UpdateCell(0,currCol, myArray[0][currCol], tblTempBkGround, tblHiliteForeGround);	// Term
   	  UpdateCell(1,currCol, myArray[1][currCol], tblTempBkGround, tblHiliteForeGround);	// Temp value (from line 1)
   	  UpdateCell(2,currCol, myArray[2][currCol], tblHiliteBkGround, tblHiliteForeGround);	// result (term)
	  updateSteps(4);

	  if (currCol < (numCols-1))
		  Step = 2;		// Prepare to go back and process other terms

	  break;

	case 5:
	  // We are done. Highlight the result and display answer
	  document.getElementById("btnNextStep").disabled = true;
	  doneSolving = true;
  	  removeHighlight(numRows);

      for (let i=1; i < numCols; i++) {
		UpdateCell(2,i, myArray[2][i], tblHiliteBkGround, tblHiliteForeGround);	// result (term)
	  }

      updateSteps(Step);
	  showAnswer();

	  let text = "\n<b>- We have now processed all columns and the problem is solved. ";
	  text += document.getElementById("Answer").innerHTML + "</b>";
	  // Alert happend before "Steps" is updated. Hence the following "wrapping" code.
	  setTimeout(function() {
	    alert("We are done solving. " + document.getElementById("Answer").innerHTML);	// Notify the user
      },  100);
	  document.getElementById("btnNextStep").disabled = true;
	  tbl.focus();
	  break;
  }	// end switch
  
  return true;
}


function setTblCursor(x, y) 
{
  let s = window.getSelection();
  let r = document.createRange();
  r.selectNodeContents(tbl.getElementsByTagName("tr")[x].cells[y]);
  s.removeAllRanges();
  s.addRange(r); 
 }

function getCursor() 
{
  // Now get the current cursor postion (row, column) and save it for future use when we get back focus
}

function exercise()
{
  if (!validateInput()) {
	return;
  }

  exerciseMode = true;	// We are in Exercise mode
  document.getElementById("btnExercise").disabled = true;
  document.getElementById("btnVerify").disabled = false;
  document.getElementById("btnSolve").disabled = true;
  document.getElementById("btnNextStep").disabled = true;
  
  let numCols = maxDigits;

  createTbl(numCols);
  tbl.focus();	// set focus to our table
  setTblCursor(0, 1);	// set cursor 	
}

function compareAnswers()
{
	let tbl = document.getElementById("Tbl");	
	
    for (let i=1; i <= maxDigits; i++) {
		if (myArray[3][i] != tbl.getElementsByTagName("tr")[3].cells[i].innerHTML)
			return false;
	}
	
	return true;
}

function verify()
{
  hideSteps=true;
  compute();	// Do the calculation

// ask them to retry. Ask them to press F5 and restart. Later add a separate button to retry so they need not enter the numbers again.
	
  document.getElementById("AnswerHeading").style.visibility = "visible";
  document.getElementById("AnswerHeading").style.backgroundColor = "#FFEA00";
  let answer = document.getElementById("Answer");
  answer.style.visibility = "visible";
  answer.style.color = tblHiliteForeGround;
  
  if (compareAnswers()) {
    answer.style.backgroundColor = "green";
	answer.innerHTML = "Answer is correct. Congratulations";
  }
  else {
    answer.style.backgroundColor = tblHiliteBkGround;
	answer.innerHTML = "Sorry, answer is incorrect.";  
  }
  alert(answer.innerHTML);	// Notify the user
  answer.focus();
  document.getElementById("btnVerify").disabled = false;

}

// Maximum power of x in the equation


// Check if dividee is valid
// The terms could start with a + or -
// Coefficient could be blanks. So assume 1.
// Power could be blank. Assume 0.
// Terms should be in descending powers.
// If a term with the next lower power is missing, assume 0x0
// Make sure the format is correct (like ax^n, bx^n-1, ....)
// Make sure no invalid characters  
function validateDividee(dividee) {
  let text="0";	 
  let idx= 0;	// Temporary location to store index
  let terms=[];
  let str="";
  
  // Separate out the individual terms. This is a 2 step process. The terms (coefficients) can be positive or negative. 
  splits = dividee.split("+");	// First break the expression based on positive sign
  for (i=0; i < splits.length; i++) {
	if (splits[i] == "")	// if expression starts like +x3, split creates 2 entries - "", and "x3". Ignore the "".
		continue;

	str = splits[i].trim();	// Remove any white spaces

	if (str[0] != "-") {	// Let us add a explicit "+" sign for the term we just extracted. 
		str = "+" + str;
		splits[i] = str;		
	}
	
	// The terms we extracted themselves may be composite (like x3-3x2) since we broke the expression only at "+" boundary
	//  Now need to break at "-" boundary as well.
	idx = splits[i].indexOf("-", 0);	// Now look for "-"
	if (idx == -1) {	// No "-" in this item
		terms.push(splits[i])
	} else {
		splits2= splits[i].split("-");	// This by itself is an expression. Let us split it again
		for (j=0; j < splits2.length; j++) {
			str = splits2[j];
			if (str == "") continue;
			
			if (str[0] != "+")
				terms.push("-" + splits2[j].trim());	// Add "-" sign
			else
				terms.push(splits2[j].trim());
		}
	}
  }

// Now we have an array with each term being an element in the array
// We will create 2 arrays - one for coefficient, one for exponent.
  
	let expr = "";
  
	for (i=0; i < (terms.length); i++) {
		expr = terms[i];
		idx = expr.indexOf("x",0);
		
		if (idx == -1) {	// Did not find x
			if (i= (terms.length-1)) { // if this is the last term, then this is the constant
				if (isNaN(exp)) {
					alert("Constant must be a number"); // it is an error
					return false;
				} else {
					coeffArr.push(Number(expr)); // Store the constant
					return true;
				}
			} else {
				alert("Term "+ i+1 + " is not in correct format"); // it is an error
				return false;
			}
		}
		
		if (idx==1) {	// if there is no coefficient specified
			if (expr[0] == "-")
				coeffArr.push(-1);	// Assume coefficient is -1
			else
				coeffArr.push(1);	// Assume coefficient is 1
		} else
			coeffArr.push(Number(expr.substring(0, idx)));	// Store coefficient
		
		if (i == (terms.length-1)) {	// This is the last term, but it also has a "x"
			coeffArr.push(0); // Constant is zero
		}
		
		if (idx == (expr.length-1))	// if no power specified
			exponentArr.push(1); // assume 1
		else {
			if (expr[idx+1] != "^")	{ // Next one should be a ^
				alert("Term "+ i+1 + " missing a ^"); // it is an error
				return false;
			} else {
				exp = expr.substring(idx+2, expr.length);	// Get the power
				if (isNaN(exp)) {
					alert("Term "+ i+1 + " - power must be a number"); // it is an error
					return false;
				} else 
					exponentArr.push(Number(exp)); 
			}
		}
	}
	return true;
}

// Check if divider is valid
function validateDivider(divider)
{
	if (divider[0] != "x") {
		alert("Divisor should be in the form x+a");
		return false;
	}
	
	if (divider.length == 1)
		denom = 0;
	else {
		str = divider.substr(1, divider.length);
		if (isNaN(str)) {
			alert("Divisor should be in the form x+a"); // it is an error
			return false;
		} else	
			denom = Number(divider.substr(1, divider.length));
	}
	return true;
}

function validateAll()
{
	let maxPower=0;
	
	maxPower=exponentArr[0];	// First term should have the highest power
	let currMax = maxPower;
	for (let i=1; i < maxPower; i++) {	// make sure the powers of terms are in descending order
		if (i >= exponentArr.length) {	// if user did not specify enough exponents
			exponentArr.push(0);	// assume 0
			coeffArr.splice(i, 0, 0);
		} else if (exponentArr[i] >= currMax) {	
			alert("Power not in descending order");
			return false;
		} else if (exponentArr[i] < (currMax -1)) {	// if we have a missing term for power, add 0x^power
			exponentArr.splice(i,0, currMax-1);
			coeffArr.splice(i, 0, 0);
		}
		currMax -= 1;	
	}
	return true;
}

function validateInput() {
  dividee = document.getElementById("dividend").value;
  divider = document.getElementById("divisor").value;

  if (dividee == ""){
    alert("Dividend cannot be blank");
	return false;
  }
  
  if (divider == ""){
	alert("Divisor cannot be blank");
	return false;
  }

  // Make sure we have only valid characters (numbers, ^, x, +, -) 
  for (let i=0; i < dividee.length; i++) {
	if (((dividee[i].charCodeAt(0) < 48) && (dividee[i] != '+') && (dividee[i] != '-')) ||
		((dividee[i].charCodeAt(0) > 57) &&  (dividee[i] != 'x') && (dividee[i] != 'X') && (dividee[i] != '^'))) {
		alert("Divident should be in the form ax^n+bx^n-1+c");
		return false;
	}
  }	  
  
  for (let i=0; i < divider.length; i++) {
	if (((divider[i].charCodeAt(0) < 48) && (divider[i] != '+') && (divider[i] != '-')) ||
		((divider[i].charCodeAt(0) > 57) &&  (divider[i] != 'x') && (divider[i] != 'X'))) {
		alert("Divident should be in the form x+b");
		return false;
	}
  }	  

  if (validateDividee(dividee))  
	if (validateDivider(divider))
		if (validateAll()) {
			numCols = coeffArr.length + 1;
			currentCol = 1; // We are going to start with the column 1. Column 0 is divisor.
			return true;
		}
  
  return false;
}


function solve() {
  while (!doneSolving) {
	if (!nextStep())
	  break;
  
	Step = Step + 1;
  }
}

function stepByStep() {
  if (!doneSolving) {
	if (nextStep()) 
	  Step = Step + 1;
  
	document.getElementById("btnNextStep").disabled = false;

  }
}

